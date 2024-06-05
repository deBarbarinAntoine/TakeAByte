const connection = require("../models/db-connect");
const {
    serverErrorResponse,
    notFoundErrorResponse,
    conflictErrorResponse
} = require("../helpers/responses");
const {
    creatImageQuery,
    getImageQuery,
    getProductImageQuery,
    deleteImageQuery,
    updateImageQuery,
    checkImageIndQuery,
    checkImagePathQuery
} = require("../models/db-queries");

// Function to create a new image
async function createImage(req, res) {
    const { image_path, ind, product_id } = req.body;
    try {
        // Check if product_id already has an image with the same ind
        const [indCheck] = await connection.execute(checkImageIndQuery, [product_id, ind]);
        if (indCheck.length > 0) {
            return conflictErrorResponse(res, "Product already has an image with the same index");
        }

        // Check if the image_path already exists
        const [pathCheck] = await connection.execute(checkImagePathQuery, [image_path]);
        if (pathCheck.length > 0) {
            return conflictErrorResponse(res, "Image path already exists");
        }

        // Insert the new image
        const [result] = await connection.execute(creatImageQuery, [image_path, ind, product_id]);
        res.status(201).json({ id: result.insertId, image_path, ind, product_id });
    } catch (error) {
        serverErrorResponse(res, error, "Failed to create/add image to database");
    }
}

// Function to get an image by ID
async function getImageById(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await connection.execute(getImageQuery, [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            notFoundErrorResponse(res, "Couldn't find image with given ID");
        }
    } catch (error) {
        serverErrorResponse(res, "Failed to get image with given ID");
    }
}

// Function to get all images for a product by product ID
async function getProductImagesById(req, res) {
    const { id } = req.params;
    try {
        const [rows] = await connection.execute(getProductImageQuery, [id]);
        res.status(200).json(rows);
    } catch (error) {
        serverErrorResponse(res, error, "Failed to get product images");
    }
}

// Function to update an image by ID
async function updateImage(req, res) {
    const { id } = req.params;
    const { image_path, ind, product_id } = req.body;
    try {
        const [result] = await connection.execute(updateImageQuery, [image_path, ind, product_id, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id, image_path, ind, product_id });
        } else {
            notFoundErrorResponse(res, "Couldn't find image to update with given ID");
        }
    } catch (error) {
        serverErrorResponse(res, error, "Failed to update image");
    }
}

// Function to delete an image by ID
async function deleteImage(req, res) {
    const { id } = req.params;
    try {
        const [result] = await connection.execute(deleteImageQuery, [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Image deleted' });
        } else {
            notFoundErrorResponse(res, "Couldn't find image with given ID");
        }
    } catch (error) {
        serverErrorResponse(res, "Failed to delete image with given ID");
    }
}

module.exports = {
    createImage,
    getImageById,
    updateImage,
    deleteImage,
    getProductImagesById
};
