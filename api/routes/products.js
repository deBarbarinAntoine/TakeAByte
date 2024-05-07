const express = require('express');
const router = express.Router();

const {getProducts, getProductById, getProductsByType} = require("../controllers/products");

router.get('/products/search', getProductsByType);

router.get('/products', getProducts);

router.get('/product/:id', getProductById);

module.exports = router;