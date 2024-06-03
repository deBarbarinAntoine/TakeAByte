const {serverErrorResponse,
    badRequestErrorResponse,
    unauthorizedErrorResponse,
    conflictErrorResponse, notFoundErrorResponse,
} = require('../helpers/responses');
const {User, errDuplicateEmail, errDuplicateUsername, checkCredentials, getUserByEmail, updatePassword} = require("../models/users");
const {newHash} = require("../helpers/authentication");
const response = require('../errors/status');
const {validateCredentials, validateNewUser, Validator, notEmpty, checkLength, matches, emailRX, passwordRX} = require("../helpers/validator");
const {Token} = require("../models/tokens");
const nodemailer = require('nodemailer');

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
    userValidator.check(matches(data.password, passwordRX), "password", "must contain 1 lowercase and 1 uppercase letter, a digit and be at least 8 characters long");
    userValidator.check(data.password === data.confirm_password, 'password', 'passwords must be equals');


    if (!userValidator.valid()) {
        conflictErrorResponse(res, new Error('conflict error'), userValidator.output());
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
        if (err.errno === 1062) {
            if (err.message.includes('email')) {
                conflictErrorResponse(res, err, errDuplicateEmail.message);
                return;
            } else if (err.message.includes('username')) {
                conflictErrorResponse(res, err, errDuplicateUsername.message);
                return;
            }
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

    // Generate a new token using Token class method
    const tokenInstance = Token.New(user.id);
    try {
        // Create the token in the database
        await tokenInstance.create();
    } catch (error) {
        serverErrorResponse(res, new Error('Error creating token'))
        return;
    }
    // Send response with user email and generated token
    res.status(response.StatusOK).json({"response": response.StatusOK, "user": {email: user.email, token: tokenInstance.token}});
}

async function logout(req,res){
    // Extract token from request headers, query parameters, or cookies
    const token = req.headers.authorization || req.query.token || req.cookies.token;
    // If token is not provided, send a bad request response
    if (!token) {
        badRequestErrorResponse(res, new Error('Token is missing'));
        return;
    }

    // Invalidate the token by deleting it from the database
    try {
        await Token.delete(token); // Assuming you have a method to delete the token
        res.status(response.StatusOK).json({"response": response.StatusOK, "message": "Logout successful"});
    } catch (error) {
        serverErrorResponse(res, new Error('Error logging out'))
    }
}

async function requestPasswordReset(req, res) {
    const { email } = req.body;
    let user = {};
    try {
        // Check if the email exists in the database
        try {
            user = await getUserByEmail(email);
        } catch (err) {
            console.error('Error checking credentials:', err);
        }

        // Generate a reset token and save it in the database
        const resetToken = await Token.generateResetToken(user.id);

        // Email the user with the reset token
        await sendResetEmail(user.email, resetToken);

        res.status(response.StatusOK).json({"response": response.StatusOK, "message": "Password reset email sent"});
    } catch (error) {
        return serverErrorResponse(res, error);
    }
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const userID = await Token.verifyResetToken(token);
        if (!userID) {
            return unauthorizedErrorResponse(res, new Error('Invalid reset token'));
        }

        // Validate the new password
        const passwordValidator = Validator.New();
        passwordValidator.check(notEmpty(newPassword), 'newPassword', 'must be provided');
        passwordValidator.check(matches(newPassword, passwordRX), "newPassword", "must contain 1 lowercase and 1 uppercase letter, a digit and be at least 8 characters long");
        if (!passwordValidator.valid()) {
            return conflictErrorResponse(res, new Error('Invalid password'), passwordValidator.output());
        }

        // Hash the new password
        let hash = '';
        try {
            hash = await newHash(newPassword);
        } catch (err) {
            return serverErrorResponse(res, "failled to hash password");
        }

        // Update the user's password in the database
        await updatePassword(userID, hash);

        // Send success response
        res.status(response.StatusOK).json({"response": response.StatusOK, "message": "Password reset successful"});
    } catch (error) {
        // Handle other errors
        return serverErrorResponse(res, "failed to change password");
    }
}


async function sendResetEmail(email, resetToken) {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f337c5e6bdfe11",
            pass: "********d0de"
        }
    });

    const mailOptions = {
        from: 'no-reply@adebarbarin.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetToken}`
    };

    try {
        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending reset email:", error);
        throw error;
    }
}

module.exports = {register, login,logout,requestPasswordReset,resetPassword};


const {query} = require("../models/db-connect");
const {getUserDataQuery, changeUserDataQuery, deleteUserQuery} = require("../models/db-queries");


exports.getUserData = (req, res) => {
    const { user_id } = req.params;
    query(getUserDataQuery, [user_id], (error, results) => {
        if (error) {
            return serverErrorResponse(res, "failed to get user data with given id");
        }
        if (results.length === 0) {
            return  notFoundErrorResponse(res, "empty answer");
        }
        res.status(200).json(results[0]);
    });
};

exports.changeUserData = (req, res) => {
    const { user_id } = req.params;
    const { username, email, country, city, zip_code, street_name, street_number, address_complements } = req.body;
    const values = [username, email, country, city, zip_code, street_name, street_number, address_complements, user_id];
   query(changeUserDataQuery, values, (error) => {
        if (error) {
            return serverErrorResponse(res, "failed to update user data");
        }
        res.status(200).json({ message: 'User details updated successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const { user_id } = req.params;
    query(deleteUserQuery, [user_id], (error) => {
        if (error) {
            return serverErrorResponse(res, "failed to delete user data with given id");
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
};
