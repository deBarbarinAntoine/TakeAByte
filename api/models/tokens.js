const crypto = require('crypto');
const { createTokenQuery, getTokenQuery, deleteTokenQuery} = require("./db-queries");
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
        const hash = this.hashToken();
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
        return Date.now() + expiry_ms;
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
            const [result] = await connection.execute('SELECT user_id FROM password_reset_tokens WHERE token = ? AND end_date > ?', [token, new Date()]);
            if (result.length === 0) {
                return null;
            }
            return result[0].userID;
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
    const hash = crypto.createHash('sha512').update(token).digest('base64url');

    try {
        const [rows] = await connection.query(getTokenQuery, [hash]);
        if (rows[0].affectedRows === 0) {
            return [null, false];
        }
        return [rows[0].end_date, true];
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error; // Rethrow the error for handling in the caller
    }
}

module.exports = { Token, getToken };
