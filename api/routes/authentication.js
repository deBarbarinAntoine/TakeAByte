const express = require('express');
const {login} = require("../controllers/users");
const router = express.Router();

// Authentication Endpoints:
// POST /api/auth/login: User login.
router.post('/api/auth/login', login);
// POST /api/auth/logout: User logout.
router.post('/api/auth/logout', UserLogout);
// POST /api/auth/register: User registration.
router.post('/api/auth/register', UserRegister);
// POST /api/auth/reset-password: Request to reset password.
router.post('/api/auth/rester-password', UserResetPassword);

module.exports = router;