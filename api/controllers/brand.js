const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse, conflictErrorResponse} = require("../helpers/responses");
const {
    creatBrandQuery,
    updateBrandQuery,
    getBrandQuery,
    deleteBrandQuery,
    getBrandIdByNameQuery, getAllBrandsQuery,
} = require("../models/db-queries");

// Function to create a new brand
exports.createBrand = async (req, res) => {
    const { name } = req.body;
    try {
        const results = await connection.query(creatBrandQuery, [name]);
        res.status(201).json({ message: 'Brand created successfully', brand_id: results.insertId });
    } catch (error) {
        console.error("Unexpected error:", error);
        if (error.errno === 1062) {
            conflictErrorResponse(res, "message : Brand already exists");
        } else {
            serverErrorResponse(res, "Failed to create brand");
        }
    }
};

// Function to get a brand by its ID
exports.getBrandsByIds = async (req, res) => {
    let { id } = req.params; // Assuming ids are passed as a string in the request params
    try {
        // Convert ids string to an array of integers
        const idArray = id.split(',').map(id => parseInt(id.trim(), 10));
        const results = await connection.query(getBrandQuery, [idArray]);

        if (idArray.length === 1) {
            // If only one ID was provided, return the single result
            if (results.length === 0) {
                console.error("Brand not found with ID:", idArray[0]);
                return notFoundErrorResponse(res, "Brand not found");
            }
            res.status(200).json(results[0]);
        } else {
            // If multiple IDs were provided, return the array of results
            if (results.length === 0) {
                console.error("Brands not found with IDs:", idArray.join(','));
                return notFoundErrorResponse(res, "Brands not found");
            }
            res.status(200).json(results);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to get brands");
    }
};

// Function to update a brand
exports.updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await connection.query(updateBrandQuery, [name, id]);
        res.status(200).json({ message: 'Brand updated successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to update brand");
    }
};

// Function to delete a brand
exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        await connection.query(deleteBrandQuery, [id]);
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to delete brand");
    }
};

exports.getBrandIdByName = async (req, res) => {
    let { name } = req.params;
    name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    try {
        const results = await connection.query(getBrandIdByNameQuery, [name] );
        if (results.length > 0) {
            return results[0][0].brand_id;
        }
    } catch (error) {
        if (error.message === "Cannot read properties of undefined (reading 'brand_id')") {
            try {
                const insertResult = await connection.query(creatBrandQuery, [name]);
                return insertResult[0].insertId
            } catch (insertError) {
                console.error("Error while inserting new brand:", insertError);
                return serverErrorResponse(res, "Failed to create Brand");
            }
        }
        console.error("Unexpected error:", error);
        return serverErrorResponse(res, "Failed to get Brand id with given name");
    }
}

exports.getAllBrands = async (req,res) =>{
    try {
        const results = await connection.query(getAllBrandsQuery);
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Unexpected error:", error);
        return serverErrorResponse(res, "Failed to get all brands");
    }
}
