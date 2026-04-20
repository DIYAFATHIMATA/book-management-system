import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import BookCard from '../components/BookCard';
import AnimatedPage from '../components/AnimatedPage';
import './CatalogPage.css';

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/books/genres/list').then(res => setGenres(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    if (sort) params.append('sort', sort);
    api.get(`/books?${params.toString()}`)
      .then(res => setBooks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, genre, sort]);

  return (
    <AnimatedPage>
      <div className="catalog-page">
        <div className="container">
          <motion.div className="catalog-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title">Book Catalog</h1>
            <p className="section-subtitle">Browse, search, and discover your next great read</p>
          </motion.div>
          <div className="catalog-filters glass-card">
            <div className="filter-search">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-group">
              <FiFilter className="filter-icon" />
              <select value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="">All Genres</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p className="results-count">{books.length} book{books.length !== 1 ? 's' : ''} found</p>
              <div className="books-grid">
                {books.map((book, i) => <BookCard key={book._id} book={book} index={i} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CatalogPage;
