const {unauthorizedErrorResponse, notFoundErrorResponse, serverErrorResponse} = require("../helpers/responses");
const {getTokenFromUserId, Token} = require("./tokens");
const {getUserByEmail} = require("./users");

const authorizeUser = (req, res, next) => {
    const userId = req.userId;
    const is_mod = req.is_mod;
    const { user_id } = req.params;

    if (user_id !== userId || is_mod === 0) {
        return unauthorizedErrorResponse(res, "Not authorized");
    }

    next(); // Call next() to proceed to the next middleware/route handler
};

const authorizeMod = (req, res, next) => {
    const is_mod = req.is_mod;

    if (is_mod === 0) {
        return unauthorizedErrorResponse(res, "Not authorized");
    }

    next(); // Call next() to proceed to the next middleware/route handler
};

const authorizeMail = async (req, res, next) => {
    const userId = req.userId;
    const is_mod = req.is_mod;
    const {mail} = req.params;
    let user_id
    try {
        // Retrieve token associated with the user ID
        user_id = await getUserByEmail(mail);
        if (!user_id) {
            // If token not found, send a 404 Not Found response
            return notFoundErrorResponse(res, "no user found for given Mail");
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error fetching id:", error);
        serverErrorResponse(res, "An unexpected error occurred during verification of mail.");
    }

    if (user_id !== userId || is_mod === 0) {
        return unauthorizedErrorResponse(res, "Not authorized");
    }

    next(); // Call next() to proceed to the next middleware/route handler
};

module.exports = {authorizeUser, authorizeMod,authorizeMail};
