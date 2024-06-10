const axios = require('axios');

async function checkUserLogs(req, res) {
    try {
        const {email, password} = req.body;

        const response = await axios.post('http://localhost:3001/v1/auth/login', {
            email,
            password
        });

        // Extract token and expiration date from the response
        const {token, ExpirationDate} = response.data.user;

        // Set the token as a cookie with consistent options
        res.cookie('token', token, {
            expires: new Date(ExpirationDate),
            httpOnly: true,
            sameSite: 'strict', // Ensure same-site attribute is set
            path: '/', // Ensure cookie is accessible from all paths
            // Optionally set domain if your application spans subdomains
        });

        // Respond to the client
        res.status(response.status).json({success: true, message: 'Login successful'});
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
    }
}

async function logoutUser(req, res) {
    try {
        // Verify if the token cookie exists
        if (!req.cookies.token) {
            return res.status(401).json({ error: 'Token cookie not found' });
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
    const { email, username, password, confirm_password } = req.body;
    try {
        // Input validation (example: check if email and password are provided)
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Check if password and confirm_password match
        if (password !== confirm_password) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        // Make registration request
        const response = await axios.post('http://localhost:3001/v1/auth/register', {
            email,
            username,
            password,
            confirm_password
        });

        // Respond to the client
        res.status(response.status).json({ success: true, message: 'Registration successful' });
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            // Server returned a specific error message
            res.status(error.response.status).json({ success: false, error: error.response.data.error });
        } else {
            // Generic error message
            res.status(500).json({ success: false, error: 'An error occurred while registering the user' });
        }
    }
}


module.exports = {checkUserLogs, logoutUser, registerUser};
