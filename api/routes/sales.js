const express = require('express');
const router = express.Router();

// Sales Endpoints :
// GET /api/sales : Retrieve ongoing sales.
router.get('/api/sales/:user_id', getUserOngoingSales);
// POST /api/sales: Create a new sale.
router.post('/api/sales', createNewSales);
