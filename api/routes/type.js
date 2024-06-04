const express = require('express');
const { createType, getTypeById, updateType, deleteType } = require("../controllers/type");
const router = express.Router();

// Type Endpoints:
// POST /api/types: Create a new Type.
router.post('/api/types', createType);
// GET /api/types/:id: Get Type by ID.
router.get('/api/types/:id', getTypeById);
// PUT /api/types/:id: Update Type by ID.
router.put('/api/types/:id', updateType);
// DELETE /api/types/:id: Delete Type by ID.
router.delete('/api/types/:id', deleteType);

module.exports = router;