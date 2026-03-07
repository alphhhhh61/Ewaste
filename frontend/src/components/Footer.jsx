import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <Leaf className="logo-icon" />
            <span>EcoSync</span>
          </Link>
          <p className="footer-desc">
            Transforming electronic waste management through responsible recycling and rewarding communities for a greener tomorrow.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/centers">Collection Centers</Link></li>
            <li><Link to="/register-device">Register Device</Link></li>
            <li><Link to="/schedule">Schedule Pickup</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li><MapPin size={18} /> <span>123 Eco Valley, Silicon Hub</span></li>
            <li><Phone size={18} /> <span>+1 (800) 123-4567</span></li>
            <li><Mail size={18} /> <span>hello@ecosync.com</span></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} EcoSync E-Waste Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
