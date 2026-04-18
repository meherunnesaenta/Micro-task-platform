import React from 'react';
import { FaGithub, FaEnvelope, FaPhone, FaMapMarker, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  const resources = [
    { name: 'Help Center', path: '/help' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'FAQ', path: '/faq' },
  ];

  const socials = [
    { icon: FaGithub, href: "https://github.com", label: "GitHub", color: "hover:bg-[#333]" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:bg-[#1DA1F2]" },
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:bg-[#1877F2]" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-[#E4405F]" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube", color: "hover:bg-[#FF0000]" },
    { icon: FaDiscord, href: "https://discord.com", label: "Discord", color: "hover:bg-[#5865F2]" },
  ];

  return (
    <footer className="relative bg-base-100 border-t border-base-200/50 overflow-hidden mt-auto">
      {/* Premium Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container-modern relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Company Info - 4 columns */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-base-content/60 text-sm leading-relaxed">
              Transform your spare time into real income. Join thousands of workers earning money by completing simple micro-tasks, or post tasks and get quality work done by verified professionals.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-all duration-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaEnvelope size={14} className="text-primary" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">contact@microtask.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-all duration-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaPhone size={14} className="text-primary" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-all duration-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaMapMarker size={14} className="text-primary" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform">123 Tech Street, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links - 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-base-content font-bold text-base-content mb-5 relative inline-block">
              Quick Links
              <div className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-primary rounded-full"></div>
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary transition-all duration-300 rounded-full"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - 2 columns */}
          <div className="lg:col-span-2">
            <h4 className=" font-bold text-base-content mb-5 relative inline-block">
              Resources
              <div className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-primary rounded-full"></div>
            </h4>
            <ul className="space-y-2.5">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-1.5 h-0.5 bg-primary transition-all duration-300 rounded-full"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter - 4 columns */}
          <div className="lg:col-span-4">
            <h4 className=" font-bold text-base-content mb-5 relative inline-block">
              Connect With Us
              <div className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-primary rounded-full"></div>
            </h4>
            
            {/* Social Icons Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  to={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50 transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} hover:text-white group`}
                  title={social.label}
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="mt-6">
              <p className="text-sm font-medium text-base-content/70 mb-3 flex items-center gap-2">
                <FiSend size={14} className="text-primary" />
                Subscribe to our newsletter
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-all duration-300 text-sm"
                />
                <button className="btn-primary-custom px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-base-content/40 mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Premium */}
        <div className="mt-10 pt-6 border-t border-base-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-base-content/40">
              &copy; {currentYear} MicroTask Platform. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-base-content/40">Built with</span>
              <span className="text-red-500 inline-block animate-pulse">❤️</span>
              <span className="text-xs text-base-content/40">for the global community</span>
            </div>
            
            <div className="flex gap-4 text-xs text-base-content/40">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300">Privacy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-300">Terms</Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-primary transition-colors duration-300">Cookies</Link>
              <span>•</span>
              <Link to="/accessibility" className="hover:text-primary transition-colors duration-300">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;