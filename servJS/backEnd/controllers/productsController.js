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

        // Iterate over each product item in the response array
        for (const product of response.data) {
            const typeId = product.type;
            const brandId = product.brand;

            // Fetch type name
            if (typeId) {

                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type = typeResponse.data[0].name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand = brandResponse.data[0].name;
            }
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
            product.link = `/product/${product.id}`;
            product.img = '/static/img/image-not-found.webp'
            const typeId = product.type;
            const brandId = product.brand;

            // Fetch type name
            if (typeId) {

                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type = typeResponse.data[0].name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand = brandResponse.data[0].name;
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
            product.link = `/product/${product.id}`;
            product.img = '/static/img/image-not-found.webp'
            const typeId = product.type;
            const brandId = product.brand;

            // Fetch type name
            if (typeId) {

                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type = typeResponse.data[0].name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand = brandResponse.data[0].name;
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
    const type =await axios.get('http://localhost:3001/v1/allTypes',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    let typeIds = type.data.typeIds
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
            product.link = `/product/${product.id}`;
            product.img = '/static/img/image-not-found.webp'
            //const imgPath = `http://localhost:3001/v1/images/${product.id}`;
           // const imgRes = await axios.get(imgPath, {
            //    headers: {
            //        Authorization: `Bearer ${token}`
             //   }
           // })

            const typeId = product.type;
            const brandId = product.brand;

            // Fetch type name
            if (typeId) {

                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type = typeResponse.data[0].name;
            }

            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand = brandResponse.data[0].name;
            }
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

module.exports = {getProductById, fetchLatestProducts, fetchPopularProducts,fetchRandomCategoryProducts};