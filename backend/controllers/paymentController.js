const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// Initialize Razorpay lazily (only when keys are available)
let razorpay = null;

const initializeRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// @desc    Create a payment order
// @route   POST /api/payments/create-order
const createOrder = async (req, res) => {
  try {
    const { bookId, type, quantity = 1, rentalDays = 0 } = req.body;
    const userId = req.user.id;

    // Validate book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate amount based on type
    let amount = 0;
    if (type === 'buy') {
      amount = book.buyPrice * quantity * 100; // Razorpay expects amount in paise
    } else if (type === 'rent') {
      amount = book.rentPricePerDay * rentalDays * quantity * 100;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Check if using test/placeholder keys (for development)
    const isTestMode = process.env.RAZORPAY_KEY_ID?.includes('test') || 
                       process.env.RAZORPAY_KEY_ID?.includes('1Aa00000000001');
    
    let order;
    let transactionStatus = 'pending';

    if (isTestMode) {
      // Development mode: create a mock order
      console.log('Using test Razorpay keys - creating mock order for testing');
      order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };
    } else {
      // Production mode: use real Razorpay
      const rzp = initializeRazorpay();
      if (!rzp) {
        return res.status(400).json({ 
          message: 'Payment gateway not properly configured',
          development: true 
        });
      }

      const options = {
        amount: Math.round(amount),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId,
          bookId,
          type,
          quantity,
          rentalDays,
        },
      };

      order = await rzp.orders.create(options);
    }

    // Create transaction record (pending status)
    const transaction = await Transaction.create({
      user: userId,
      book: bookId,
      type,
      quantity,
      totalAmount: amount / 100, // Store in rupees
      rentalDays: type === 'rent' ? rentalDays : 0,
      rentStartDate: type === 'rent' ? new Date() : null,
      rentEndDate: type === 'rent' ? new Date(Date.now() + rentalDays * 24 * 60 * 60 * 1000) : null,
      status: transactionStatus,
      razorpayOrderId: order.id,
      currency: 'INR',
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
      publicKey: process.env.RAZORPAY_KEY_ID,
      testMode: isTestMode,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment order. Using test keys? Add real Razorpay keys to .env for production.', 
      error: error.message 
    });
  }
};

// @desc    Verify payment and complete transaction
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId, paymentMethod } = req.body;

    // Check if using test/placeholder keys (for development)
    const isTestMode = process.env.RAZORPAY_KEY_ID?.includes('test') || 
                       process.env.RAZORPAY_KEY_ID?.includes('1Aa00000000001');

    let isSignatureValid = false;

    if (isTestMode) {
      // Development mode: accept all payments
      console.log('Test mode - automatically accepting payment');
      isSignatureValid = true;
    } else {
      // Production mode: verify signature
      const rzp = initializeRazorpay();
      if (!rzp) {
        return res.status(400).json({ 
          message: 'Payment gateway not properly configured',
          development: true 
        });
      }

      // Verify signature
      const shasum = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isSignatureValid = shasum === razorpaySignature;
    }

    if (!isSignatureValid) {
      return res.status(400).json({ message: 'Payment verification failed - invalid signature' });
    }

    // Update transaction with payment details
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'completed',
        paymentMethod: paymentMethod || 'card',
        razorpayPaymentId: razorpayPaymentId || 'test_payment_' + Date.now(),
        razorpaySignature: razorpaySignature || 'test_signature',
      },
      { new: true }
    ).populate('book user');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update book stock
    if (transaction.type === 'buy') {
      await Book.findByIdAndUpdate(transaction.book._id, {
        $inc: { stockForSale: -transaction.quantity },
      });
    } else if (transaction.type === 'rent') {
      await Book.findByIdAndUpdate(transaction.book._id, {
        $inc: { stockForRent: -transaction.quantity },
      });
    }

    res.json({
      message: 'Payment verified successfully' + (isTestMode ? ' (Test Mode)' : ''),
      transaction,
      testMode: isTestMode,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// @desc    Get payment methods (for display purposes)
// @route   GET /api/payments/methods
const getPaymentMethods = async (req, res) => {
  try {
    const methods = [
      {
        id: 'upi',
        name: 'UPI',
        description: 'Pay using any UPI app',
        icon: '📱',
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, or any bank card',
        icon: '💳',
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'Direct bank transfer',
        icon: '🏦',
      },
    ];
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment methods', error: error.message });
  }
};

// @desc    Get transaction history for user
// @route   GET /api/payments/history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId })
      .populate('book', 'title coverImage')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history', error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentMethods,
  getPaymentHistory,
};
