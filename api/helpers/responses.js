const response = require('../errors/status');

function serverErrorResponse (res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusInternalServerError).json({error: "internal server error"});
}

function notFoundErrorResponse (res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusNotFound).json({error: "resource not found"});
}

function badRequestErrorResponse (res, error, message) {
    console.log(`error: ${error}`);
    res.status(response.StatusBadRequest).json({
        status: "bad request",
        message: message
    });
}

function methodNotAllowedErrorResponse (res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusMethodNotAllowed).json({error: "method not allowed"});
}

function unauthorizedErrorResponse (res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusUnauthorized).json({error: "unauthorized or invalid credentials"});
}

function forbiddenErrorResponse (res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusForbidden).json({error: "forbidden"});
}

function conflictErrorResponse (res, err, message) {
    res.status(response.StatusConflict).json({
        status: "conflict",
        error: message
    });
}

module.exports = {serverErrorResponse, notFoundErrorResponse, badRequestErrorResponse, unauthorizedErrorResponse, conflictErrorResponse};