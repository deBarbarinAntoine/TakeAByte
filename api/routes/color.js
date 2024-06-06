const express = require('express');
const { createColor, getColorById, updateColor, deleteColor } = require("../controllers/color");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Color Endpoints:
// POST /api/colors: Create a new Color.
router.post('/api/colors',  authenticate,authorizeMod,createColor);
// GET /api/colors/:id: Get Color by ID.
router.get('/api/colors/:id', authenticate,authorizeMod,getColorById);
// PUT /api/colors/:id: Update Color by ID.
router.put('/api/colors/:id',  authenticate,authorizeMod,updateColor);
// DELETE /api/colors/:id: Delete Color by ID.
router.delete('/api/colors/:id',  authenticate,authorizeMod,deleteColor);

module.exports = router;