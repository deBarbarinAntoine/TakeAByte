const express = require('express');
const {
    createNewProduct, getProductById, updateProductData, deleteProduct, getProducts,getTopProduct
} = require('../controllers/products');
const router = express.Router();

// Product Endpoints:
// POST /api/products: Create a new product.
router.post('/api/products', createNewProduct);
// GET /api/products/:product_id: Retrieve product details by product ID.
router.get('/api/products/:product_id', getProductById);
// PUT /api/products/:product_id: Update product details.
router.put('/api/products/:product_id', updateProductData);
// DELETE /api/products/:product_id: Delete a product.
router.delete('/api/products/:product_id', deleteProduct);
// GET /api/products: Retrieve a list of products (with optional filtering and pagination).
router.get('/api/products/:filters?/:page?', getProducts);
// GET /api/product/top/:limit : Retrieve top products
router.get('/api/products/top/:limit', getTopProduct)

module.exports = router;
