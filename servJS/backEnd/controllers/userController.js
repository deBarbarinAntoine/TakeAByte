const axios = require('axios');

require('dotenv').config();

async function getUserIdFromToken(user_token){
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

async function getUserInfoById(userId){
    const url = `http://localhost:3001/v1/users/${userId}`;
    const token = process.env.WEB_TOKEN;
    try{
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
    }catch (err){
        console.error(`Error fetching user :`, err);
        return null;
    }
}








module.exports = {getUserIdFromToken,getUserInfoById}