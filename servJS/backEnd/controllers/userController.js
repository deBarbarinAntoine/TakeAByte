const axios = require('axios');

require('dotenv').config();

async function getUserIdFromToken(user_token) {
    const url = `http://localhost:3001/v1/token/getUserId/${user_token}`;
    const token = process.env.WEB_TOKEN;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data) {
            return response.data
        } else {
            console.error("No data found userId with given token");
            return null;
        }
    } catch (err) {
        console.error(`Error fetching all brand:`, err);
        return null;
    }
}

async function getUserInfoById(userId, token) {
    const url = `http://localhost:3001/v1/users/${userId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        if (response.data && response.data.length > 0) {
            return response.data
        } else {
            console.error("No user found for the given id");
            return null;
        }
    } catch (err) {
        console.error(`Error fetching user :`, err);
        return null;
    }
}

async function updateUserData(user_id, form) {
    const url = `http://localhost:3001/v1/users/${user_id.user_id}`;
    const token = process.env.WEB_TOKEN;
    try {
        await axios.put(url, form, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error(`Error fetching user :`, err);
        return null;
    }
}

async function updateUserPassword(user_id, password, newPassword, confirmPassword) {
    const url = `http://localhost:3001/v1/auth/newPassword/${user_id.user_id}`;
    const token = process.env.WEB_TOKEN;
    const data = {
        password: password,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Password updated successfully:', response.data);
        return response.data; // Assuming the response contains relevant data
    } catch (err) {
        console.error('Error updating password:', err.response ? err.response.data : err.message);
        return null;
    }
}



module.exports = {getUserIdFromToken, getUserInfoById, updateUserData,updateUserPassword}