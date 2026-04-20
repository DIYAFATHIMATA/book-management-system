# Book Management System - Setup & Usage Guide

## System Overview
A complete full-stack MERN (MongoDB, Express, React, Node.js) application for managing a digital book store with payment integration via Razorpay.

**Features:**
- Role-based access control (Admin & Customer)
- JWT authentication with secure password handling
- Razorpay payment gateway with UPI/Card/Net Banking
- 12 pre-seeded books with Indian Rupee (₹) pricing
- Admin dashboard for inventory management
- Premium UI with glass morphism design and Framer Motion animations
- Customer registration and book browsing
- Payment history tracking

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+ (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables** (`.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookmanagement
   JWT_SECRET=bookmanagement_secret_key_2026_mern_stack
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

3. **Seed database:**
   ```bash
   npm run seed
   ```
   This creates:
   - 1 Admin account: `diyafathima@admin.com` / `admin123456`
   - 12 books with ISBNs, pricing, and rental data

4. **Start server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5176`

---

## Default Accounts

### Admin Account
- **Email:** diyafathima@admin.com
- **Password:** admin123456
- **Access:** Full CRUD on books, inventory dashboard, statistics

### Test Customer Account
- **Email:** sakshi@customer.com
- **Password:** customer123456
- **Access:** Browse books, initiate purchases/rentals, view payment history

**Note:** Customers can self-register via the registration page. Admin signup is disabled.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/profile` - Get user profile (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Add book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Payments
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/create-order` - Create payment order (protected)
- `POST /api/payments/verify` - Verify payment signature (protected)
- `GET /api/payments/history` - Get payment history (protected)

### Transactions
- `GET /api/transactions` - Get user transactions (protected)
- `GET /api/transactions/all` - Get all transactions (admin only)

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('admin' or 'customer'),
  createdAt: Date
}
```

### Book Model
```javascript
{
  title: String,
  author: String,
  description: String,
  genre: String,
  isbn: String,
  coverImage: String,
  buyPrice: Number (INR),
  rentPricePerDay: Number (INR),
  stockForSale: Number,
  stockForRent: Number,
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId,
  bookId: ObjectId,
  type: String ('buy' or 'rent'),
  amount: Number (INR),
  paymentMethod: String,
  paymentId: String,
  razorpayOrderId: String,
  status: String ('pending', 'completed', 'failed'),
  createdAt: Date
}
```

---

## Payment Gateway Setup (Razorpay)

1. **Sign up** at https://dashboard.razorpay.com
2. **Get API keys** from dashboard settings
3. **Update `.env`** with:
   - `RAZORPAY_KEY_ID` (public key)
   - `RAZORPAY_KEY_SECRET` (secret key)

4. **Payment Methods Supported:**
   - UPI (All UPI apps)
   - Credit/Debit Cards (Visa, Mastercard, etc.)
   - Net Banking (All Indian banks)

---

## Frontend Routes

- `/` - Landing page
- `/catalog` - Book catalog (public)
- `/book/:id` - Book details page
- `/login` - Login page
- `/register` - Customer registration
- `/admin` - Admin dashboard (admin only)
- `/customer` - Customer dashboard (customer only)

---

## Key Features

### Glass Morphism Design
- Semi-transparent cards with backdrop blur
- Gradient backgrounds (blue to purple)
- Smooth hover animations
- Responsive layout for all devices

### Animations (Framer Motion)
- Page transitions with fade/slide effects
- Book card hover animations
- Payment modal entrance/exit animations
- Loading states with spinners

### Currency Formatting
All prices display as Indian Rupees (₹) using:
```javascript
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
}).format(amount)
```

### Authentication
- JWT tokens stored in localStorage
- Protected routes check authentication
- Role-based access control on admin features
- Automatic logout on token expiration

---

## Troubleshooting

### Backend Won't Start
- Check MongoDB is running: `mongod`
- Verify `.env` file exists and has correct MongoDB URI
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS is enabled (already configured in server.js)
- Clear browser cache and localStorage

### Payment Orders Fail
- This is expected with placeholder Razorpay keys
- Set real keys in `.env` for testing
- For development, payment modal shows order details without actual charge

### Login Issues
- Clear localStorage: `localStorage.clear()` in browser console
- Re-login with correct credentials
- Check user role (admin vs customer)

---

## Production Deployment

### Backend (Node.js)
```bash
npm install
npm run build  # if applicable
NODE_ENV=production npm start
```

### Frontend (React)
```bash
npm run build
# Deploy 'dist' folder to static hosting (Vercel, Netlify, etc.)
```

### Environment Variables for Production
- Use strong `JWT_SECRET`
- Store Razorpay keys securely in secrets manager
- Use production MongoDB Atlas cluster
- Set `NODE_ENV=production`

---

## Security Notes

1. **Never commit `.env`** - Add to `.gitignore`
2. **Hash passwords** - bcrypt handles this automatically
3. **Validate input** - Backend validates all requests
4. **HTTPS only** - Use SSL/TLS in production
5. **JWT expiration** - Tokens expire after 7 days
6. **CORS configured** - Only accepts requests from frontend origin

---

## Support & Maintenance

- **Logs:** Check backend console for errors
- **Database:** Use MongoDB Compass for debugging
- **Frontend errors:** Open browser DevTools (F12)
- **Payment issues:** Check Razorpay dashboard for test transactions

---

## Version Info

- **Node.js:** 18+
- **React:** 19
- **Express:** 4
- **MongoDB:** 5+
- **Razorpay SDK:** Latest

---

Generated: 2025
Last Updated: System verification complete - all features working
