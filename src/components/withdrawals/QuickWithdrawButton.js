import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';

const QuickWithdrawButton = ({ balance, onQuickWithdraw, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (!disabled && balance > 0) {
      onQuickWithdraw();
    }
  };
  
  return (
    <motion.button
      className={`relative flex items-center justify-between w-full py-4 px-6 rounded-lg shadow-md ${
        disabled || balance <= 0
          ? 'bg-gray-100 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-500 to-emerald-600 cursor-pointer'
      } transition-all duration-300 overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled || balance <= 0}
    >
      {/* Sparkling animation on hover */}
      {isHovered && !disabled && balance > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%", 
                opacity: 1,
                scale: 0 
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20, -40]
              }}
              transition={{ 
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </motion.div>
      )}
      
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${
          disabled || balance <= 0 ? 'bg-gray-200' : 'bg-white/20'
        }`}>
          <FaMoneyBillWave className={
            disabled || balance <= 0 ? 'text-gray-400' : 'text-white'
          } size={20} />
        </div>
        <div className="text-left">
          <h3 className={`text-lg font-bold ${
            disabled || balance <= 0 ? 'text-gray-500' : 'text-white'
          }`}>
            Withdraw Now
          </h3>
          <p className={`text-sm ${
            disabled || balance <= 0 ? 'text-gray-400' : 'text-white/80'
          }`}>
            {balance > 0 
              ? `Available: $${balance.toFixed(2)}`
              : 'No funds available'}
          </p>
        </div>
      </div>
      
      <motion.div
        animate={{
          x: isHovered && !disabled && balance > 0 ? [0, 5, 0] : 0
        }}
        transition={{
          duration: 0.5,
          repeat: isHovered && !disabled && balance > 0 ? Infinity : 0
        }}
      >
        <FaArrowRight className={
          disabled || balance <= 0 ? 'text-gray-400' : 'text-white'
        } size={20} />
      </motion.div>
    </motion.button>
  );
};

export default QuickWithdrawButton; 