import React from 'react';
import { Facebook, Github, Linkedin, Twitter } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: 'https://linkedin.com/in/yourprofile',
    },
    {
      name: 'GitHub',
      icon: <Github size={20} />,
      url: 'https://github.com/yourprofile',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: 'https://twitter.com/yourprofile',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: 'https://facebook.com/yourprofile',
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">💼</span> MicroTask
            </h3>
            <p className="footer-description">
              Earn money by completing micro-tasks or hire workers to get your
              tasks done.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Social Media</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} MicroTask Platform. All rights reserved. Built
            with ❤️ by Your Name
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
