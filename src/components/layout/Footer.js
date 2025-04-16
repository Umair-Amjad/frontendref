import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaTelegram, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Referral Platform</h3>
            <p className="text-gray-400 text-sm">
              A platform for cryptocurrency investments with referral benefits. Invest smartly and earn through referrals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/invest" className="hover:text-white">
                  Investment Plans
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/risk-disclosure" className="hover:text-white">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link to="/aml-policy" className="hover:text-white">
                  AML Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-lg">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-lg">
                <FaTwitter />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-lg">
                <FaTelegram />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-lg">
                <FaInstagram />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              <FaEnvelope className="inline mr-2" />
              support@refplatform.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
          <p>© {currentYear} Referral Platform. All rights reserved.</p>
          <p className="mt-1">Disclaimer: Cryptocurrency investments involve risk. Please invest responsibly.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 