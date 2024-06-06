const express = require('express');
const { createImage, getImageById, updateImage, deleteImage, getProductImagesById } = require("../controllers/image");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Image Endpoints:
// POST /api/images: Create a new Image.
router.post('/api/images',  authenticate,authorizeMod,createImage);
// GET /api/images/:id: Get Image by ID.
router.get('/api/images/:id',  authenticate,authorizeMod,getImageById);
// Get /api/images/product/:id : Get all image for this product id
router.get('/api/images/product/:id',  authenticate,authorizeMod,getProductImagesById);
// PUT /api/images/:id: Update Image by ID.
router.put('/api/images/:id',  authenticate,authorizeMod,updateImage);
// DELETE /api/images/:id: Delete Image by ID.
router.delete('/api/images/:id',  authenticate,authorizeMod,deleteImage);

module.exports = router;