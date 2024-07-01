const express = require('express');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const {getUserIdFromUserToken, getThisTokenFromUserId} = require("../models/tokens");
const router = express.Router();


router.get('/token/getUserId/:token', authenticate,authorizeMod,getUserIdFromUserToken);

router.get('/token/getUserToken/:id', authenticate,authorizeMod,getThisTokenFromUserId);





module.exports = router;