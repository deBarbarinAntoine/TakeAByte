const axios = require('axios');

require('dotenv').config();

async function addToLikes(id){
    const url = `http://localhost:3001/v1/product/${id}/like`;
    const token = process.env.WEB_TOKEN;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

            console.log(response.data)
    } catch (err) {
        console.error(`Error adding to liked:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}

module.exports = {addToLikes}