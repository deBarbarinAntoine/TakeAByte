const express = require('express');
const { createBrand, getBrandById, updateBrand, deleteBrand } = require("../controllers/brand");
const router = express.Router();

// Brand Endpoints:
// POST /api/brands: Create a new brand.
router.post('/api/brands', createBrand);
// GET /api/brands/:id: Get brand by ID.
router.get('/api/brands/:id', getBrandById);
// PUT /api/brands/:id: Update brand by ID.
router.put('/api/brands/:id', updateBrand);
// DELETE /api/brands/:id: Delete brand by ID.
router.delete('/api/brands/:id', deleteBrand);

module.exports = router;