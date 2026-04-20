// Format price to Indian Rupees
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers with commas
export const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

// Convert USD to INR (approximate, you can use live rates API)
export const convertUSDtoINR = (usd, rate = 83) => {
  return usd * rate;
};

// Get currency symbol
export const getCurrencySymbol = (currency = 'INR') => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || '₹';
};
