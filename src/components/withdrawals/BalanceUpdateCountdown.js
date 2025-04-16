import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCoins } from 'react-icons/fa';

const BalanceUpdateCountdown = ({ nextUpdateTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = nextUpdateTime - new Date().getTime();
      
      if (difference <= 0) {
        return {
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Update timer initially
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update timer every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      // Clear interval if we've reached 0
      if (updatedTimeLeft.hours === 0 && updatedTimeLeft.minutes === 0 && updatedTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextUpdateTime]);

  // Calculate progress percentage (assuming 3 hours total time)
  const totalSeconds = 3 * 60 * 60; // 3 hours in seconds
  const elapsedSeconds = totalSeconds - ((timeLeft.hours * 60 * 60) + (timeLeft.minutes * 60) + timeLeft.seconds);
  const progressPercentage = Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center mb-3">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mr-2 text-blue-500"
        >
          <FaClock size={20} />
        </motion.div>
        <h3 className="text-lg font-medium text-blue-700">Next Balance Update</h3>
      </div>
      
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-800">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-blue-600">Hours</div>
        </div>
        <div className="text-2xl font-bold text-blue-800">:</div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-800">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-blue-600">Minutes</div>
        </div>
        <div className="text-2xl font-bold text-blue-800">:</div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-800">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-blue-600">Seconds</div>
        </div>
      </div>
      
      <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="mt-3 text-sm text-blue-700 flex items-center justify-center">
        <FaCoins className="mr-2" />
        <span>Your balance will be updated automatically with your new earnings</span>
      </div>
    </div>
  );
};

export default BalanceUpdateCountdown; 