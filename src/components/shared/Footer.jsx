import React from 'react';
import { FaGithub, FaEnvelope, FaPhone, FaMapMarker } from 'react-icons/fa';
import '../../styles/footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">💼</span> MicroTask
            </h3>
            <p className="footer-description">
              Earn money by completing micro-tasks or hire workers to get your
              tasks done.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <FaEnvelope size={18} />
                <span>contact@microtask.com</span>
              </div>
              <div className="contact-item">
                <FaPhone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FaMapMarker size={18} />
                <span>123 Tech Street, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link >
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-links">
              <Link
                to="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <FaGithub size={24} />
              </Link>
              <Link
                to="mailto:contact@microtask.com"
                className="social-link"
                title="Email"
              >
                <FaEnvelope size={24} />
              </Link>
              <Link
                to="tel:+15551234567"
                className="social-link"
                title="Call Us"
              >
                <FaPhone size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} MicroTask Platform. All rights reserved. Built
            with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
