import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiUsers, FiDollarSign, FiPackage, FiX, FiSave } from 'react-icons/fi';
import api from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import './AdminDashboard.css';

const emptyBook = { title: '', author: '', description: '', genre: '', isbn: '', coverImage: '', buyPrice: '', rentPricePerDay: '', stockForSale: '', stockForRent: '', rating: 4, pages: '', publishedYear: '', featured: false };

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(emptyBook);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState('books');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [booksRes, txnRes] = await Promise.all([api.get('/books'), api.get('/transactions/all')]);
      setBooks(booksRes.data);
      setTransactions(txnRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const show = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const openAdd = () => { setEditBook(null); setForm(emptyBook); setShowModal(true); };
  const openEdit = (book) => { setEditBook(book); setForm({ ...book, buyPrice: book.buyPrice, rentPricePerDay: book.rentPricePerDay, stockForSale: book.stockForSale, stockForRent: book.stockForRent, pages: book.pages || '', publishedYear: book.publishedYear || '' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        await api.put(`/books/${editBook._id}`, form);
        show('Book updated successfully!');
      } else {
        await api.post('/books', form);
        show('Book added successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { show(err.response?.data?.message || 'Operation failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      show('Book deleted');
      fetchData();
    } catch (err) { show('Delete failed', 'error'); }
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const stats = {
    totalBooks: books.length,
    totalStock: books.reduce((s, b) => s + b.stockForSale + b.stockForRent, 0),
    totalTxns: transactions.length,
    revenue: transactions.reduce((s, t) => s + t.totalAmount, 0),
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <AnimatedPage>
      <div className="admin-page">
        <div className="container">
          <div className="dash-header">
            <div><h1 className="section-title">Admin Dashboard</h1><p className="section-subtitle">Manage your bookstore inventory</p></div>
            <button className="btn-primary" onClick={openAdd}><FiPlus /> Add Book</button>
          </div>

          <div className="stats-grid">
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><div className="stat-icon si-blue"><FiBook /></div><div className="stat-info"><span className="stat-value">{stats.totalBooks}</span><span className="stat-label">Books</span></div></motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><div className="stat-icon si-green"><FiPackage /></div><div className="stat-info"><span className="stat-value">{stats.totalStock}</span><span className="stat-label">Total Stock</span></div></motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><div className="stat-icon si-gold"><FiUsers /></div><div className="stat-info"><span className="stat-value">{stats.totalTxns}</span><span className="stat-label">Transactions</span></div></motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><div className="stat-icon si-purple"><FiDollarSign /></div><div className="stat-info"><span className="stat-value">${stats.revenue.toFixed(2)}</span><span className="stat-label">Revenue</span></div></motion.div>
          </div>

          <div className="dash-filters">
            <button className={`filter-tab ${tab === 'books' ? 'active' : ''}`} onClick={() => setTab('books')}>Book Inventory</button>
            <button className={`filter-tab ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>All Transactions</button>
          </div>

          {tab === 'books' ? (
            <div className="admin-table-wrap glass-card">
              <table className="admin-table">
                <thead>
                  <tr><th>Book</th><th>Genre</th><th>Buy Price</th><th>Rent/Day</th><th>Sale Stock</th><th>Rent Stock</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id}>
                      <td><div className="table-book"><img src={book.coverImage} alt="" className="table-cover" /><div><strong>{book.title}</strong><br /><small>{book.author}</small></div></div></td>
                      <td><span className="badge badge-buy">{book.genre}</span></td>
                      <td>${book.buyPrice?.toFixed(2)}</td>
                      <td>${book.rentPricePerDay?.toFixed(2)}</td>
                      <td><span className={book.stockForSale < 5 ? 'low-stock' : ''}>{book.stockForSale}</span></td>
                      <td><span className={book.stockForRent < 3 ? 'low-stock' : ''}>{book.stockForRent}</span></td>
                      <td><div className="table-actions"><button className="action-btn edit" onClick={() => openEdit(book)}><FiEdit2 /></button><button className="action-btn delete" onClick={() => handleDelete(book._id)}><FiTrash2 /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((t, i) => (
                <motion.div key={t._id} className="transaction-card glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="txn-cover"><img src={t.book?.coverImage || 'https://via.placeholder.com/60x80'} alt="" /></div>
                  <div className="txn-info"><h3 className="txn-title">{t.book?.title || 'Unknown'}</h3><p className="txn-author">{t.user?.name} ({t.user?.email})</p><div className="txn-badges"><span className={`badge badge-${t.type}`}>{t.type}</span><span className={`badge badge-${t.status}`}>{t.status}</span></div></div>
                  <div className="txn-details"><span className="txn-amount">${t.totalAmount?.toFixed(2)}</span><span className="txn-date">{new Date(t.createdAt).toLocaleDateString()}</span></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editBook ? 'Edit Book' : 'Add New Book'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="input-group"><label>Title</label><input value={form.title} onChange={e => updateField('title', e.target.value)} required /></div>
                  <div className="input-group"><label>Author</label><input value={form.author} onChange={e => updateField('author', e.target.value)} required /></div>
                  <div className="input-group"><label>Genre</label><input value={form.genre} onChange={e => updateField('genre', e.target.value)} required /></div>
                  <div className="input-group"><label>ISBN</label><input value={form.isbn} onChange={e => updateField('isbn', e.target.value)} required /></div>
                  <div className="input-group"><label>Buy Price ($)</label><input type="number" step="0.01" value={form.buyPrice} onChange={e => updateField('buyPrice', parseFloat(e.target.value))} required /></div>
                  <div className="input-group"><label>Rent Price/Day ($)</label><input type="number" step="0.01" value={form.rentPricePerDay} onChange={e => updateField('rentPricePerDay', parseFloat(e.target.value))} required /></div>
                  <div className="input-group"><label>Stock for Sale</label><input type="number" value={form.stockForSale} onChange={e => updateField('stockForSale', parseInt(e.target.value))} /></div>
                  <div className="input-group"><label>Stock for Rent</label><input type="number" value={form.stockForRent} onChange={e => updateField('stockForRent', parseInt(e.target.value))} /></div>
                  <div className="input-group"><label>Pages</label><input type="number" value={form.pages} onChange={e => updateField('pages', parseInt(e.target.value))} /></div>
                  <div className="input-group"><label>Published Year</label><input type="number" value={form.publishedYear} onChange={e => updateField('publishedYear', parseInt(e.target.value))} /></div>
                </div>
                <div className="input-group"><label>Cover Image URL</label><input value={form.coverImage} onChange={e => updateField('coverImage', e.target.value)} placeholder="https://..." /></div>
                <div className="input-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => updateField('description', e.target.value)} /></div>
                <label className="checkbox-label"><input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} /> Featured Book</label>
                <button type="submit" className="btn-primary auth-btn"><FiSave /> {editBook ? 'Update Book' : 'Add Book'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </AnimatedPage>
  );
};

export default AdminDashboard;
