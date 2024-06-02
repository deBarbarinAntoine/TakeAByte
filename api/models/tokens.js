const crypto = require('crypto');

function generateToken() {
    return crypto.randomBytes(64).toString('base64url')
}

module.exports = {generateToken};