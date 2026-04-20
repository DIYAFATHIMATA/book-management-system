import { FiBook, FiGithub, FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <FiBook /> Book<span>Verse</span>
          </div>
          <p className="footer-desc">Your premium destination for buying and renting books. Discover worlds through words.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/catalog">Browse Catalog</a>
          <a href="/login">Sign In</a>
          <a href="/register">Create Account</a>
        </div>
        <div className="footer-links">
          <h4>Genres</h4>
          <a href="/catalog?genre=Fiction">Fiction</a>
          <a href="/catalog?genre=Science+Fiction">Science Fiction</a>
          <a href="/catalog?genre=Fantasy">Fantasy</a>
        </div>
        <div className="footer-links">
          <h4>Connect</h4>
          <a href="#"><FiMail /> contact@bookverse.com</a>
          <a href="#"><FiGithub /> GitHub</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Made with <FiHeart className="heart-icon" /> using MERN Stack &copy; {new Date().getFullYear()} BookVerse</p>
      </div>
    </footer>
  );
};

export default Footer;
