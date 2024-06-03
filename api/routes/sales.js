const express = require('express');
const {
    createNewSales, getUserOngoingSales
} = require('../controllers/sales');
const router = express.Router();

// Sales Endpoints: // sale = promotion !!
// GET /api/sales/:user_id: Do users order products have sales-promotion.
router.get('/api/sales/:user_id', getUserOngoingSales);
// POST /api/sales: Create a new sale - promotion.
router.post('/api/sales', createNewSales);

module.exports = router;
