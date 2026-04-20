const express = require('express');
const { createOrder, verifyPayment, getPaymentMethods, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/methods', getPaymentMethods);

// Protected routes (requires authentication)
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
