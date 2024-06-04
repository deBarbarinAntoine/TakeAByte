const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse, conflictErrorResponse} = require("../helpers/responses");
const {
    creatColorQuery,
    updateColorQuery,
    getColorQuery,
    deleteColorQuery
} = require("../models/db-queries");

// Function to create a new Color
exports.createColor = async (req, res) => {
    const { name } = req.body;
    try {
        const results = await connection.query(creatColorQuery, [name]);
        res.status(201).json({ message: 'Color created successfully', Color_id: results.insertId });
    } catch (error) {
        console.error("Unexpected error:", error);
        if (error.errno === 1062) {
            conflictErrorResponse(res, "Color already exists");
        } else {
            serverErrorResponse(res, "Failed to create Color");
        }
    }
};

// Function to get a Color by its ID
exports.getColorById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await connection.query(getColorQuery, [id]);
        if (results.length === 0) {
            console.error("Color not found with ID:", id);
            return notFoundErrorResponse(res, "Color not found");
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to get Color");
    }
};

// Function to update a Color
exports.updateColor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await connection.query(updateColorQuery, [name, id]);
        res.status(200).json({ message: 'Color updated successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to update Color");
    }
};

// Function to delete a Color
exports.deleteColor = async (req, res) => {
    try {
        const { id } = req.params;
        await connection.query(deleteColorQuery, [id]);
        res.status(200).json({ message: 'Color deleted successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to delete Color");
    }
};