
const express = require('express');
const router = express.Router();
const verifyAdminToken = require('../middleware/verifyAdminToken');
const { 
  createAOrder, 
  completeEsewaOrder, 
  getOrderByEmail, 
  deleteOrder,
  getAllOrders,
  updateOrderStatus ,getOrderById
} = require('./order.controller');

// Order routes
router.post('/', createAOrder);
router.post('/esewa', completeEsewaOrder);
router.get('/email/:email', getOrderByEmail);
router.delete('/:id', deleteOrder);
router.get('/', getAllOrders);
router.patch('/:id/status', verifyAdminToken, updateOrderStatus);


router.get('/:id', getOrderById); // GET /api/orders/:id





module.exports = router;