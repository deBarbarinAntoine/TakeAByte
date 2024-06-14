const express = require('express');
const { likeProduct, unlikeProduct, getProductLikes, getUserFav} = require('../controllers/like');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Like Endpoints:
// POST /like: Like a product.
router.post('/:product_id', authenticate,authorizeMod,likeProduct);
// DELETE /unlike: Unlike a product.
router.delete('/unlike', authenticate,authorizeMod,unlikeProduct);
// GET /likes: Retrieve likes and users that liked a specific product.
router.get('/likes/:product_id', authenticate,authorizeMod,getProductLikes);
// Get /userLikes Retrieve specified user liked products
router.get('/userLikes/:user_id',authenticate,authorizeMod,getUserFav)


module.exports = router;
