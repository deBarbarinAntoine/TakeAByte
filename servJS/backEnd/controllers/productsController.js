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

async function fetchLatestProducts(){
    const url = `http://localhost:3001/v1/products?filters[updated_at]=DESC`;
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

        // Iterate over each product item in the response array
        for (const product of response.data) {
            const typeId = product.type;
            const brandId = product.brand_id;

            // Fetch type name
            if (typeId) {
                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type_name = typeResponse.data.name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand_name = brandResponse.data.name;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function fetchPopularProducts(){
    const url = `http://localhost:3001/v1/products/top/10`;
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

        // Iterate over each product item in the response array
        for (const product of response.data) {
            const typeId = product.type;
            const brandId = product.brand_id;

            // Fetch type name
            if (typeId) {
                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type_name = typeResponse.data.name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand_name = brandResponse.data.name;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function fetchRandomCategoryProducts(){
    const token = process.env.WEB_TOKEN;
    if (!token) {
        console.error('WEB_TOKEN is not set in environment variables');
        return null;
    }
    const typeIds =await axios.get('http://localhost:3001/v1/allTypes',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const randIndex = Math.floor(Math.random() * typeIds.length);
    const randTypeId = typeIds[randIndex];

    const url = `http://localhost:3001/v1/products?filters[type_id]=${randTypeId}`;

    try {
        // Fetch product details
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Iterate over each product item in the response array
        for (const product of response.data) {
            const typeId = product.type;
            const brandId = product.brand_id;

            // Fetch type name
            if (typeId) {
                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type_name = typeResponse.data.name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand_name = brandResponse.data.name;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

module.exports = {getProductById, fetchLatestProducts, fetchPopularProducts,fetchRandomCategoryProducts};
