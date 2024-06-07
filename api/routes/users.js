const express = require('express');
const {getUserData, changeUserData, deleteUser} = require('../controllers/users');
const authenticate = require('../controllers/tokens');
const {authorizeUser} = require("../models/Authorization Middleware");

const router = express.Router();

// User Endpoints:
// GET /users/:user_id: Retrieve user details by user ID.
router.get('/users/:user_id', authenticate,authorizeUser,getUserData);
// PUT /users/:user_id: Update user details.
router.put('/users/:user_id',  authenticate,authorizeUser,changeUserData);
// DELETE /users/:user_id: Delete a user.
router.delete('/users/:user_id',  authenticate,authorizeUser,deleteUser);

module.exports = router;
