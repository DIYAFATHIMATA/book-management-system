import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiBook, FiLogOut, FiUser, FiGrid, FiShoppingBag } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav className="navbar" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"><FiBook /></div>
          <span className="logo-text">Book<span className="logo-accent">Verse</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/catalog" className="nav-link"><FiShoppingBag /> Catalog</Link>
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary nav-btn">Get Started</Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <Link to="/admin" className="nav-link"><FiGrid /> Dashboard</Link>
              ) : (
                <Link to="/dashboard" className="nav-link"><FiUser /> My Books</Link>
              )}
              <div className="nav-user">
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="nav-name">{user.name}</span>
                <button onClick={handleLogout} className="nav-logout" title="Logout"><FiLogOut /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
