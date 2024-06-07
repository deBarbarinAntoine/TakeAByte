const {serverErrorResponse,
    badRequestErrorResponse,
    unauthorizedErrorResponse,
    conflictErrorResponse, notFoundErrorResponse,
} = require('../helpers/responses');
const {User, errDuplicateEmail, errDuplicateUsername, checkCredentials, getUserByEmail, updatePassword} = require("../models/users");
const {newHash} = require("../helpers/authentication");
const response = require('../errors/status');
const {validateCredentials, validateNewUser, Validator, notEmpty, checkLength, matches, emailRX, passwordRX,
    matchesMail, matchesPassword
} = require("../helpers/validator");
const {Token, getTokenFromUserId} = require("../models/tokens");
const nodemailer = require('nodemailer');

async function register(req, res) {
    const data = req.body;
// Sanitize input using parameterized queries
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const confirm_password = data.confirm_password;
    if (!validateNewUser(data)) {
        badRequestErrorResponse(res, new Error('users/register bad request'), validateNewUser.errors);
        return;
    }

    const userValidator = Validator.New();
    userValidator.check(notEmpty(username), 'username', 'must be provided');
    userValidator.check(checkLength(username, 3, 25), 'username', 'must be between 3 and 25 bytes long');
    userValidator.check(notEmpty(email), 'email', 'must be provided');
    userValidator.check(matchesMail(email, emailRX), 'email', 'invalid email');
    userValidator.check(notEmpty(password), 'password', 'must be provided');
    userValidator.check(matchesPassword(password, passwordRX), "password", "must contain 1 lowercase and 1 uppercase letter, a digit and be at least 8 characters long");
    userValidator.check(password === confirm_password, 'password', 'passwords must be equals');


    if (!userValidator.valid()) {
        conflictErrorResponse(res, new Error('conflict error'), userValidator.output());
        return;
    }
    userValidator.clear();

    let hash = '';
    try {
        hash = await newHash(password);
    } catch (err) {
        serverErrorResponse(res, err);
        return;
    }
    let user = await User.New(username, email, hash);
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
    res.status(response.StatusOK).json({"response": response.StatusOK, "user": {token: tokenInstance.token, ExpirationDate: tokenInstance.expiry}});
}

async function logout(req, res) {
    const userId = req.userId;
    let token;

    try {
        // Retrieve token associated with the user ID
        token = await getTokenFromUserId(userId);

        if (!token) {
            // If token not found, send a 404 Not Found response
            return notFoundErrorResponse(res, "Token not found for the user");
        }

        // Invalidate the token by deleting it from the database
        await Token.delete(token);

        // Send a successful logout response
        res.status(200).json({ "status": "success", "message": "Logout successful" });
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error logging out:", error);
        serverErrorResponse(res, "An unexpected error occurred during logout.");
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
            return serverErrorResponse(res, "failed to hash password");
        }

        // Update the user's password in the database
        await updatePassword(userID, hash);

        try{
            await  connection.query(deleteResetTokenQuery, [token])
        }catch (err){
        console.log("failed to delete the reset token")
        }

        // Send success response
        res.status(response.StatusOK).json({"response": response.StatusOK, "message": "Password reset successful"});
    } catch (error) {
        // Handle other errors
        return serverErrorResponse(res, error,"failed to change password");
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



const connection = require("../models/db-connect");
const {getUserDataQuery, changeUserDataQuery, deleteUserQuery, deleteResetTokenQuery} = require("../models/db-queries");

async function getUserData(req, res) {
    const { user_id } = req.params;

    try {
        const results = await connection.query(getUserDataQuery, [user_id]);
        if (results.length === 0) {
            return notFoundErrorResponse(res, "empty answer");
        }
        res.status(200).json(results[0]);
    } catch (error) {
        return serverErrorResponse(res, "failed to get user data with given id");
    }
}

async function getExistingUserData(req) {
    const { user_id } = req.params;

    try {
        const results = await connection.query(getUserDataQuery, [user_id]);
        if (results.length === 0) {
            return null
        }
        return results
    } catch (error) {
        return null
    }
}

async function changeUserData(req, res) {
    const { user_id } = req.params;

    const data = { username, email, country, city, zip_code, street_name, street_number, address_complements } = req.body;

    const changeUserValidator = Validator.New();
    if (data.username){
        changeUserValidator.check(checkLength(data.username, 3, 25), 'username', 'must be between 3 and 25 bytes long');
    }
    if (data.email){
        changeUserValidator.check(matchesMail(data.email, emailRX), 'email', 'invalid email');
    }
    if (!changeUserValidator.valid()) {
        conflictErrorResponse(res, new Error('conflict error'), changeUserValidator.output());
        return;
    }
    changeUserValidator.clear();

    // Fetch existing user data
    let existingUserData;
    try {
        [existingUserData] = await getExistingUserData(req);
        if (!existingUserData) {
            return notFoundErrorResponse(res, "User with ID " + user_id + " not found");
        }
        // Fill in null values in request data with existing user data
        for (const field in data) {
            if (field === "username"){
                existingUserData[0].username = data[field]
            }
            if (field === "email"){
                existingUserData[0].email = data[field]
            }
            if (field === "country"){
                existingUserData[0].country = data[field]
            }
            if (field === "city"){
                existingUserData[0].city = data[field]
            }
            if (field === "zip_code"){
                existingUserData[0].zip_code = data[field]
            }
            if (field === "street_name"){
                existingUserData[0].street_name = data[field]
            }
            if (field === "street_number"){
                existingUserData[0].street_number = data[field]
            }
            if (field === "address_complements"){
                existingUserData[0].address_complements = data[field]
            }
        }
    } catch (error) {
        console.error("Error fetching existing user data:", error);
        return serverErrorResponse(res, "Failed to retrieve user data for update");
    }

    const values = [existingUserData[0].username, existingUserData[0].email, existingUserData[0].country, existingUserData[0].city, existingUserData[0].zip_code, existingUserData[0].street_name, existingUserData[0].street_number, existingUserData[0].address_complements, user_id];

    try {
        await connection.query(changeUserDataQuery, values, (error) => {
            // Handle potential errors during query execution
            if (error) {
                console.error("Error updating user data:", error);
                if (error.errno === 1062) { // Handle duplicate key errors
                    conflictErrorResponse(res, error, "User or email already in use.");
                } else {
                    serverErrorResponse(res, "Failed to update user data");
                }
            }
        });
        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error("Unexpected error during update:", error);
        serverErrorResponse(res, "An unexpected error occurred during update.");
    }
}

async function deleteUser(req, res) {
    const { user_id } = req.params;
    try {
        const [result] = await connection.query(deleteUserQuery, [user_id]);

        if (result.affectedRows === 0) {
            return notFoundErrorResponse(res,"User not found")
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Unexpected error during deletion:", error);
        serverErrorResponse(res, "An unexpected error occurred during deletion.");
    }
}

module.exports = {register, login,logout,requestPasswordReset,resetPassword,getUserData,changeUserData,deleteUser};