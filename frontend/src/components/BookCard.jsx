import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiClock } from 'react-icons/fi';
import { formatINR } from '../utils/currency';
import './BookCard.css';

const BookCard = ({ book, index = 0 }) => {
  return (
    <motion.div
      className="book-card glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
    >
      <Link to={`/book/${book._id}`} className="book-card-link">
        <div className="book-card-image">
          <img src={book.coverImage} alt={book.title} />
          <motion.div
            className="book-card-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="view-details"
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              View Details
            </motion.span>
          </motion.div>
          {book.featured && (
            <motion.span
              className="featured-badge"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌟 Featured
            </motion.span>
          )}
        </div>
        <div className="book-card-content">
          <span className="book-genre">{book.genre}</span>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-rating">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="rating-wrapper"
            >
              <FiStar className="star-icon" />
              <span>{(book.rating || 4.5).toFixed(1)}</span>
            </motion.div>
          </div>
          <div className="book-prices">
            <motion.div
              className="price-item"
              whileHover={{ scale: 1.05 }}
            >
              <FiShoppingCart className="price-icon" />
              <span className="price-label">Buy</span>
              <span className="price-value">{formatINR(book.buyPrice)}</span>
            </motion.div>
            <div className="price-divider"></div>
            <motion.div
              className="price-item"
              whileHover={{ scale: 1.05 }}
            >
              <FiClock className="price-icon" />
              <span className="price-label">Rent</span>
              <span className="price-value">{formatINR(book.rentPricePerDay)}/day</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
