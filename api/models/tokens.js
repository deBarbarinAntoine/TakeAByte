const crypto = require('crypto');

export function generateToken() {
    return crypto.randomBytes(64).toString('base64url')
}