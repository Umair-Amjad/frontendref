// Utility functions for formatting values in withdrawal components

/**
 * Format a numeric amount as currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(parseFloat(amount))) {
    return '$0.00';
  }
  return `$${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

/**
 * Get CSS class for a status badge
 * @param {string} status - Status value
 * @returns {string} - CSS class string
 */
export const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 