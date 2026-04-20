import api from './api';

// Create payment order
export const createPaymentOrder = async (bookId, type, quantity = 1, rentalDays = 0) => {
  const response = await api.post('/payments/create-order', {
    bookId,
    type,
    quantity,
    rentalDays,
  });
  return response.data;
};

// Verify payment signature
export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId, paymentMethod = 'card') => {
  const response = await api.post('/payments/verify', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    transactionId,
    paymentMethod,
  });
  return response.data;
};

// Get available payment methods
export const getPaymentMethods = async () => {
  const response = await api.get('/payments/methods');
  return response.data;
};

// Get user's payment history
export const getPaymentHistory = async () => {
  const response = await api.get('/payments/history');
  return response.data;
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Handle Razorpay payment
export const handleRazorpayPayment = async (orderData, onSuccess, onError) => {
  try {
    // Check if in test mode (using test/placeholder keys)
    const isTestMode = orderData.testMode === true || 
                       orderData.publicKey?.includes('test') || 
                       orderData.publicKey?.includes('1Aa00000000001');

    if (isTestMode) {
      // Development/Test mode: simulate payment without Razorpay SDK
      console.log('Test mode: Simulating payment...');
      
      // Create fake test payment response
      const testPaymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const testSignature = 'test_signature_' + Date.now();
      
      try {
        const verificationResult = await verifyPayment(
          orderData.orderId,
          testPaymentId,
          testSignature,
          orderData.transactionId
        );
        onSuccess(verificationResult);
      } catch (error) {
        onError(error);
      }
      return;
    }

    // Production mode: use actual Razorpay
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    const options = {
      key: orderData.publicKey,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          const verificationResult = await verifyPayment(
            orderData.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature,
            orderData.transactionId
          );
          onSuccess(verificationResult);
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: orderData.userName || '',
        email: orderData.userEmail || '',
        contact: orderData.userPhone || '',
      },
      theme: {
        color: '#3498db',
      },
      modal: {
        ondismiss: () => {
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    onError(error);
  }
};
