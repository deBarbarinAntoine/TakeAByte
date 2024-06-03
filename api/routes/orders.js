const express = require('express');
const { createNewOrder, getOrderData, getUserOrdersData, getOrdersOfProduct, getOrderByStatus} = require('../controllers/order');
const router = express.Router();

// Order Endpoints:
// POST /api/orders: Create a new order.
router.post('/api/orders', createNewOrder);
// GET /api/orders/:order_id: Retrieve order details by order ID.
router.get('/api/orders/:order_id', getOrderData);
// GET /api/users/:user_id/orders: Retrieve orders for a specific user.
router.get('/api/users/:user_id/orders', getUserOrdersData);
// GET /api/products/:product_id/orders: Retrieve orders for a specific product.
router.get('/api/products/:product_id/orders', getOrdersOfProduct);
// GET /api/orders/:user_id Retrieve user specified status order
router.get('/api/orders/:user_id', getOrderByStatus);

module.exports = router;
