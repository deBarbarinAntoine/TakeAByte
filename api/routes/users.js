const express = require('express');
const {getUserData, changeUserData, deleteUser} = require('../controllers/users');
const authenticate = require('../controllers/tokens');
const {authorizeUser} = require("../models/Authorization Middleware");

const router = express.Router();

// User Endpoints:
// GET /api/users/:user_id: Retrieve user details by user ID.
router.get('/api/users/:user_id', authenticate,authorizeUser,getUserData);
// PUT /api/users/:user_id: Update user details.
router.put('/api/users/:user_id',  authenticate,authorizeUser,changeUserData);
// DELETE /api/users/:user_id: Delete a user.
router.delete('/api/users/:user_id',  authenticate,authorizeUser,deleteUser);

module.exports = router;
