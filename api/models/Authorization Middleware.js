const {unauthorizedErrorResponse, notFoundErrorResponse, serverErrorResponse} = require("../helpers/responses");
const {getUserByEmail} = require("./users");

const authorizeUser = (req, res, next) => {
    const userId = req.userId;
    const is_mod = req.is_mod;
    const {user_id} = req.params;
    const userIdString = String(userId);
    console.log("typeof userId:", typeof userId , userId);
    console.log("typeof user_id:", typeof user_id, user_id) ;
    console.log("typeof is_mod:", typeof is_mod, is_mod);

// Check if the user is authorized
    if (user_id !== userIdString && is_mod === 0) {
        return unauthorizedErrorResponse(res, "Not authorized user isn't token owner / mod");
    }

// If the user is authorized, continue with the next steps
    console.log("User is authorized");

    next(); // Call next() to proceed to the next middleware/route handler
};

const authorizeMod = (req, res, next) => {
    const is_mod = req.is_mod;

    if (is_mod !== 1) {
        return unauthorizedErrorResponse(res, "Not authorized");
    }

    next(); // Call next() to proceed to the next middleware/route handler
};

const authorizeMail = async (req, res, next) => {
    const {mail} = req.params;
    let user_id
    try {
        // Retrieve token associated with the user ID
        user_id = await getUserByEmail(mail);
        if (!user_id) {
            // If token not found, send a 404 Not Found response
            return notFoundErrorResponse(res, "Mail has been sent");
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error fetching id:", error);
        serverErrorResponse(res, "An unexpected error occurred during verification of mail.");
    }
    next(); // Call next() to proceed to the next middleware/route handler
};

const authorizeUserLogout = (req, res, next) => {
    // Check if userId is populated and is a valid number
    const userId = req.userId;
    if (typeof userId !== 'number' || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
    }

    // Check if is_mod is populated and is a valid number
    const is_mod = req.is_mod;
    if (typeof is_mod !== 'number' || isNaN(is_mod)) {
        return res.status(400).json({ error: 'Invalid is_mod' });
    }

    // If both userId and is_mod are valid, proceed to the next middleware/route handler
    next();
};
module.exports = {authorizeUser, authorizeMod, authorizeMail,authorizeUserLogout};
