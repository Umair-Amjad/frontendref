import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaInfoCircle, FaClock, FaMobileAlt, FaWallet } from 'react-icons/fa';

const BankTransferNotice = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-6 shadow-sm cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <FaUniversity className="text-yellow-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-yellow-800">Withdrawal Processing Times</h3>
            <p className="text-sm text-yellow-700">Click for detailed information</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaInfoCircle className="text-yellow-600" size={18} />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-yellow-200"
          >
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaMobileAlt className="text-green-500" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">JazzCash & EasyPaisa</h4>
                  <p className="text-sm text-yellow-700">Processing time: 3-5 hours on business days (9am-5pm)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaUniversity className="text-blue-500" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">Local Bank Transfers</h4>
                  <p className="text-sm text-yellow-700">Processing time: 1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaWallet className="text-purple-500" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">USDT Transfers</h4>
                  <p className="text-sm text-yellow-700">Processing time: 1-3 hours, typically faster</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaClock className="text-red-500" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700">All withdrawal times are estimates and may be affected by network congestion, bank processing times, or holidays.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BankTransferNotice; 