const express = require('express');
const { createNewOrder, getOrderData, getUserOrdersData, getOrdersOfProduct, getOrderByStatus, getOrderDetails} = require('../controllers/order');
const authenticate = require("../controllers/tokens");
const {authorizeMod, authorizeUser} = require("../models/Authorization Middleware");
const router = express.Router();

// Order Endpoints:
// POST /orders: Create a new order.
router.post('/orders/:user_id', authenticate,authorizeUser,createNewOrder);
// GET /orders/:order_id: Retrieve order details by order ID.
router.get('/orders/:order_id', authenticate,authorizeMod,getOrderData);
// GET /users/:user_id/orders: Retrieve orders for a specific user.
router.get('/users/:user_id/orders', authenticate,authorizeMod,getUserOrdersData);
// GET /products/:product_id/orders: Retrieve orders for a specific product.
router.get('/products/:product_id/orders', authenticate,authorizeMod,getOrdersOfProduct);
// GET /orders/:user_id Retrieve user specified status order
router.get('/orders/:user_id', authenticate,authorizeMod,getOrderByStatus);

router.get('/ordersDetail/:order_id',  authenticate,authorizeMod,getOrderDetails)

module.exports = router;
