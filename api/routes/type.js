const express = require('express');
const {createType, getTypeById, updateType, deleteType, getTypeIdByName} = require("../controllers/type");
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Type Endpoints:
// POST /types: Create a new Type.
router.post('/types', authenticate,authorizeMod,createType);
// GET /types/:id: Get Type by ID.
router.get('/types/:id', authenticate,authorizeMod,getTypeById);
// GET /type/name/:name, getTypeIdByName);
router.get('/types/name/:name', authenticate,authorizeMod,getTypeIdByName);
// PUT /types/:id: Update Type by ID.
router.put('/types/:id', authenticate,authorizeMod,updateType);
// DELETE /types/:id: Delete Type by ID.
router.delete('/types/:id', authenticate,authorizeMod,deleteType);

module.exports = router;