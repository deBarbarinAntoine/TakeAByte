const express = require('express');
const { createImage, getImageById, updateImage, deleteImage, getProductImagesById } = require("../controllers/image");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Image Endpoints:
// POST /images: Create a new Image.
router.post('/images',  authenticate,authorizeMod,createImage);
// GET /images/:id: Get Image by ID.
router.get('/images/:id',  authenticate,authorizeMod,getImageById);
// Get /images/product/:id : Get all image for this product id
router.get('/images/product/:id',  authenticate,authorizeMod,getProductImagesById);
// PUT /images/:id: Update Image by ID.
router.put('/images/:id',  authenticate,authorizeMod,updateImage);
// DELETE /images/:id: Delete Image by ID.
router.delete('/images/:id',  authenticate,authorizeMod,deleteImage);

module.exports = router;