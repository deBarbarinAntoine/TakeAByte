const express = require('express');
const { createBrand, getBrandById, updateBrand, deleteBrand, getBrandIdByName} = require("../controllers/brand");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Brand Endpoints:
// POST /api/brands: Create a new brand.
router.post('/api/brands',  authenticate,authorizeMod,createBrand);
// GET /api/brands/:id: Get brand by ID.
router.get('/api/brands/:id',  authenticate,authorizeMod,getBrandById);
// GET /api/rands/name/:name Get brand id by name
router.get('/api/brands/name/:name',  authenticate,authorizeMod,getBrandIdByName);
// PUT /api/brands/:id: Update brand by ID.
router.put('/api/brands/:id',  authenticate,authorizeMod,updateBrand);
// DELETE /api/brands/:id: Delete brand by ID.
router.delete('/api/brands/:id',  authenticate,authorizeMod,deleteBrand);

module.exports = router;