const {serverErrorResponse,
    badRequestErrorResponse,
    unauthorizedErrorResponse,
    conflictErrorResponse, notFoundErrorResponse,
} = require('../helpers/responses');
const {User, errDuplicateEmail, errDuplicateUsername, checkCredentials, getUserByEmail, updatePassword} = require("../models/users");
const {newHash, matchPwd} = require("../helpers/authentication");
const response = require('../errors/status');
const {validateCredentials, validateNewUser, Validator, notEmpty, checkLength, matches, emailRX, passwordRX,
    matchesMail, matchesPassword
} = require("../helpers/validator");
const {Token} = require("../models/tokens");
const nodemailer = require('nodemailer');

async function register(req, res) {
    const data = req.body;
// Sanitize input using parameterized queries
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const confirm_password = data.confirm_password;
    console.log(password)
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
        serverErrorResponse(res,error, new Error('Error creating token'))
        return;
    }
    // Send response with user email and generated token
    res.status(response.StatusOK).json({"response": response.StatusOK, "user": {token: tokenInstance.token, ExpirationDate: tokenInstance.expiry}});
}

async function logout(req, res) {
    const token = req.token;

    try {

        if (!token) {
            // If token not found, send a 404 Not Found response
            return notFoundErrorResponse(res, "Token not found in req");
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
        console.error("failed to delete the reset token")
        }

        // Send success response
        res.status(response.StatusOK).json({"response": response.StatusOK, "message": "Password reset successful"});
    } catch (error) {
        // Handle other errors
        return serverErrorResponse(res, error,"failed to change password");
    }
}

async function newPasswordUpdate(req, res) {
    const userID = req.params;
    const { password, newPassword, confirmPassword } = req.body;
    const userValidator = Validator.New();

    let user_hash;
    try {
        user_hash = await connection.query(getUserPasswordQuery, [userID.user_id]);
        if (user_hash.length === 0) {
            return notFoundErrorResponse(res, "User not found");
        }
    } catch (error) {
        console.error("Failed to fetch user password:", error);
        return serverErrorResponse(res, "Failed to fetch user password");
    }

    // Validation checks
    userValidator.check(notEmpty(password), 'password', 'must be provided');
    userValidator.check(notEmpty(newPassword), 'newPassword', 'must be provided');
    userValidator.check(matchesPassword(newPassword, passwordRX), "newPassword", "must contain 1 lowercase and 1 uppercase letter, a digit and be at least 8 characters long");
    userValidator.check(newPassword === confirmPassword, 'newPassword', 'new passwords must be equals');

    if (!userValidator.valid()) {
        return conflictErrorResponse(res, "Validation failed", userValidator.output());
    }

    // Clear validator
    userValidator.clear();

    // Check if current password matches
    const isValid = await matchPwd(user_hash[0][0], password);

    if (!isValid) {
        return res.status(409).json({
            status: 'error',
            message: 'Current password is incorrect',
        });
    }

    // Hash the new password
    let hashedPassword;
    try {
        hashedPassword = await newHash(newPassword);
    } catch (err) {
        console.error("Failed to hash password:", err);
        return serverErrorResponse(res, "Failed to hash password");
    }

    // Update password in database
    try {
        await updatePassword(userID, hashedPassword);
        return res.json({
            status: 'success',
            message: 'Password updated successfully',
        });
    } catch (err) {
        console.error("Failed to update password in database:", err);
        return serverErrorResponse(res, "Failed to update password");
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
const {getUserDataQuery, changeUserDataQuery, deleteUserQuery, deleteResetTokenQuery, getUserPasswordQuery} = require("../models/db-queries");

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
    try {

        const results = await connection.query(getUserDataQuery, [req]);
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
    const data = req.body;

    const changeUserValidator = Validator.New();
    validateChangeUserData(data, changeUserValidator);

    if (!changeUserValidator.valid()) {
        return conflictErrorResponse(res, new Error('Validation error'), changeUserValidator.output());
    }

    // Fetch existing user data
    let existingUserData;
    try {
        existingUserData = await getExistingUserData(user_id);
        if (!existingUserData || !existingUserData[0] || existingUserData[0].length === 0) {
            return notFoundErrorResponse(res, `User with ID ${user_id} not found`);
        }
    } catch (error) {
        console.error("Error fetching existing user data:", error);
        return serverErrorResponse(res, "Failed to retrieve user data for update");
    }

    const user = existingUserData[0][0];
    console.log("Existing user data:", user);
    updateUserFields(user, data);
    console.log("Updated user data:", user);

    const values = [
        user.username, user.email, user.country, user.city,
        user.zip_code, user.street_name, user.street_number,
        user.address_complements, user.province,user.name, user.lastname,
        user_id
    ];

    // Log query and values for debugging
    console.log("Executing query:", changeUserDataQuery);
    console.log("With values:", values);

    try {
        const [result] = await connection.query(changeUserDataQuery, values);

        // Log the result for debugging
        console.log("Query result:", result);

        if (result.affectedRows === 0) {
            return notFoundErrorResponse(res, `No user found with ID ${user_id}`);
        }

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error("Unexpected error during update:", error);
        if (error.errno === 1062) {
            return conflictErrorResponse(res, error, "User or email already in use.");
        } else {
            return serverErrorResponse(res, "An unexpected error occurred during update.");
        }
    }
}

function validateChangeUserData(data, validator) {
    if (data.username) {
        validator.check(checkLength(data.username, 3, 25), 'username', 'must be between 3 and 25 characters long');
    }
    if (data.lastname) {
        validator.check(checkLength(data.lastname, 1, 50), 'lastname', 'must be between 1 and 50 characters long');
    }
    if (data.email) {
        validator.check(matchesMail(data.email, emailRX), 'email', 'invalid email');
    }
}

function updateUserFields(user, data) {
    if (data.username) user.username = data.username;
    if (data.name) user.name = data.name;
    if (data.lastname) user.lastname = data.lastname;
    if (data.email) user.email = data.email;
    if (data.country) user.country = data.country;
    if (data.city) user.city = data.city;
    if (data.zip) user.zip_code = data.zip;
    if (data.street) user.street_name = data.street;
    if (data.street_number) user.street_number = data.street_number;
    if (data.optional) user.address_complements = data.optional;
    if (data.region) user.province = data.region;
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

module.exports = {register, login,logout,requestPasswordReset,resetPassword,getUserData,changeUserData,deleteUser,newPasswordUpdate};