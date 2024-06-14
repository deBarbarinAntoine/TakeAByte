const axios = require('axios');

require('dotenv').config();

async function addToLikes(id,token) {
    const url = `http://localhost:3001/v1/product/like/${id}`;

    try {
        await axios.put(url, {}, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error(`Error adding to liked:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}

async function takeOffLikes(id,token) {
    const url = `http://localhost:3001/v1/product/unlike/${id}`;

    try {
        await axios.delete(url, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error(`Error deleting liked:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}


module.exports = {addToLikes, takeOffLikes}