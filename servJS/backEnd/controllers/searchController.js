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

    // Check if searchString exists in type_list (including approximate matching)
    if (typeSet.has(searchLower)) {
        foundType = type_list.find(item => item.name.toLowerCase() === searchLower);
    } else {
        const matchedTypes = type_list.filter(item => {
            const loweredName = item.name.toLowerCase();
            return loweredName === searchLower || loweredName.includes(searchLower);
        });
        if (matchedTypes.length > 0) {
            // Handle multiple matches (e.g., select the first match or return all)
            foundType = matchedTypes;
        } else {
            // No matches found

        }
    }

    // Check if searchString exists in brand_list
    if (brandSet.has(searchLower)) {
        foundBrand = brand_list.find(item => item.name.toLowerCase() === searchLower);
    }else {
        const matchedBrand = brand_list.filter(item => {
            const loweredName = item.name.toLowerCase();
            return loweredName === searchLower || loweredName.includes(searchLower);
        });
        if (matchedBrand.length > 0) {
            // Handle multiple matches (e.g., select the first match or return all)
            foundBrand = matchedBrand;
        } else {
            // No matches found

        }
    }

    const allResults = [];


    const token = process.env.WEB_TOKEN;
    if (foundType) {
    for (const type of foundType) {
        let url = `http://localhost:3001/v1/products?`;
        url += `filters[type_id]=${type.type_id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.length > 0) {
                allResults.push(...response.data); // Spread operator for efficiency
            }
        } catch (err) {

        }
    }
    }

    // If brand is found, call the API for its ID
    if (foundBrand) {
        let url = `http://localhost:3001/v1/products?`;
        url += `filters[brand_id]=${foundBrand.brand_id}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.length > 0) {
                allResults.push(...response.data); // Spread operator for efficiency
            }
        } catch (err) {

        }
    }

    if (!foundType && !foundBrand) {
        let url = `http://localhost:3001/v1/products?`;
        url += `filters[name]=${searchString}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.length > 0) {
                return response.data
            } else {
                return null; // Or handle the case where no data is found as needed
            }
        } catch (err) {
            console.error(`Error fetching searched product`, err);
            return null; // Or rethrow the error or handle it as needed
        }
    }

    // Handle no matches or errors
    if (allResults.length === 0 && !foundBrand) {

        return null; // Or handle the case where no data is found as needed
    }

    return allResults;
}


module.exports = {getSearchData}