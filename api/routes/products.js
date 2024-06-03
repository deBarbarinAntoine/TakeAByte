const express = require('express');
const router = express.Router();

const {getProducts, getProductById, getProductsByType} = require("../controllers/products");

router.get('/products/search', getProductsByType);

router.get('/products', getProducts);

router.get('/product/:id', getProductById);

module.exports = router;

// Product Endpoints:
// POST /api/products: Create a new product.
router.post('/api/products', createNewProduct);
// GET /api/products/{product_id}: Retrieve product details by product ID.
router.get('/api/products/:product_id', getProductData);
// PUT /api/products/{product_id}: Update product details.
router.put('/api/products/:product_id', udpateProductData);
// DELETE /api/products/{product_id}: Delete a product.
router.delete('/api/products/:product_id', deleteProduct);
// GET /api/products: Retrieve a list of products (with optional filtering and pagination).
router.get('/api/products/:filters/:page');
