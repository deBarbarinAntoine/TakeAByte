const crypto = require('crypto');
const {createUserQuery, createTokenQuery, getTokenQuery} = require("./db-queries");
const connection = require("./db-connect");

const expiry_ms = process.env.TOKEN_EXPIRY_HOURS * 3_600_000;

class Token {
    tokenID;
    userID;
    token;
    createdAt;
    expiry;

    constructor(userID, token) {
        this.userID = userID;
        this.token = token;
        this.expiry = getExpiryTime();
    }

    static New(userID) {
        return new Token(userID, this.generateToken());
    }

    static generateToken() {
        return crypto.randomBytes(64).toString('base64url')
    }

    compare(token) {
        return this.token === hash(token);
    }

    async create(userID) {
        const hash = hash(this.token);

        const [rows] = await connection.execute(createTokenQuery, [this.userID, hash, this.expiry]);

        this.tokenID = rows[0].insertId;
    }
}

async function getToken(token) {
    const hash = hash(this.token);
    const [rows] = await connection.query(getTokenQuery, [token]);
    if (rows[0].affectedRows === 0) {
        return [null, false];
    }
    return [rows[0].end_date, true];
}

function hash(token) {
    return crypto.createHash('sha512').update(token).digest('base64url');
}

function getExpiryTime() {
 return date.now().getTime() + expiry_ms;
}


module.exports = {token: Token, getToken};