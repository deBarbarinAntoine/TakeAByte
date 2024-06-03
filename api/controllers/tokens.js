const {serverErrorResponse,
    notFoundErrorResponse,
    badRequestErrorResponse,
    methodNotAllowedErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse,
    conflictErrorResponse} = require('../helpers/responses');
const response = require('../errors/status');

async function authenticate(req, res) {
    const bearer = req.headers['Authorization'].split(' ')[1];
    if (!bearer) {
        return res.status(response.StatusUnauthorized).send('No token provided');
    }
    if (bearer.length !== 86) {
        return res.status(response.StatusUnauthorized).send('Invalid token');
    }

}