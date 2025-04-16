import React, { useState, useEffect } from 'react';
import { FaClock, FaUniversity, FaLightbulb, FaSpinner, FaInfoCircle, FaCoins, FaUser } from 'react-icons/fa';

// Single notice card component
export const NoticeCard = ({ icon, title, children, type = 'info', animated = false }) => {
  // Define styles based on type
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-700',
      icon: 'text-blue-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleColor: 'text-green-700',
      icon: 'text-green-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titleColor: 'text-yellow-700',
      icon: 'text-yellow-500'
    },
    update: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      titleColor: 'text-indigo-700',
      icon: 'text-indigo-500'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4 shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start">
        <div className={`p-2 ${animated ? 'animate-pulse' : ''}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${style.titleColor}`}>{title}</h3>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Earnings update notice
export const EarningsUpdateNotice = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaCoins className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            🎉 Great news! Your earnings balance has been updated. Your patience has rewarded you with fresh profits ready to withdraw!
          </p>
        </div>
      </div>
    </div>
  );
};

// Bank withdrawal notice
export const BankWithdrawalNotice = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaUniversity className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            💼 Local bank withdrawals are processed within 24 hours (business days). International transfers typically take 3-5 business days. Thank you for your patience as we securely process your funds.
          </p>
        </div>
      </div>
    </div>
  );
};

// User experience notice
export const UserExperienceNotice = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaUser className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            ✨ Your success is our priority! We're continuously enhancing this platform based on your valuable feedback. Together, we're building something exceptional.
          </p>
        </div>
      </div>
    </div>
  );
};

// Timer-based earnings update notice
export const TimerEarningsNotice = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Hide the notice after the timer completes
      setIsVisible(false);
    }
  }, [timeLeft]);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaClock className="h-5 w-5 text-blue-500 animate-pulse" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            ⏰ Your earnings balance will be updated in <span className="font-bold text-blue-800">{timeLeft} seconds</span>. Please wait as we process your investment returns.
          </p>
        </div>
      </div>
    </div>
  );
};

// Local bank withdrawal notice with improved messaging
export const EnhancedBankWithdrawalNotice = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaUniversity className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            🏦 For JazzCash, EasyPaisa & Bank withdrawals: Processing takes 3-5 hours on business days (9am-5pm). Please ensure your provided information is correct to avoid delays.
          </p>
        </div>
      </div>
    </div>
  );
};

// Customer-focused experience notice
export const CustomerExperienceNotice = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaLightbulb className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            💡 Your feedback shapes our platform! We're committed to creating the best investment experience with reliable earnings and flexible options tailored to you.
          </p>
        </div>
      </div>
    </div>
  );
};

// Collection of all notices
export const AllNotices = () => {
  return (
    <div className="space-y-4">
      <EarningsUpdateNotice />
      <BankWithdrawalNotice />
      <UserExperienceNotice />
    </div>
  )
};

// Export the three new notices together
export const NewNotices = () => {
  return (
    <div className="space-y-4">
      <TimerEarningsNotice />
      <EnhancedBankWithdrawalNotice />
      <CustomerExperienceNotice />
    </div>
  );
};

export default AllNotices; 