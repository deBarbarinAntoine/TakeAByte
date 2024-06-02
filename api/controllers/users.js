const {serverErrorResponse,
    notFoundErrorResponse,
    badRequestErrorResponse,
    methodNotAllowedErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse,
    conflictErrorResponse} = require('../helpers/responses');
const {User, errDuplicateEmail, errDuplicateUsername} = require("../models/users");
const {newHash} = require("../helpers/authentication");
const response = require('../errors/status');
const {validateCredentials, validateNewUser, Validator, notEmpty, checkLength, matches, emailRX} = require("../helpers/validator");
const {generateToken} = require("../models/tokens");

exports.register = async (req, res) => {
    const data = req.body;
    if (!validateNewUser(data)) {
        badRequestErrorResponse(res, new Error('users/register bad request'), validateNewUser.errors);
        return;
    }

    const userValidator = Validator.New();
    userValidator.check(notEmpty(data.username), 'username', 'must be provided')
    userValidator.check(checkLength(data.username, 3, 25), 'username', 'must be between 3 and 25 bytes long')
    userValidator.check(notEmpty(data.email), 'email', 'must be provided')
    userValidator.check(matches(data.email, emailRX), 'email', 'invalid email')
    userValidator.check(notEmpty(data.password), 'password', 'must be provided')
    userValidator.check(data.password === data.confirm_password, 'password', 'passwords must be equals')

    if (!userValidator.valid()) {
        conflictErrorResponse(res, new Error('conflict error'), userValidator.errors);
        return;
    }

    let hash = '';
    try {
        hash = newHash(data.password);
    } catch (err) {
        serverErrorResponse(res, err);
        return;
    }
    let user = await new User(data.username, hash);
    try {
        await user.create();
        const userJSON = user.toJson();
        res.status(response.StatusCreated).json({"response": response.StatusCreated, user: userJSON});
    } catch (err) {
        if (err === errDuplicateEmail || err === errDuplicateUsername) {
            conflictErrorResponse(res, err, err);
            return;
        }
        serverErrorResponse(res, err);
    }
};

exports.login = async (req, res) => {
    let data = req.body;
    if (!validateCredentials(data)) {
        badRequestErrorResponse(res, new Error('users/login bad request'), validateCredentials.errors);
        return;
    }

    const [user, ok] = User.checkCredentials(data.email, data.password);
    if (!ok) {
        unauthorizedErrorResponse(res, new Error('unauthorized'));
        return;
    }

    const token = generateToken();
    res.status(response.StatusOK).json({"response": response.StatusOK, "user": {email: user.email, token: token}});
}