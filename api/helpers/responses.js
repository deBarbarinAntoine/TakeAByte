const response = require('../errors/status');

export function serverErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusInternalServerError).json({error: "internal server error"});
}

export function notFoundErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusNotFound).json({error: "resource not found"});
}

export function badRequestErrorResponse(res, error, message) {
    console.log(`error: ${error}`);
    res.status(response.StatusBadRequest).json({
        status: "bad request",
        message: message
    });
}

export function methodNotAllowedErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusMethodNotAllowed).json({error: "method not allowed"});
}

export function unauthorizedErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusUnauthorized).json({error: "unauthorized or invalid credentials"});
}

export function forbiddenErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusForbidden).json({error: "forbidden"});
}

export function conflictErrorResponse(res, error, message) {
    console.log(`error: ${error}`);
    res.status(response.StatusConflict).json({
        status: "conflict",
        message: message
    });
}