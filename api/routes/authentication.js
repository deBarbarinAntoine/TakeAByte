const express = require('express');
const {login,logout,register,resetPassword, requestPasswordReset} = require("../controllers/users");
const router = express.Router();

// Authentication Endpoints:
// POST /api/auth/login: User login.
router.post('/api/auth/login', login);
// POST /api/auth/logout: User logout.
router.post('/api/auth/logout', logout);
// POST /api/auth/register: User registration.
router.post('/api/auth/register', register);
// POST /api/auth/reset-password: Request to reset password.
router.post('/api/auth/:mail', requestPasswordReset);
// POST /api/auth/reset-password: Request to reset password.
router.post('/api/auth/reset-password', resetPassword);

module.exports = router;