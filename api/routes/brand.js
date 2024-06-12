const express = require('express');
const { createBrand, getBrandsByIds, updateBrand, deleteBrand, getBrandIdByName} = require("../controllers/brand");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Brand Endpoints:
// POST /brands: Create a new brand.
router.post('/brands',  authenticate,authorizeMod,createBrand);
// GET /brands/:id: Get brand by ID.
router.get('/brands/:id',  authenticate,authorizeMod,getBrandsByIds);
// GET /rands/name/:name Get brand id by name
router.get('/brands/name/:name',  authenticate,authorizeMod,getBrandIdByName);
// PUT /brands/:id: Update brand by ID.
router.put('/brands/:id',  authenticate,authorizeMod,updateBrand);
// DELETE /brands/:id: Delete brand by ID.
router.delete('/brands/:id',  authenticate,authorizeMod,deleteBrand);

module.exports = router;