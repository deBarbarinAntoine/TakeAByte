const express = require('express');
const { createImage, getImageById, updateImage, deleteImage, getProductImagesById } = require("../controllers/image");
const router = express.Router();

// Image Endpoints:
// POST /api/images: Create a new Image.
router.post('/api/images', createImage);
// GET /api/images/:id: Get Image by ID.
router.get('/api/images/:id', getImageById);
// Get /api/images/product/:id : Get all image for this product id
router.get('/api/images/product/:id', getProductImagesById);
// PUT /api/images/:id: Update Image by ID.
router.put('/api/images/:id', updateImage);
// DELETE /api/images/:id: Delete Image by ID.
router.delete('/api/images/:id', deleteImage);

module.exports = router;