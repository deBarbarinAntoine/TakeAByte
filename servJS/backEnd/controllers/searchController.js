const axios = require('axios');

require('dotenv').config();

async function getSearchData(searchString, type_list, brand_list) {
    // Convert the arrays into sets for quick lookup
    const typeSet = new Set(type_list.map(item => item.name.toLowerCase()));
    const brandSet = new Set(brand_list.map(item => item.name.toLowerCase()));

    // Convert searchString to lowercase for case-insensitive comparison
    const searchLower = searchString.toLowerCase();

    let foundType = null;
    let foundBrand = null;

    // Check if searchString exists in type_list
    if (typeSet.has(searchLower)) {
        foundType = type_list.find(item => item.name.toLowerCase() === searchLower);
    }

    // Check if searchString exists in brand_list
    if (brandSet.has(searchLower)) {
        foundBrand = brand_list.find(item => item.name.toLowerCase() === searchLower);
    }

    // Build the URL based on what is found
    let url = `http://localhost:3001/v1/products?`;
    const token = process.env.WEB_TOKEN;
    if (foundType) {
        url += `filters[type_id]=${foundType.type_id}`;
    }

    if (foundBrand) {
        if (foundType) {
            url += `&`;
        }
        url += `filters[brand_id]=${foundBrand.brand_id}`;
    }
    if (!foundType && !foundBrand) {
        url += `filters[name]=${searchString}`;
    }
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.length > 0) {
             return response.data
        } else {
            console.error("No data found for the searched product");
            return null; // Or handle the case where no data is found as needed
        }
    } catch (err) {
        console.error(`Error fetching searched product`, err);
        return null; // Or rethrow the error or handle it as needed
    }

}


module.exports = {getSearchData}