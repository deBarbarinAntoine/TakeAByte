const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse, conflictErrorResponse} = require("../helpers/responses");
const {
    creatTypeQuery,
    updateTypeQuery,
    getTypeQuery,
    deleteTypeQuery,
    getTypeIdByNameQuery
} = require("../models/db-queries");

// Function to create a new Type
exports.createType = async (req, res) => {
    const {name} = req.body;
    try {
        const results = await connection.query(creatTypeQuery, [name]);
        res.status(201).json({message: 'Type created successfully', Type_id: results.insertId});
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
    const {id} = req.params;
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
    const {id} = req.params;
    const {name} = req.body;
    try {
        await connection.query(updateTypeQuery, [name, id]);
        res.status(200).json({message: 'Type updated successfully'});
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to update Type");
    }
};

// Function to delete a Type
exports.deleteType = async (req, res) => {
    try {
        const {id} = req.params;
        await connection.query(deleteTypeQuery, [id]);
        res.status(200).json({message: 'Type deleted successfully'});
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to delete Type");
    }
};

exports.getTypeIdByName = async (req, res) => {
    let { name } = req.params;
    name = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    try {
        let results = await connection.query(getTypeIdByNameQuery, [name]);
        if (results.length > 0) {
            return results[0][0].type_id
        }
    } catch (error) {
        if (error.message === "Cannot read properties of undefined (reading 'type_id')") {
            try {
                const insertResult = await connection.query(creatTypeQuery, [name]);
                return insertResult[0].insertId
            } catch (insertError) {
                console.error("Error while inserting new type:", insertError);
                return serverErrorResponse(res, "Failed to create Type");
            }
        }
        console.error("Unexpected error:", error);
        return serverErrorResponse(res, "Failed to get Type id with given name");
    }
}

exports.allTypesIds = async (req, res) => {
    try {
        let results = await connection.query('SELECT type_id FROM `types`');
        let typeIds = [];
        if (results && results.length > 0) {
            const innerArray = results[0]; // Access the inner array
            for (let i = 0; i < innerArray.length; i++) {
                if (innerArray[i].type_id !== undefined) {
                    typeIds.push(innerArray[i].type_id);
                }
            }
        }
        res.status(200).json({typeIds});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get all type ids" });
    }
}