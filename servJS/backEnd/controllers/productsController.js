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
            const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
            const saleDetails =  await axios.get(saleUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (saleDetails.data.sales[0].length > 0){
                product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
                product.sales = saleDetails.data.sales[0][0].reduction_percentage
            }else{
                product.sales = "0"
            }

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
    let allImg;
    try {
        // Fetch product details
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // Iterate over each product item in the response array
        for (const product of response.data) {

            const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
            const saleDetails =  await axios.get(saleUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (saleDetails.data.sales[0].length > 0){
                product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
                product.sales = saleDetails.data.sales[0][0].reduction_percentage
            }else{
                product.sales = "0"
            }


            product.link = `/product/${product.id}`;
            const getImagesUrl = `http://localhost:3001/v1/images/product/${product.id}`;
            allImg = await axios.get(getImagesUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            product.img = allImg.data[0].image_path;
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
    let allImg;
    try {
        // Fetch product details
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // Iterate over each product item in the response array
        for (const product of response.data) {
            const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
            const saleDetails =  await axios.get(saleUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (saleDetails.data.sales[0].length > 0){
                product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
                product.sales = saleDetails.data.sales[0][0].reduction_percentage
            }else{
                product.sales = "0"
            }

            product.link = `/product/${product.id}`;
            const getImagesUrl = `http://localhost:3001/v1/images/product/${product.id}`;
            allImg = await axios.get(getImagesUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            product.img = allImg.data[0].image_path;
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
            const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
            const saleDetails =  await axios.get(saleUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (saleDetails.data.sales[0].length > 0){
                product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
                product.sales = saleDetails.data.sales[0][0].reduction_percentage
            }else{
                product.sales = "0"
            }

            product.link = `/product/${product.id}`;
            const getImagesUrl = `http://localhost:3001/v1/images/product/${product.id}`;
            allImg = await axios.get(getImagesUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (allImg.data[0].image_path === undefined ||allImg.data[0].image_path === null){
                product.img= '/static/img/image-not-found.webp'
            }else {
                product.img = allImg.data[0].image_path;
            }

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

async function getProductByTypeId(id){
    const url = `http://localhost:3001/v1/products?filters[type_id]=${id}`;
    const token = process.env.WEB_TOKEN;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.length > 0) {
             return response.data;

        } else {
            console.error("No data found for the given ID:", id);
            return null; // Or handle the case where no data is found as needed
        }
    } catch (err) {
        console.error(`Error fetching type name for ID ${id}:`, err);
        return null; // Or rethrow the error or handle it as needed
    }
}
module.exports = {getProductById, fetchLatestProducts, fetchPopularProducts,fetchRandomCategoryProducts,getProductByTypeId};
