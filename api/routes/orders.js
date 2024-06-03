const express = require('express');
const router = express.Router();

// Order Endpoints:
// POST /api/orders: Create a new order.
router.post('/api/orders', createNewOrder);
// GET /api/orders/{order_id}: Retrieve order details by order ID.
router.get('/api/orders/:order_id', getOrderData);
// GET /api/users/{user_id}/orders: Retrieve orders for a specific user.
router.get('/api/users/:user_id/orders', getUserOrdersData);
// GET /api/products/{product_id}/orders: Retrieve orders for a specific product.
router.get('/api/products/:product_id/orders', getOrdersOfProduct);

module.exports = router;