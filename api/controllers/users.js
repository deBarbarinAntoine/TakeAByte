const {serverErrorResponse, notFoundErrorResponse,
    badRequestErrorResponse,
    methodNotAllowedErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse,
    conflictErrorResponse} = require('../helpers/responses');
const {User} = require("../models/users");
const {newHash} = require("../helpers/authentication");
const response = require('../errors/status')

exports.register = async (req, res) => {
    let data = req.body;
    if (!data || (!data.username || !data.password) || data.length !== 2) {
        badRequestErrorResponse(res, new Error('users/register bad request'));
        return;
    }
    try {
        var hash = newHash(data.password);
    } catch (err) {
        serverErrorResponse(res, err);
        return;
    }
    let user = await new User(data.username, hash);
    try {
        await user.create();
        res.status(response.StatusOK).json({"response": 200, user});
    } catch (err) {
        if (err.message === "duplicate entry") {
            conflictErrorResponse(res, err);
            return;
        }
        serverErrorResponse(res, err);
    }
};