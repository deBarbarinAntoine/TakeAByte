const axios = require('axios');
require('dotenv').config();

async function getProductById(productId) {
    const url = `http://localhost:3001/v1/products/${productId}`;
    const token = process.env.WEB_TOKEN;

    if (!token) {
        console.error('WEB_TOKEN is not set in environment variables');
        return null;
    }

    try {
        // Fetch product details
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Extract type and brand IDs
        const typeId = response.data.type_id;
        const brandId = response.data.brand_id;

        // Fetch type name
        if (typeId) {
            const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
            const typeResponse = await axios.get(typeUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            response.data.type_name = typeResponse.data.name;
        }

        // Fetch brand name
        if (brandId) {
            const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
            const brandResponse = await axios.get(brandUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            response.data.brand_name = brandResponse.data.name;
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}



module.exports = getProductById;
