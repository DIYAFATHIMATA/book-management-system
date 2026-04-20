const express = require('express');
const router = express.Router();
const {
  getBooks, getBookById, addBook, updateBook, deleteBook, getGenres,
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/genres/list', getGenres);
router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin-only routes
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
