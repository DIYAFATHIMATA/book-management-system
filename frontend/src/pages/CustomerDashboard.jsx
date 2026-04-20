import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiClock, FiCheckCircle, FiRotateCcw, FiBook } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/my');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.post(`/transactions/return/${id}`);
      setToast({ msg: 'Book returned successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      fetchTransactions();
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Return failed', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = filter === 'all' ? transactions : transactions.filter(t => {
    if (filter === 'purchases') return t.type === 'buy';
    if (filter === 'active') return t.type === 'rent' && t.status === 'active';
    if (filter === 'returned') return t.status === 'returned';
    return true;
  });

  const stats = {
    totalPurchases: transactions.filter(t => t.type === 'buy').length,
    activeRentals: transactions.filter(t => t.type === 'rent' && t.status === 'active').length,
    returned: transactions.filter(t => t.status === 'returned').length,
    totalSpent: transactions.reduce((sum, t) => sum + t.totalAmount, 0),
  };

  const getDaysRemaining = (endDate) => {
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <AnimatedPage>
      <div className="dashboard-page">
        <div className="container">
          <div className="dash-header">
            <div>
              <h1 className="section-title">My Dashboard</h1>
              <p className="section-subtitle">Welcome back, {user?.name}!</p>
            </div>
          </div>

          <div className="stats-grid">
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <div className="stat-icon si-blue"><FiShoppingBag /></div>
              <div className="stat-info"><span className="stat-value">{stats.totalPurchases}</span><span className="stat-label">Purchases</span></div>
            </motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="stat-icon si-gold"><FiClock /></div>
              <div className="stat-info"><span className="stat-value">{stats.activeRentals}</span><span className="stat-label">Active Rentals</span></div>
            </motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="stat-icon si-green"><FiCheckCircle /></div>
              <div className="stat-info"><span className="stat-value">{stats.returned}</span><span className="stat-label">Returned</span></div>
            </motion.div>
            <motion.div className="stat-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="stat-icon si-purple"><FiBook /></div>
              <div className="stat-info"><span className="stat-value">${stats.totalSpent.toFixed(2)}</span><span className="stat-label">Total Spent</span></div>
            </motion.div>
          </div>

          <div className="dash-filters">
            {['all', 'purchases', 'active', 'returned'].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'purchases' ? 'Purchases' : f === 'active' ? 'Active Rentals' : 'Returned'}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><h3>No transactions yet</h3><p>Start exploring our catalog to buy or rent books!</p></div>
          ) : (
            <div className="transactions-list">
              {filtered.map((t, i) => (
                <motion.div key={t._id} className="transaction-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="txn-cover">
                    <img src={t.book?.coverImage || 'https://via.placeholder.com/80x110'} alt={t.book?.title} />
                  </div>
                  <div className="txn-info">
                    <h3 className="txn-title">{t.book?.title || 'Unknown Book'}</h3>
                    <p className="txn-author">{t.book?.author}</p>
                    <div className="txn-badges">
                      <span className={`badge badge-${t.type}`}>{t.type}</span>
                      <span className={`badge badge-${t.status}`}>{t.status}</span>
                    </div>
                  </div>
                  <div className="txn-details">
                    {t.type === 'rent' && t.status === 'active' && (
                      <div className="rental-countdown">
                        <span className={`days-left ${getDaysRemaining(t.rentEndDate) < 3 ? 'urgent' : ''}`}>
                          {getDaysRemaining(t.rentEndDate) > 0 ? `${getDaysRemaining(t.rentEndDate)} days left` : 'Overdue!'}
                        </span>
                      </div>
                    )}
                    <span className="txn-amount">${t.totalAmount?.toFixed(2)}</span>
                    <span className="txn-date">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="txn-actions">
                    {t.type === 'rent' && t.status === 'active' && (
                      <button className="btn-secondary" onClick={() => handleReturn(t._id)}><FiRotateCcw /> Return</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </AnimatedPage>
  );
};

export default CustomerDashboard;
