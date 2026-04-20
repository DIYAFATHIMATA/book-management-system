# Payment Gateway Setup - Razorpay Integration

## Overview
The Book Management System now supports secure payment processing through Razorpay, a leading payment gateway for India. Users can purchase or rent books using UPI, Credit/Debit cards, or Net Banking.

## Features
✅ UPI Payment Support (Google Pay, PhonePe, BHIM)  
✅ Credit/Debit Card Support  
✅ Net Banking Support  
✅ Indian Rupees (₹) Currency  
✅ Secure Payment Verification  
✅ Premium Payment Modal UI  
✅ Real-time Payment Status Updates  

## Installation & Setup

### 1. Backend Setup

#### Install Dependencies
The Razorpay SDK is already installed. Backend packages are:
- razorpay: Latest stable version
- mongoose: For database
- express: For API endpoints
- dotenv: For environment variables

#### Configure Razorpay Credentials

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up and verify your business details
   - Complete KYC verification

2. **Get API Keys**
   - Navigate to Dashboard → Settings → API Keys
   - Copy your Key ID and Key Secret
   - Use Test keys during development, Live keys for production

3. **Update Environment Variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Update with your Razorpay credentials:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx (or rzp_live_xxxxx for production)
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```

#### API Endpoints

**Create Payment Order**
```
POST /api/payments/create-order
Headers: Authorization: Bearer <token>
Body: {
  "bookId": "ObjectId",
  "type": "buy" or "rent",
  "quantity": 1,
  "rentalDays": 7  // only for rent
}
Response: {
  "orderId": "order_xxxxx",
  "amount": 29900,
  "currency": "INR",
  "transactionId": "mongoId",
  "publicKey": "rzp_test_xxxxx"
}
```

**Verify Payment**
```
POST /api/payments/verify
Headers: Authorization: Bearer <token>
Body: {
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_hash",
  "transactionId": "mongoId"
}
```

**Get Payment Methods**
```
GET /api/payments/methods
Response: Array of available payment methods
```

**Get Payment History**
```
GET /api/payments/history
Headers: Authorization: Bearer <token>
Response: Array of user transactions with payment details
```

### 2. Frontend Setup

#### Payment Modal Component
The `PaymentModal.jsx` component handles the entire payment flow:
- Shows book summary with INR pricing
- Displays payment method selection (UPI, Card, Net Banking)
- Integrates with Razorpay checkout
- Displays real-time payment status

#### Usage Example
```jsx
import PaymentModal from '../components/PaymentModal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    // Handle success - update UI, redirect, etc.
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Buy Book</button>
      <PaymentModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        book={bookObject}
        transactionType="buy" // or "rent"
        rentalDays={7}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
```

#### Currency Formatting
Use the `formatINR()` utility function throughout the app:
```jsx
import { formatINR } from '../utils/currency';

// Returns: "₹299.99"
console.log(formatINR(299.99));
```

### 3. Database Schema Updates

#### Transaction Model
New fields added:
- `paymentMethod`: UPI | Card | Wallet
- `paymentId`: Unique payment identifier
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID
- `razorpaySignature`: Payment verification signature
- `currency`: Currency code (default: INR)
- `status`: Updated to include 'pending' and 'failed' states

### 4. UI/UX Features

#### Premium Design Elements
- Glass morphism background styling
- Gradient overlays and borders
- Smooth animations with Framer Motion
- Responsive design for all devices

#### Book Card Enhancements
- Animated featured badge (pulse effect)
- Hover animations with scale transforms
- INR currency display with proper formatting
- Enhanced image zoom on hover

#### Payment Modal Features
- Animated entrance/exit transitions
- Real-time payment status indicators
- Method selection with visual feedback
- Success/Error status displays with animations
- Secure payment badge and footer

## Testing

### Test Credentials (Razorpay Dashboard)
Use these test cards in development:

**Visa Card (Success)**
- Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**MasterCard (Success)**
- Number: 5555 5555 5555 4444
- Expiry: Any future date
- CVV: Any 3 digits

**International Card**
- Number: 3714 496353 98431

For UPI, use any test UPI ID format (e.g., test@razorpay)

### Test Flow
1. Browse book catalog
2. Click on any book
3. Click "Buy Now" or "Rent" button
4. PaymentModal opens with order summary
5. Select payment method
6. Complete payment with test credentials
7. Payment status updates in real-time

## Security Considerations

✅ **Signature Verification**: All payments verified server-side  
✅ **PCI Compliance**: Card details handled by Razorpay  
✅ **HTTPS Only**: Use HTTPS in production  
✅ **Secure Key Storage**: Keys stored in environment variables  
✅ **Token Authentication**: Payment endpoints require JWT  
✅ **CORS Protection**: Cross-origin requests validated  

## Troubleshooting

**Issue: "Razorpay script failed to load"**
- Check internet connection
- Verify CORS settings in backend

**Issue: "Payment verification failed"**
- Verify RAZORPAY_KEY_SECRET is correct
- Check signature hash calculation
- Ensure timestamps match

**Issue: "Order creation failed"**
- Verify book exists and has valid pricing
- Check user authentication token
- Ensure prices are positive numbers

## Production Deployment

Before going live:
1. Switch to Live API keys
2. Update Frontend environment to production URL
3. Ensure HTTPS is enabled
4. Set up proper logging and monitoring
5. Test full payment flow with live credentials
6. Configure webhook for payment notifications
7. Set up admin dashboard for transaction reviews

## Additional Resources

- **Razorpay Docs**: https://razorpay.com/docs
- **API Reference**: https://razorpay.com/api
- **Test Credentials**: https://razorpay.com/docs/payments/payment-gateway/test-cards/
- **Security Best Practices**: https://razorpay.com/docs/payments/security/

