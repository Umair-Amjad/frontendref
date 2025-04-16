import React, { useState } from 'react';
import { FaLink, FaCopy, FaTwitter, FaFacebook, FaEnvelope, FaWhatsapp, FaCheck } from 'react-icons/fa';

const ReferralLink = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  
  if (!referralCode) return null;

  const referralUrl = `${window.location.origin}/register?ref=${referralCode}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareViaTwitter = () => {
    const text = `Join me on Referral Platform and start earning passive income! Use my referral code: ${referralCode}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank');
  };
  
  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank');
  };
  
  const shareViaEmail = () => {
    const subject = 'Join me on Referral Platform';
    const body = `Hello,\n\nI thought you might be interested in this investment platform. You can earn passive income and get bonuses through referrals.\n\nUse my referral code: ${referralCode}\n\nRegister here: ${referralUrl}\n\nCheers!`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };
  
  const shareViaWhatsapp = () => {
    const text = `Join me on Referral Platform and start earning passive income! Use my referral code: ${referralCode}. Register here: ${referralUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FaLink className="text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Your Referral Link</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Share this link with your friends and earn 5% commission on their investments!
      </p>
      
      <div className="relative">
        <input
          type="text"
          value={referralUrl}
          readOnly
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
        >
          {copied ? (
            <>
              <FaCheck className="mr-1" />
              Copied
            </>
          ) : (
            <>
              <FaCopy className="mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Share via:</p>
        <div className="flex space-x-3">
          <button
            onClick={shareViaTwitter}
            className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
            aria-label="Share on Twitter"
          >
            <FaTwitter />
          </button>
          <button
            onClick={shareViaFacebook}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            aria-label="Share on Facebook"
          >
            <FaFacebook />
          </button>
          <button
            onClick={shareViaEmail}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            aria-label="Share via Email"
          >
            <FaEnvelope />
          </button>
          <button
            onClick={shareViaWhatsapp}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            aria-label="Share via WhatsApp"
          >
            <FaWhatsapp />
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Your referral code: <span className="font-semibold">{referralCode}</span>
        </p>
      </div>
    </div>
  );
};

export default ReferralLink; 