const express = require('express');
const {
    createNewProduct, getProductById, updateProductData, deleteProduct, getProducts, getTopProduct
} = require('../controllers/products');
const authenticate = require("../controllers/tokens");
const {authorizeMod} = require("../models/Authorization Middleware");
const router = express.Router();

// Product Endpoints:
// POST /products: Create a new product.
router.post('/products', authenticate,authorizeMod,createNewProduct);
// GET /products/:product_id: Retrieve product details by product ID.
router.get('/products/:product_id', authenticate,authorizeMod,getProductById);
// PUT /products/:product_id: Update product details.
router.put('/products/:product_id', authenticate,authorizeMod,updateProductData);
// DELETE /products/:product_id: Delete a product.
router.delete('/products/:product_id', authenticate,authorizeMod,deleteProduct);
// GET /products: Retrieve a list of products (with optional filtering and pagination). >>
// GET /products?filters[name]=Laptop&filters[price_min]=1000&filters[price_max]=2000&page=1 <<
router.get('/products', authenticate,authorizeMod,getProducts);
// GET /products/top/:limit: Retrieve top products.
router.get('/products/top/:limit', authenticate,authorizeMod,getTopProduct);

module.exports = router;
