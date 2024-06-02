const {serverErrorResponse,
    notFoundErrorResponse,
    badRequestErrorResponse,
    methodNotAllowedErrorResponse,
    unauthorizedErrorResponse,
    forbiddenErrorResponse,
    conflictErrorResponse} = require('../helpers/responses');
const {User, errDuplicateEmail, errDuplicateUsername, checkCredentials} = require("../models/users");
const {newHash} = require("../helpers/authentication");
const response = require('../errors/status');
const {validateCredentials, validateNewUser, Validator, notEmpty, checkLength, matches, emailRX, passwordRX} = require("../helpers/validator");
const {generateToken} = require("../models/tokens");

async function register(req, res) {
    const data = req.body;
    if (!validateNewUser(data)) {
        badRequestErrorResponse(res, new Error('users/register bad request'), validateNewUser.errors);
        return;
    }

    const userValidator = Validator.New();
    userValidator.check(notEmpty(data.username), 'username', 'must be provided');
    userValidator.check(checkLength(data.username, 3, 25), 'username', 'must be between 3 and 25 bytes long');
    userValidator.check(notEmpty(data.email), 'email', 'must be provided');
    userValidator.check(matches(data.email, emailRX), 'email', 'invalid email');
    userValidator.check(notEmpty(data.password), 'password', 'must be provided');
    userValidator.check(data.password, passwordRX, "password", "must contain 1 lowercase and 1 uppercase letter, a digit and be at least 8 characters long");
    userValidator.check(data.password === data.confirm_password, 'password', 'passwords must be equals');

    if (!userValidator.valid()) {
        conflictErrorResponse(res, new Error('conflict error'), userValidator.errors);
        return;
    }

    let hash = '';
    try {
        hash = await newHash(data.password);
    } catch (err) {
        serverErrorResponse(res, err);
        return;
    }
    let user = await User.New(data.username, data.email, hash);
    try {
        const query = await user.create();
        user.id = query[0].insertId;
        const userJSON = user.toJson();
        res.status(response.StatusCreated).json({"response": response.StatusCreated, user: userJSON});
    } catch (err) {
        if (err === errDuplicateEmail || err === errDuplicateUsername) {
            conflictErrorResponse(res, err, err);
            return;
        }
        serverErrorResponse(res, err);
    }
}

async function login(req, res) {
    let data = req.body;
    if (!validateCredentials(data)) {
        badRequestErrorResponse(res, new Error('users/login bad request'), validateCredentials.errors);
        return;
    }

    const [user, ok] = await checkCredentials(data.email, data.password);
    if (!ok) {
        unauthorizedErrorResponse(res, new Error('unauthorized'));
        return;
    }

    const token = generateToken();
    res.status(response.StatusOK).json({"response": response.StatusOK, "user": {email: user.email, token: token}});
}

module.exports = {register, login};