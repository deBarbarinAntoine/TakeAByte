const express = require('express');
const { likeProduct, unlikeProduct, getProductLikes } = require('../controllers/like');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Like Endpoints:
// POST /like: Like a product.
router.post('/like', authenticate,authorizeMod,likeProduct);
// DELETE /unlike: Unlike a product.
router.delete('/unlike', authenticate,authorizeMod,unlikeProduct);
// GET /likes: Retrieve likes and users that liked a specific product.
router.get('/likes', authenticate,authorizeMod,getProductLikes);

module.exports = router;
