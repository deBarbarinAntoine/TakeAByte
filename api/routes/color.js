const express = require('express');
const { createColor, getColorById, updateColor, deleteColor } = require("../controllers/color");
const router = express.Router();

// Color Endpoints:
// POST /api/colors: Create a new Color.
router.post('/api/colors', createColor);
// GET /api/colors/:id: Get Color by ID.
router.get('/api/colors/:id', getColorById);
// PUT /api/colors/:id: Update Color by ID.
router.put('/api/colors/:id', updateColor);
// DELETE /api/colors/:id: Delete Color by ID.
router.delete('/api/colors/:id', deleteColor);

module.exports = router;