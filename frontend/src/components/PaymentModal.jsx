import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { createPaymentOrder, handleRazorpayPayment } from '../services/paymentService';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, book, transactionType = 'buy', rentalDays = 0, onPaymentSuccess, quantity = 1 }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success', 'error'
  const [error, setError] = useState(null);
  const [testMode, setTestMode] = useState(false);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, BHIM' },
    { id: 'card', name: 'Card', icon: '💳', desc: 'Credit/Debit Card' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', desc: 'Direct bank transfer' },
  ];

  // Calculate total amount
  const calculateAmount = () => {
    if (transactionType === 'buy') {
      return book.buyPrice * quantity;
    } else if (transactionType === 'rent') {
      return book.rentPricePerDay * rentalDays * quantity;
    }
    return 0;
  };

  const totalAmount = calculateAmount();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus('processing');
      setError(null);

      // Create order
      const orderData = await createPaymentOrder(
        book._id,
        transactionType,
        quantity,
        rentalDays
      );

      // Capture test mode flag
      setTestMode(orderData.testMode || false);

      // Handle Razorpay payment
      await handleRazorpayPayment(
        orderData,
        (response) => {
          setPaymentStatus('success');
          setLoading(false);
          if (onPaymentSuccess) {
            setTimeout(() => {
              onPaymentSuccess(response);
              onClose();
            }, 2000);
          }
        },
        (err) => {
          setPaymentStatus('error');
          setError(err.message || 'Payment failed');
          setLoading(false);
        }
      );
    } catch (err) {
      setPaymentStatus('error');
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.8, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="payment-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="payment-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="payment-modal-header">
              <h2 className="payment-modal-title">
                {paymentStatus === 'success' ? '✓ Payment Successful!' : 'Complete Your Order'}
              </h2>
              <button className="payment-modal-close" onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="payment-modal-content">
              {testMode && (
                <motion.div
                  className="test-mode-banner"
                  style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#856404',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <span><strong>Test Mode:</strong> Using test payment keys. Payment will succeed automatically.</span>
                </motion.div>
              )}
              {paymentStatus === null && (
                <>
                  {/* Book Summary */}
                  <motion.div
                    className="order-summary"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                  >
                    <div className="summary-item">
                      <img src={book.coverImage} alt={book.title} className="summary-book-image" />
                      <div className="summary-details">
                        <h3>{book.title}</h3>
                        <p className="summary-author">{book.author}</p>
                        <p className="summary-type">
                          {transactionType === 'buy' ? 'Purchase' : `Rent for ${rentalDays} days`}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Price Breakdown */}
                  <motion.div
                    className="price-breakdown"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <div className="breakdown-row">
                      <span>
                        {transactionType === 'buy'
                          ? `₹${book.buyPrice} × ${quantity} item(s)`
                          : `₹${book.rentPricePerDay} × ${rentalDays} days`}
                      </span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row-total">
                      <span>Total Amount</span>
                      <span className="total-price">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </motion.div>

                  {/* Payment Methods */}
                  <motion.div
                    className="payment-methods"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="methods-title">Choose Payment Method</h3>
                    <div className="methods-grid">
                      {paymentMethods.map((method) => (
                        <motion.button
                          key={method.id}
                          className={`method-card ${selectedMethod === method.id ? 'active' : ''}`}
                          onClick={() => setSelectedMethod(method.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="method-icon">{method.icon}</div>
                          <div className="method-name">{method.name}</div>
                          <div className="method-desc">{method.desc}</div>
                          {selectedMethod === method.id && <div className="method-checkmark">✓</div>}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="error-message"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <FiAlertCircle size={18} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Pay Button */}
                  <motion.button
                    className="pay-button"
                    onClick={handlePayment}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="spinner" />
                        Processing...
                      </>
                    ) : (
                      <>
                        💳 Pay ₹{totalAmount.toFixed(2)}
                      </>
                    )}
                  </motion.button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <motion.div
                  className="status-container processing"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="spinner-large">
                    <FiLoader size={48} />
                  </div>
                  <h3>Processing Payment...</h3>
                  <p>Please complete the payment in the Razorpay window</p>
                </motion.div>
              )}

              {paymentStatus === 'success' && (
                <motion.div
                  className="status-container success"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <FiCheckCircle size={64} className="success-icon" />
                  </motion.div>
                  <h3>Payment Successful!</h3>
                  <p>Your transaction has been completed</p>
                  <p className="success-detail">
                    {transactionType === 'buy'
                      ? `You have purchased "${book.title}"`
                      : `You have rented "${book.title}" for ${rentalDays} days`}
                  </p>
                </motion.div>
              )}

              {paymentStatus === 'error' && (
                <motion.div
                  className="status-container error"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <FiAlertCircle size={64} className="error-icon" />
                  </motion.div>
                  <h3>Payment Failed</h3>
                  <p>{error || 'Something went wrong'}</p>
                  <motion.button
                    className="retry-button"
                    onClick={() => {
                      setPaymentStatus(null);
                      setError(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="payment-modal-footer">
              <p className="footer-text">🔒 Secured by Razorpay • All payments are encrypted</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
