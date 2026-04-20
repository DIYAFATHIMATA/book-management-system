const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// @desc    Buy a book
// @route   POST /api/transactions/buy
const buyBook = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stockForSale < quantity) {
      return res.status(400).json({ message: 'Not enough stock available for purchase' });
    }

    const totalAmount = book.buyPrice * quantity;

    const transaction = await Transaction.create({
      user: req.user._id,
      book: bookId,
      type: 'buy',
      quantity,
      totalAmount,
      status: 'completed',
    });

    // Decrease stock
    book.stockForSale -= quantity;
    await book.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author coverImage')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Rent a book
// @route   POST /api/transactions/rent
const rentBook = async (req, res) => {
  try {
    const { bookId, rentalDays = 7 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stockForRent < 1) {
      return res.status(400).json({ message: 'No copies available for rent' });
    }

    const totalAmount = book.rentPricePerDay * rentalDays;
    const rentStartDate = new Date();
    const rentEndDate = new Date();
    rentEndDate.setDate(rentEndDate.getDate() + rentalDays);

    const transaction = await Transaction.create({
      user: req.user._id,
      book: bookId,
      type: 'rent',
      quantity: 1,
      totalAmount,
      rentalDays,
      rentStartDate,
      rentEndDate,
      returned: false,
      status: 'active',
    });

    // Decrease rental stock
    book.stockForRent -= 1;
    await book.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author coverImage')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Return a rented book
// @route   POST /api/transactions/return/:id
const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.type !== 'rent') {
      return res.status(400).json({ message: 'This is not a rental transaction' });
    }

    if (transaction.returned) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to return this book' });
    }

    transaction.returned = true;
    transaction.status = 'returned';
    await transaction.save();

    // Increase rental stock back
    const book = await Book.findById(transaction.book);
    if (book) {
      book.stockForRent += 1;
      await book.save();
    }

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author coverImage')
      .populate('user', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's transactions
// @route   GET /api/transactions/my
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('book', 'title author coverImage buyPrice rentPricePerDay')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/all
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title author coverImage')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { buyBook, rentBook, returnBook, getMyTransactions, getAllTransactions };
