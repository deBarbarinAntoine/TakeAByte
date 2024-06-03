const express = require('express');
const {register} = require("../controllers/users");
const router = express.Router();


// User Endpoints:
// POST /api/users: Create a new user.
router.post('/api/users', register);
// GET /api/users/{user_id}: Retrieve user details by user ID.
router.get('/api/users/:user_id', getUserData);
// PUT /api/users/{user_id}: Update user details.
router.put('/api/users/:user_id', changeUserData);
// DELETE /api/users/{user_id}: Delete a user.
router.delete('/api/users/:user_id', deleteUser)

module.exports = router;