const axios = require('axios');
const {addToLikes} = require("./likeContoller");

async function checkUserLogs(req, res) {
    try {
        const { email, password } = req.body;

        // Login user and retrieve token
        const response = await axios.post('http://localhost:3001/v1/auth/login', {
            email,
            password
        });

        const { token, ExpirationDate } = response.data.user;

        // Set token cookie with secure options
        res.cookie('token', token, {
            expires: new Date(ExpirationDate),
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });

        const WEB_token = process.env.WEB_TOKEN;

        // Get user ID from token
        const userIdResponse = await axios.get(`http://localhost:3001/v1/token/getUserId/${token}`, {
            headers: {
                authorization: `Bearer ${WEB_token}`
            }
        });

        const userId = userIdResponse.data.user_id;

        // Fetch user likes from the server
        const userLikesResponse = await axios.get(`http://localhost:3001/v1/product/userLikes/${userId}`, {
            headers: {
                authorization: `Bearer ${WEB_token}`
            }
        });

        const userLikes = userLikesResponse.data;

        // Process missing products in user likes
        if (req.cookies.fav) {
            try {
                const favFromCookie = JSON.parse(req.cookies.fav);
                const missingInArray1 = userLikes.filter(item => !favFromCookie.some(favItem => favItem.productId === item.product_id.toString()));
                const missingInArray2 = favFromCookie.filter(favItem => !userLikes.some(item => item.product_id.toString() === favItem.productId));

                await processArray(missingInArray1, token, req, res);
                await processArray(missingInArray2, token, req, res);
            } catch (error) {
                console.error('Error parsing req.cookies.fav:', error);
            }
        } else {
            await processArray(userLikes, token, req, res);
        }

        // Respond to client
        res.status(response.status).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function logoutUser(req, res) {
    try {
        // Verify if the token cookie exists
        if (!req.cookies.token) {
            return res.status(401).json({error: 'Token cookie not found'});
        }

        // Retrieve token from cookie
        const token = req.cookies.token;

        // Make a request to the authentication server to logout
        await axios.post('http://localhost:3001/v1/auth/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
// Delete the token cookie
        res.clearCookie('token');

        // Redirect to /login
        res.redirect('/login');
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
        res.status(500).json({error: 'An error occurred while logging out user'});
    }
}

async function registerUser(req, res) {
    const {email, username, password, confirm_password} = req.body;
    try {
        // Input validation (example: check if email and password are provided)
        if (!email || !password) {
            return res.status(400).json({success: false, error: 'Email and password are required'});
        }

        // Check if password and confirm_password match
        if (password !== confirm_password) {
            return res.status(400).json({success: false, error: 'Passwords do not match'});
        }

        // Make registration request
        const response = await axios.post('http://localhost:3001/v1/auth/register', {
            email,
            username,
            password,
            confirm_password
        });

        // Respond to the client
        res.status(response.status).json({success: true, message: 'Registration successful'});
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            // Server returned a specific error message
            res.status(error.response.status).json({success: false, error: error.response.data.error});
        } else {
            // Generic error message
            res.status(500).json({success: false, error: 'An error occurred while registering the user'});
        }
    }
}


// Function to iterate over array and call addToFavourites for each productId
const processArray = async (arr, token,req, res) => {
    let fav = req.cookies.fav ? JSON.parse(req.cookies.fav) : [];

    for (const item of arr) {
        try {
            const productId = item.productId || item.product_id.toString();
            const productIndex = fav.findIndex(item => item.productId === productId);
            if (productIndex !== -1) {

            } else {
                // If it doesn't exist, add it to the array
                fav.push({ productId });
            }
            await addToLikes(productId, token);
        } catch (error) {
            console.error('Error processing item:', error);
        }
    }
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    res.cookie('fav', JSON.stringify(fav), { maxAge: oneWeekInMilliseconds, httpOnly: true }); // Set cookie expiry time
};

module.exports = {checkUserLogs, logoutUser, registerUser};
