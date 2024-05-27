const response = require('../errors/status');

export function serverErrorResponse(res, status, error) {
    console.log(`error: ${error}`);
    res.status(status).json({error: "internal server error"});
}

export function notFoundErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusNotFound).json({error: "resource not found"});
}

export function badRequestErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusBadRequest).json({error: "bad request"});
}

export function methodNotAllowedErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusMethodNotAllowed).json({error: "method not allowed"});
}

export function unauthorizedErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusUnauthorized).json({error: "unauthorized"});
}

export function forbiddenErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusForbidden).json({error: "forbidden"});
}

export function conflictErrorResponse(res, error) {
    console.log(`error: ${error}`);
    res.status(response.StatusConflict).json({error: "conflict"});
}