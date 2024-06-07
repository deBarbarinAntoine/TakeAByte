const express = require('express');
const {login,logout,register,resetPassword, requestPasswordReset} = require("../controllers/users");
const authenticate = require("../controllers/tokens");
const {authorizeUser, authorizeMail} = require("../models/Authorization Middleware");
const limiter = require("../models/limiting Middleware");
const router = express.Router();

// Authentication Endpoints:
// POST /api/auth/login: User login.
router.post('/api/auth/login', limiter,login);
// POST /api/auth/logout: User logout.
router.post('/api/auth/logout',  authenticate,authorizeUser,logout);
// POST /api/auth/register: User registration.
router.post('/api/auth/register', limiter,register);
// POST /api/auth/reset-password: Request to reset password.
router.post('/api/auth/:mail',  limiter,authorizeMail,requestPasswordReset);
// POST /api/auth/reset-password: Request to reset password.
router.post('/api/auth/reset-password', limiter,resetPassword);

module.exports = router;