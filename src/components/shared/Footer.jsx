import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Tasks', path: '/tasks' },
  ];

  const accountLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const supportLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
  ];

  const socials = [
    { icon: FaGithub, href: "https://github.com/meherunnesaenta/Micro-task-platform", label: "GitHub" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/meherunnesa-enta", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-base-100 border-t border-base-200 overflow-hidden mt-auto">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container-modern relative z-10 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-base-content/60 text-sm leading-relaxed">
              Earn money by completing micro-tasks or hire workers to get your tasks done.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-colors group">
                <FaEnvelope size={14} className="group-hover:scale-110 transition-transform" />
                <span>support@taskearn.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/60 hover:text-primary transition-colors group">
                <FaMapMarker size={14} className="group-hover:scale-110 transition-transform" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-base-content font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="lg:col-span-2">
            <h4 className="text-base-content font-semibold text-base mb-4">Account</h4>
            <ul className="space-y-2">
              {accountLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-base-content font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="lg:col-span-2">
            <h4 className="text-base-content font-semibold text-base mb-4">Legal</h4>
            <ul className="space-y-2 mb-4">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-base-content/50 hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  to={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-base-content/50 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
                  title={social.label}
                >
                  <social.icon size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-base-200 text-center">
          <p className="text-xs text-base-content/40">
            © {currentYear} TaskEarn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;