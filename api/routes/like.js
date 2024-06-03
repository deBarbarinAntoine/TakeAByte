const express = require('express');
const router = express.Router();

// Like Endpoints:
// POST /api/products/{product_id}/like: Like a product.
router.post('/api/products/:product_id/like', likeProduct);
// DELETE /api/products/{product_id}/unlike: Unlike a product.
router.delete('/api/products/:product_id/unlike', UnlikeProduct);
// GET /api/products/{product_id}/likes: Retrieve likes for a specific product.
router.get('/api/products/:product_id/likes', getProductLikes);

module.exports = router;