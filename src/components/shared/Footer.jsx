import React from 'react';
import { FaGithub, FaEnvelope, FaPhone, FaMapMarker, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-card border-t border-base-200/50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-modern relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-base-content/60 text-sm leading-relaxed">
              Earn money by completing micro-tasks or hire workers to get your tasks done quickly and efficiently.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-colors duration-300 group">
                <FaEnvelope size={16} className="group-hover:scale-110 transition-transform" />
                <span>contact@microtask.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-colors duration-300 group">
                <FaPhone size={16} className="group-hover:scale-110 transition-transform" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-colors duration-300 group">
                <FaMapMarker size={16} className="group-hover:scale-110 transition-transform" />
                <span>123 Tech Street, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-base-content mb-4 relative inline-block">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full"></div>
            </h4>
            <ul className="space-y-2">
              {['Home', 'Register', 'Login', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-base-content/60 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-base-content mb-4 relative inline-block">
              Resources
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full"></div>
            </h4>
            <ul className="space-y-2">
              {['How It Works', 'Privacy Policy', 'Terms of Service', 'FAQ', 'Support'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-base-content/60 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-base-content mb-4 relative inline-block">
              Follow Us
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-primary rounded-full"></div>
            </h4>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: FaGithub, href: "https://github.com", label: "GitHub", color: "hover:bg-gray-800" },
                { icon: FaFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:bg-blue-600" },
                { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:bg-sky-500" },
                { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-blue-700" },
                { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-600" },
              ].map((social) => (
                <Link
                  key={social.label}
                  to={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} hover:text-white`}
                  title={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-4">
              <p className="text-sm text-base-content/60 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="input-modern flex-1 text-sm px-3 py-2 rounded-field bg-base-200 border-base-300 focus:border-primary"
                />
                <button className="btn-gradient px-4 py-2 rounded-field text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-base-200 text-center">
          <p className="text-sm text-base-content/50">
            &copy; {currentYear} MicroTask Platform. All rights reserved. Built with{' '}
            <span className="text-red-500 inline-block animate-pulse">❤️</span> for the global community
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-base-content/40">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;