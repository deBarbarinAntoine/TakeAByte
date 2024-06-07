const express = require('express');
const { createColor, getColorById, updateColor, deleteColor } = require("../controllers/color");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Color Endpoints:
// POST /colors: Create a new Color.
router.post('/colors',  authenticate,authorizeMod,createColor);
// GET /colors/:id: Get Color by ID.
router.get('/colors/:id', authenticate,authorizeMod,getColorById);
// PUT /colors/:id: Update Color by ID.
router.put('/colors/:id',  authenticate,authorizeMod,updateColor);
// DELETE /colors/:id: Delete Color by ID.
router.delete('/colors/:id',  authenticate,authorizeMod,deleteColor);

module.exports = router;