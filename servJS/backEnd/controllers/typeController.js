const axios = require('axios');

require('dotenv').config();

async function getTypeNameById(id) {
    const url = `http://localhost:3001/v1/types/${id}`;
    const token = process.env.WEB_TOKEN;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.length > 0) {
            return response.data[0].name;
        } else {
            console.error("No data found for the given ID:", id);
            return null; // Or handle the case where no data is found as needed
        }
    } catch (err) {
        console.error(`Error fetching type name for ID ${id}:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}
async function getAllType(){
    const url = `http://localhost:3001/v1/getTypes`;
    const token = process.env.WEB_TOKEN;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.length > 0) {
            return response.data
        } else {
            console.error("No data found for the all brand");
            return null; // Or handle the case where no data is found as needed
        }
    } catch (err) {
        console.error(`Error fetching all brand:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}

module.exports = {getTypeNameById,getAllType}