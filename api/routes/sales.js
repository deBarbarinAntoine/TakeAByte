const express = require('express');
const {
    createNewSales, getUserOngoingSales, GetSaleForProduct
} = require('../controllers/sales');
const authenticate = require("../controllers/tokens");
const {authorizeMod, authorizeUser} = require("../models/Authorization Middleware");
const router = express.Router();

// Sales Endpoints: // sale = promotion !!
// GET /sales/:user_id: Do users order products have sales-promotion.
router.get('/sales/:user_id', authenticate, authorizeUser, getUserOngoingSales);
// POST /sales: Create a new sale - promotion.
router.post('/sales', authenticate, authorizeMod, createNewSales);
// GET /sales/:product_id get if product have current promotion
router.get('/sales/product/:product_id', authenticate, authorizeMod, GetSaleForProduct)

module.exports = router;
