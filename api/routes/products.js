const express = require('express');
const {
    createNewProduct, getProductById, updateProductData, deleteProduct, getProducts, getTopProduct
} = require('../controllers/products');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Product Endpoints:
// POST /api/products: Create a new product.
router.post('/api/products', authenticate,authorizeMod,createNewProduct);
// GET /api/products/:product_id: Retrieve product details by product ID.
router.get('/api/products/:product_id', authenticate,authorizeMod,getProductById);
// PUT /api/products/:product_id: Update product details.
router.put('/api/products/:product_id', authenticate,authorizeMod,updateProductData);
// DELETE /api/products/:product_id: Delete a product.
router.delete('/api/products/:product_id', authenticate,authorizeMod,deleteProduct);
// GET /api/products: Retrieve a list of products (with optional filtering and pagination). >>
// GET /api/products?filters[name]=Laptop&filters[price_min]=1000&filters[price_max]=2000&page=1 <<
router.get('/api/products', authenticate,authorizeMod,getProducts);
// GET /api/products/top/:limit: Retrieve top products.
router.get('/api/products/top/:limit', authenticate,authorizeMod,getTopProduct);

module.exports = router;
