const express = require('express');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const {getUserIdFromUserToken} = require("../models/tokens");
const router = express.Router();


router.get('/token/getUserId/:token', authenticate,authorizeMod,getUserIdFromUserToken);




module.exports = router;