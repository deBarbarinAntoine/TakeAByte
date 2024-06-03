const {serverErrorResponse,
    notFoundErrorResponse,
    badRequestErrorResponse,
    methodNotAllowedErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse,
    conflictErrorResponse} = require('../helpers/responses');
const response = require('../errors/status');
const {getToken} = require("../models/tokens");

async function authenticate(req, res, next) {
    const bearer = req.headers['Authorization'].split(' ')[1];
    if (!bearer) {
        unauthorizedErrorResponse(res, new Error('no token provided'));
        return;
    }
    if (bearer.length !== 86) {
        unauthorizedErrorResponse(res, new Error('invalid token format'));
        return;
    }
    const [expiry, ok] = await getToken(bearer);
    if (!ok) {
        unauthorizedErrorResponse(res, new Error('invalid token'));
        return;
    }
    if (expiry < date.now()) {
        unauthorizedErrorResponse(res, new Error('token has expired'));
        return;
    }

    next();
}