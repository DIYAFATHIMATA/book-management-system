import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiBookOpen, FiShield, FiClock, FiStar } from 'react-icons/fi';
import api from '../services/api';
import BookCard from '../components/BookCard';
import AnimatedPage from '../components/AnimatedPage';
import './LandingPage.css';

const LandingPage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    api.get('/books?featured=true').then(res => setFeaturedBooks(res.data.slice(0, 4))).catch(() => {});
  }, []);

  const features = [
    { icon: <FiBookOpen />, title: 'Vast Collection', desc: 'Access thousands of books across every genre imaginable' },
    { icon: <FiShield />, title: 'Secure Transactions', desc: 'Your purchases and rentals are protected with JWT encryption' },
    { icon: <FiClock />, title: 'Flexible Rentals', desc: 'Rent books by the day — read at your pace, return anytime' },
    { icon: <FiStar />, title: 'Curated Picks', desc: 'Expert-selected featured books to discover your next read' },
  ];

  return (
    <AnimatedPage>
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <motion.div className="hero-text" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="hero-badge">Welcome to BookVerse</span>
            <h1 className="hero-title">Discover, <span className="gradient-text">Buy</span> & <span className="gradient-text">Rent</span> Your Favorite Books</h1>
            <p className="hero-subtitle">Your premium digital bookstore. Browse our curated collection, purchase forever or rent affordably — all in one beautiful platform.</p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn-primary btn-lg"><FiBookOpen /> Explore Catalog <FiArrowRight /></Link>
              <Link to="/register" className="btn-secondary btn-lg">Create Account</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">12K+</span><span className="stat-label">Books</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><span className="stat-num">5K+</span><span className="stat-label">Readers</span></div>
              <div className="stat-divider"></div>
              <div className="stat"><span className="stat-num">99%</span><span className="stat-label">Happy</span></div>
            </div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <div className="floating-books">
              <motion.div className="float-book fb-1" animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }}>
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop" alt="Book" />
              </motion.div>
              <motion.div className="float-book fb-2" animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }}>
                <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=280&fit=crop" alt="Book" />
              </motion.div>
              <motion.div className="float-book fb-3" animate={{ y: [-8, 12, -8] }} transition={{ duration: 4.5, repeat: Infinity }}>
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop" alt="Book" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why BookVerse?</h2>
            <p className="section-subtitle">Everything you need for your reading journey</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featuredBooks.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Books</h2>
              <p className="section-subtitle">Handpicked selections for you</p>
            </div>
            <div className="books-grid">
              {featuredBooks.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/catalog" className="btn-primary">View All Books <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}
    </AnimatedPage>
  );
};

export default LandingPage;
