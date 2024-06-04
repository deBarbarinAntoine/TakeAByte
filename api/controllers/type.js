const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse, conflictErrorResponse} = require("../helpers/responses");
const {
    creatTypeQuery,
    updateTypeQuery,
    getTypeQuery,
    deleteTypeQuery
} = require("../models/db-queries");

// Function to create a new Type
exports.createType = async (req, res) => {
    const { name } = req.body;
    try {
        const results = await connection.query(creatTypeQuery, [name]);
        res.status(201).json({ message: 'Type created successfully', Type_id: results.insertId });
    } catch (error) {
        console.error("Unexpected error:", error);
        if (error.errno === 1062) {
            conflictErrorResponse(res, "Type already exists");
        } else {
            serverErrorResponse(res, "Failed to create Type");
        }
    }
};

// Function to get a Type by its ID
exports.getTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await connection.query(getTypeQuery, [id]);
        if (results.length === 0) {
            console.error("Type not found with ID:", id);
            return notFoundErrorResponse(res, "Type not found");
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to get Type");
    }
};

// Function to update a Type
exports.updateType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await connection.query(updateTypeQuery, [name, id]);
        res.status(200).json({ message: 'Type updated successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to update Type");
    }
};

// Function to delete a Type
exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        await connection.query(deleteTypeQuery, [id]);
        res.status(200).json({ message: 'Type deleted successfully' });
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to delete Type");
    }
};