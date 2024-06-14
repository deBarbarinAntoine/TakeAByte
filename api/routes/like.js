const express = require('express');
const { likeProduct, unlikeProduct, getProductLikes, getUserFav} = require('../controllers/like');
const authenticate = require("../controllers/tokens");
const {authorizeMod, authorizeUser} = require("../models/Authorization Middleware");
const router = express.Router();

// Like Endpoints:
// POST /like: Like a product.
router.put('/like/:product_id', authenticate,likeProduct);
// DELETE /unlike: Unlike a product.
router.delete('/unlike/:product_id', authenticate,unlikeProduct);
// GET /likes: Retrieve likes and users that liked a specific product.
router.get('/likes/:product_id', authenticate,authorizeMod,getProductLikes);
// Get /userLikes Retrieve specified user liked products
router.get('/userLikes/:user_id',authenticate,getUserFav)


module.exports = router;
