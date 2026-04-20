const express = require('express');
const router = express.Router();
const {
  buyBook, rentBook, returnBook, getMyTransactions, getAllTransactions,
} = require('../controllers/transactionController');
const { protect, adminOnly, customerOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/buy', protect, customerOnly, buyBook);
router.post('/rent', protect, customerOnly, rentBook);
router.post('/return/:id', protect, customerOnly, returnBook);
router.get('/my', protect, getMyTransactions);

// Admin route
router.get('/all', protect, adminOnly, getAllTransactions);

module.exports = router;
