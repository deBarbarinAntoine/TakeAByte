const { unauthorizedErrorResponse } = require('../helpers/responses');
const { getToken, getUserIdFromToken, checkIfMod } = require("../models/tokens");

async function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        unauthorizedErrorResponse(res, new Error('Authorization header not found'));
        return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        unauthorizedErrorResponse(res, new Error('Invalid authorization header format'));
        return;
    }

    const bearer = parts[1];
    if (bearer.length !== 86) {
        unauthorizedErrorResponse(res, new Error('Invalid token format'));
        return;
    }

    try {
        const { endDate, found } = await getToken(bearer);

        if (!found) {
            unauthorizedErrorResponse(res, new Error('Invalid token'));
            return;
        }

        if (new Date(endDate) < new Date()) {
            unauthorizedErrorResponse(res, new Error('Token has expired'));
            return;
        }

        const userId = await getUserIdFromToken(bearer); // Fetch the user ID from the database
        if (!userId) {
            unauthorizedErrorResponse(res, new Error('User not found'));
            return;
        }

        let is_mod = await checkIfMod(userId);
        if (!is_mod) { is_mod = 0; } // Default to 0 if not a mod

        req.userId = userId; // Attach userId to the request object
        req.is_mod = is_mod; // Attach is_mod to the request object, 0 false, 1 true
        next();
    } catch (error) {
        console.error('Internal server error:', error);
        unauthorizedErrorResponse(res, new Error('Internal server error'));
    }
}

module.exports = authenticate;
