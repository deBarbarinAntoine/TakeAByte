const express = require('express');
const {createType, getTypeById, updateType, deleteType, getTypeIdByName} = require("../controllers/type");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Type Endpoints:
// POST /api/types: Create a new Type.
router.post('/api/types', authenticate,authorizeMod,createType);
// GET /api/types/:id: Get Type by ID.
router.get('/api/types/:id', authenticate,authorizeMod,getTypeById);
// GET /api/type/name/:name, getTypeIdByName);
router.get('/api/types/name/:name', authenticate,authorizeMod,getTypeIdByName);
// PUT /api/types/:id: Update Type by ID.
router.put('/api/types/:id', authenticate,authorizeMod,updateType);
// DELETE /api/types/:id: Delete Type by ID.
router.delete('/api/types/:id', authenticate,authorizeMod,deleteType);

module.exports = router;