const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse, conflictErrorResponse} = require("../helpers/responses");
const {
    creatBrandQuery,
    updateBrandQuery,
    getBrandQuery,
    deleteBrandQuery
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
            conflictErrorResponse(res, "Brand already exists");
        } else {
            serverErrorResponse(res, "Failed to create brand");
        }
    }
};

// Function to get a brand by its ID
exports.getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await connection.query(getBrandQuery, [id]);
        if (results.length === 0) {
            console.error("Brand not found with ID:", id);
            return notFoundErrorResponse(res, "Brand not found");
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to get brand");
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