const express = require('express');
const { likeProduct, unlikeProduct, getProductLikes } = require('../controllers/like');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Like Endpoints:
// POST /api/products/:product_id/like: Like a product.
router.post('/api/products/:product_id/like', authenticate,authorizeMod,likeProduct);
// DELETE /api/products/:product_id/unlike: Unlike a product.
router.delete('/api/products/:product_id/unlike', authenticate,authorizeMod,unlikeProduct);
// GET /api/products/:product_id/likes: Retrieve likes and users that liked a specific product.
router.get('/api/products/:product_id/likes', authenticate,authorizeMod,getProductLikes);

module.exports = router;
