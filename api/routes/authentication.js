const express = require('express');
const {login,logout,register,resetPassword, requestPasswordReset} = require("../controllers/users");
const authenticate = require("../controllers/tokens");
const {authorizeMail, authorizeUserLogout} = require("../models/Authorization Middleware");
const limiter = require("../models/limiting Middleware");
const router = express.Router();

// Authentication Endpoints:
// POST login: User login.
router.post('/login', limiter,login);
// POST logout: User logout.
router.post('/logout',  authenticate,authorizeUserLogout,logout);
// POST register: User registration.
router.post('/register', limiter,register);
// POST reset-password: Request to reset password.
router.post('/:mail',  limiter,authorizeMail,requestPasswordReset);
// POST reset-password: Request to reset password.
router.post('/reset-password', limiter,resetPassword);

module.exports = router;