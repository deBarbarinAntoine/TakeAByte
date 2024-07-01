const crypto = require('crypto');
const { createTokenQuery, getTokenQuery, deleteTokenQuery, getUserIdFromTokenQuery, isModQuery, getTokenFromUserIdQuery,
    verifyResetTokenQuery
} = require("./db-queries");
const connection = require("./db-connect");

const expiry_ms = process.env.TOKEN_EXPIRY_HOURS * 3_600_000;

class Token {
    constructor(userID, token) {
        this.userID = userID;
        this.token = token;
        this.expiry = this.getExpiryTime();
    }

    static New(userID) {
        return new Token(userID, this.generateToken());
    }

    static generateToken() {
        return crypto.randomBytes(64).toString('base64url');
    }

    async create() {
        const hash = this.token;
        try {
            await connection.execute(createTokenQuery, [this.userID, hash, this.expiry]);
        } catch (error) {
            console.error("Error creating token:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    hashToken() {
        return crypto.createHash('sha512').update(this.token).digest('base64url');
    }

    getExpiryTime() {
        return new Date(Date.now() + expiry_ms);
    }

    static async delete(token) {
        try {
            await connection.execute(deleteTokenQuery, [token]);
        } catch (error) {
            console.error("Error deleting token:", error);
            throw error; // Rethrow the error for handling in the caller
        }
    }

    static async generateResetToken(userID) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + expiry_ms);
        await Token.saveResetToken(userID, resetToken, expiry);
        return resetToken;
    }

    static async verifyResetToken(token) {
        try {
            const [result] = await connection.execute(verifyResetTokenQuery, [token, new Date()]);
            if (result.length === 0) {
                return null;
            }
            return result[0].user_id;
        } catch (error) {
            console.error("Error verifying reset token:", error);
            throw error;
        }
    }

    static async saveResetToken(userID, resetToken, expiry) {
        try {
            await connection.execute('INSERT INTO password_reset_tokens (user_id, token, end_date) VALUES (?, ?, ?)', [userID, resetToken, expiry]);
        } catch (error) {
            console.error("Error saving reset token:", error);
            throw error;
        }
    }
}

async function getToken(token) {
    try {
        const result = await connection.query(getTokenQuery, [token]);
        if (result && result.length > 0) {
            const endDate = result[0].end_date;
            return { endDate, found: true };
        } else {
            return { endDate: null, found: false };
        }
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error; // Rethrow the error for handling in the caller
    }
}


async function getUserIdFromToken(token) {
    try {
        const [rows] = await connection.query(getUserIdFromTokenQuery, [token]);
        if (rows.length > 0) {
            return rows[0].user_id;
        } else {
            return null; // No user found for the given token
        }
    } catch (error) {
        console.error('Error fetching user ID from token:', error);
        throw new Error('Database error');
    }
}

async function checkIfMod(user_id) {
    try {
        const [rows] = await connection.query(isModQuery, [user_id]);
        if (rows.length > 0) {
            return rows[0].is_mod;
        } else {
            return 0; // Default to 0 (not a mod) if no record found
        }
    } catch (error) {
        console.error('Error checking if user is mod:', error);
        throw new Error('Database error');
    }
}

async function getTokenFromUserId(userId) {
    try {
        const [rows] = await connection.query(getTokenFromUserIdQuery, [userId]);
        if (rows.length > 0) {
            return rows[0].token;
        } else {
            return null; // No user found for the given token
        }
    } catch (error) {
        console.error('Error fetching user ID from token:', error);
        throw new Error('Database error');
    }
}

async function getThisTokenFromUserId(req, res) {
    try {
        const userId = parseInt(req.params.id, 10);  // Ensure `id` is treated as a number
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const token = await connection.query(getTokenFromUserIdQuery, userId);
        if (token) {
            const selectedToken = token[0][0].token
            res.status(200).json({ selectedToken });
        } else {
            res.status(404).json({ error: 'Token not found for the given user ID' });
        }
    } catch (error) {
        console.error('Error fetching user token:', error);
        res.status(500).json({ error: 'Database error' });
    }
}


async function getUserIdFromUserToken(req, res) {
    const token = req.params.token;

    try {
        // Query the database for the user ID associated with the token
        const [rows] = await connection.execute(
            'SELECT user_id FROM tokens WHERE token = ? AND end_date > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Token not found or expired' });
        }

        const userId = rows[0].user_id;
        res.json({ user_id: userId });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { Token, getToken, getUserIdFromToken, checkIfMod,getTokenFromUserId ,getUserIdFromUserToken,getThisTokenFromUserId};
