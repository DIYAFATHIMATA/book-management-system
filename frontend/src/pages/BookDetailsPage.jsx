import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiClock, FiStar, FiArrowLeft, FiBook, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import PaymentModal from '../components/PaymentModal';
import { formatINR } from '../utils/currency';
import './BookDetailsPage.css';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalDays, setRentalDays] = useState(7);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, type: null });

  useEffect(() => {
    api.get(`/books/${id}`).then(res => setBook(res.data)).catch(() => navigate('/catalog')).finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = () => {
    if (!user) return navigate('/login');
    setPaymentModal({ isOpen: true, type: 'buy' });
  };

  const handleRent = () => {
    if (!user) return navigate('/login');
    setPaymentModal({ isOpen: true, type: 'rent' });
  };

  const handlePaymentSuccess = (response) => {
    showToast(paymentModal.type === 'buy' ? 'Book purchased successfully!' : `Book rented for ${rentalDays} days!`);
    setBook(prev => ({
      ...prev,
      stockForSale: paymentModal.type === 'buy' ? prev.stockForSale - 1 : prev.stockForSale,
      stockForRent: paymentModal.type === 'rent' ? prev.stockForRent - 1 : prev.stockForRent,
    }));
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!book) return null;

  return (
    <AnimatedPage>
      <div className="book-details-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
          <div className="book-details-grid">
            <motion.div className="book-cover-section" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="book-cover-wrapper">
                <img src={book.coverImage} alt={book.title} className="book-cover-img" />
                <div className="cover-glow"></div>
              </div>
            </motion.div>
            <motion.div className="book-info-section" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="detail-genre">{book.genre}</span>
              <h1 className="detail-title">{book.title}</h1>
              <p className="detail-author">by {book.author}</p>
              <div className="detail-rating"><FiStar className="star-fill" /> {book.rating?.toFixed(1)} <span className="rating-sub">/ 5.0</span></div>
              <div className="detail-meta">
                <div className="meta-item"><FiBook /> {book.pages} pages</div>
                <div className="meta-item"><FiCalendar /> {book.publishedYear > 0 ? book.publishedYear : 'Ancient'}</div>
                <div className="meta-item">ISBN: {book.isbn}</div>
              </div>
              <p className="detail-desc">{book.description}</p>
              <div className="purchase-section glass-card">
                <div className="purchase-option">
                  <div className="option-header">
                    <FiShoppingCart /> Buy This Book
                  </div>
                  <div className="option-price">{formatINR(book.buyPrice)}</div>
                  <div className="stock-info">{book.stockForSale > 0 ? `${book.stockForSale} in stock` : 'Out of stock'}</div>
                  <button className="btn-primary" onClick={handleBuy} disabled={actionLoading || book.stockForSale <= 0 || !isCustomer}>
                    {book.stockForSale <= 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
                <div className="option-divider"></div>
                <div className="purchase-option">
                  <div className="option-header">
                    <FiClock /> Rent This Book
                  </div>
                  <div className="option-price">{formatINR(book.rentPricePerDay)}<span className="per-day">/day</span></div>
                  <div className="rental-days-picker">
                    <label>Days:</label>
                    <select value={rentalDays} onChange={e => setRentalDays(Number(e.target.value))}>
                      {[3, 7, 14, 21, 30].map(d => <option key={d} value={d}>{d} days - {formatINR(book.rentPricePerDay * d)}</option>)}
                    </select>
                  </div>
                  <div className="stock-info">{book.stockForRent > 0 ? `${book.stockForRent} available` : 'None available'}</div>
                  <button className="btn-gold" onClick={handleRent} disabled={actionLoading || book.stockForRent <= 0 || !isCustomer}>
                    {book.stockForRent <= 0 ? 'Unavailable' : `Rent for ${formatINR(book.rentPricePerDay * rentalDays)}`}
                  </button>
                </div>
              </div>
              {!user && <p className="login-prompt">Please <a href="/login">sign in</a> as a customer to buy or rent.</p>}
            </motion.div>
          </div>
        </div>
      </div>
      
      <PaymentModal 
        isOpen={paymentModal.isOpen} 
        onClose={() => setPaymentModal({ isOpen: false, type: null })} 
        book={book} 
        transactionType={paymentModal.type} 
        rentalDays={rentalDays}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </AnimatedPage>
  );
};

export default BookDetailsPage;
