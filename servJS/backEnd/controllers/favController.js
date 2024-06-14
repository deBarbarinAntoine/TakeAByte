const axios = require('axios');

require('dotenv').config();

async function getUserFavByUserId(user_id){

    let array_of_products_id = [];
    let array_of_products =[];
    try {
        const url = `http://localhost:3001/v1/product/like/userLikes/${user_id.user_id}`;
        const token = process.env.WEB_TOKEN;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data) {
            array_of_products_id =  response.data
        } else {
            console.error("No data found userId with given token");
            return null;
        }
    } catch (err) {
        console.error(`Error fetching user fev ids:`, err);
        return null;
    }

    try{
        for (const product_id of array_of_products_id) {
            try {
                const url = `http://localhost:3001/v1/products/${product_id.product_id}`;
                const token = process.env.WEB_TOKEN;

                // Make GET request using axios
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Assuming response.data contains the product information
                array_of_products.push(response.data);
            } catch (error) {
                console.error(`Error fetching product ${product_id}:`, error.message);
                return array_of_products
            }
        }
        return  array_of_products
    }catch (err){
        console.error(`Error fetching user fav products:`, err);
        return null;
    }
}








module.exports = {getUserFavByUserId}