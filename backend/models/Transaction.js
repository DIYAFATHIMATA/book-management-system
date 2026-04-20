const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  type: {
    type: String,
    enum: ['buy', 'rent'],
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  rentalDays: {
    type: Number,
    default: 0,
  },
  rentStartDate: {
    type: Date,
  },
  rentEndDate: {
    type: Date,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['completed', 'active', 'returned', 'overdue', 'pending', 'failed'],
    default: 'completed',
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet'],
    default: null,
  },
  paymentId: {
    type: String,
    default: null,
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  currency: {
    type: String,
    default: 'INR',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
