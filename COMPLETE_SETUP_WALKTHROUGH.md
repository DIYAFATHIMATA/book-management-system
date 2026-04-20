# 🎯 Complete Setup Walkthrough for New Users

This file guides you through the ENTIRE setup process from zero to running system.

## Time Required: 15 minutes

---

## STEP 1: Prerequisites (2 minutes)

Before you start, ensure you have:

- [ ] **Node.js 18+** - Download from https://nodejs.org/
- [ ] **MongoDB** - Either:
  - Local: `brew install mongodb-community` (Mac) or download installer (Windows)
  - Cloud: Create free cluster at https://www.mongodb.com/atlas
- [ ] **Git** (optional but recommended)
- [ ] **A text editor** (VS Code recommended)

**Verification:**
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

---

## STEP 2: Clone/Extract Project (1 minute)

### Option A: Using Git
```bash
git clone <repository-url>
cd book-management
```

### Option B: Manual Download
1. Download ZIP file
2. Extract to your desired location
3. Open terminal in the extracted folder

---

## STEP 3: Backend Setup (5 minutes)

### 3.1 Navigate to Backend
```bash
cd backend
```

### 3.2 Install Dependencies
```bash
npm install
```
*This downloads all required packages. Takes 2-3 minutes.*

### 3.3 Create `.env` File

Create a file named `.env` in the `backend` folder and add:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmanagement
JWT_SECRET=your_super_secret_key_here_min_32_chars_1234567890
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=test_secret_key_here
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmanagement?retryWrites=true&w=majority
```

### 3.4 Seed Database
```bash
npm run seed
```

**Expected Output:**
```
Connected to MongoDB for seeding...
Admin created: diyafathima@admin.com / admin123456
12 books seeded
Database seeded successfully!
```

### 3.5 Start Backend
```bash
npm run dev
```

**You should see:**
```
Server running on port 5000
Connected to MongoDB
```

**✅ KEEP THIS TERMINAL OPEN**

---

## STEP 4: Frontend Setup (5 minutes)

### 4.1 Open New Terminal Window

In a **NEW terminal window**, navigate to the project folder.

### 4.2 Navigate to Frontend
```bash
cd frontend
```

### 4.3 Install Dependencies
```bash
npm install
```

### 4.4 Start Frontend
```bash
npm run dev
```

**You should see:**
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5176/
```

**✅ KEEP THIS TERMINAL OPEN**

---

## STEP 5: Verify Installation (2 minutes)

### Option 1: Run Verification Script

**Windows:**
```bash
verify-installation.bat
```

**Mac/Linux:**
```bash
bash verify-installation.sh
```

### Option 2: Manual Verification

1. **Backend Check:**
   ```bash
   curl http://localhost:5000/api/books
   ```
   Should return JSON array of 12 books

2. **Frontend Check:**
   Open http://localhost:5176 in your browser
   Should see the landing page

---

## STEP 6: Login & Test (3 minutes)

### 6.1 Login with Test Admin Account

1. Click "Login" on the landing page
2. Enter credentials:
   - **Email:** `diyafathima@admin.com`
   - **Password:** `admin123456`
3. Click "Sign In"

### 6.2 You're now logged in as Admin

You can:
- ✅ View catalog of 12 books
- ✅ Access admin dashboard
- ✅ Add/edit/delete books
- ✅ View all transactions

### 6.3 Test Customer Features

1. Logout from admin account
2. Click "Register"
3. Create a new account with:
   - Name: Your name
   - Email: your@email.com
   - Password: Any password
4. Click "Create Account"
5. Login with new account
6. Browse books and test purchase flow

---

## STEP 7: Default Credentials Reference

### Admin Account
```
Email:    diyafathima@admin.com
Password: admin123456
```

### Test Customer Account
```
Email:    sakshi@customer.com
Password: customer123456
```

### Create Your Own Customer
Use the registration page - no admin option available.

---

## URLs You'll Use

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5176 | Book store interface |
| Backend API | http://localhost:5000 | Server API |
| Books Endpoint | http://localhost:5000/api/books | Get all books |

---

## Troubleshooting During Setup

### Backend won't start

**Error:** "EADDRINUSE: address already in use :::5000"
```bash
# Kill process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
# Then kill the process
```

**Error:** "Cannot find MONGODB_URI"
- Check `.env` file exists in backend folder
- Verify syntax is correct

**Error:** "Seeding error"
- Ensure MongoDB is running
- Check database connection string

### Frontend won't start

**Error:** "Port 5176 already in use"
```bash
# Kill process on port 5176 or restart terminal
```

**Error:** "Cannot find module"
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Can't login

- Clear browser cache: `Ctrl+Shift+Del`
- Clear localStorage: Open DevTools → Console → `localStorage.clear()`
- Refresh page and try again

---

## Next Steps After Setup

1. **Read Documentation:**
   - Start with `README.md` for overview
   - Read `QUICK_START.md` for quick reference
   - Check `SYSTEM_SETUP_GUIDE.md` for detailed info

2. **Configure Payments (Optional):**
   - Get Razorpay keys from https://dashboard.razorpay.com
   - Update `.env` with real keys

3. **For Production Deployment:**
   - Follow `PRODUCTION_DEPLOYMENT_CHECKLIST.md`
   - Set up MongoDB Atlas cluster
   - Configure real Razorpay keys
   - Deploy to cloud (Heroku, Railway, Vercel, etc.)

---

## System Architecture

```
┌─────────────────────────────┐
│   Your Browser              │
│   http://localhost:5176     │
│   (React Frontend)          │
└──────────────┬──────────────┘
               │ HTTP Requests
               ↓
┌─────────────────────────────┐
│   Backend Server            │
│   http://localhost:5000     │
│   (Express API)             │
└──────────────┬──────────────┘
               │ Queries
               ↓
┌─────────────────────────────┐
│   MongoDB Database          │
│   mongodb://localhost:27017 │
│   (12 books + users)        │
└─────────────────────────────┘
```

---

## Features You Can Test

### As Admin
- [ ] View all books in catalog
- [ ] Go to admin dashboard
- [ ] Add a new book
- [ ] Edit a book
- [ ] Delete a book
- [ ] View all users
- [ ] View all transactions

### As Customer
- [ ] Register new account
- [ ] Browse book catalog
- [ ] View book details
- [ ] Click "Buy" or "Rent"
- [ ] View payment modal (3 methods)
- [ ] View your transactions

---

## Common Questions

**Q: Where's my database data stored?**
A: 
- Local MongoDB: `~/data/db` (Mac) or wherever you configured it
- MongoDB Atlas: Cloud hosted on AWS/Azure/GCP

**Q: How do I reset the database?**
A: Run `npm run seed` again in backend folder

**Q: Can I change the admin password?**
A: Currently, re-seed database to reset. For production, add user management UI.

**Q: How do I update a book's price?**
A: Login as admin → Admin Dashboard → Books → Edit

**Q: What happens if I don't have MongoDB?**
A: Install it locally OR use MongoDB Atlas cloud service

---

## Getting Help

1. **Check Documentation:**
   - README.md - Overview
   - SYSTEM_SETUP_GUIDE.md - Detailed setup
   - QUICK_REFERENCE.md - Commands

2. **Check Error Messages:**
   - Read full error in terminal
   - Google the error message
   - Check Troubleshooting above

3. **Restart Services:**
   - Stop backend: `Ctrl+C` in terminal
   - Stop frontend: `Ctrl+C` in terminal
   - Stop MongoDB if running locally
   - Restart in correct order: Backend → Frontend

---

## Success Indicators

You've successfully set up the system when:

✅ Backend terminal shows "Server running on port 5000"
✅ Frontend terminal shows "Local: http://localhost:5176"
✅ Browser loads http://localhost:5176
✅ Can login with admin@bookstore.com
✅ Can see 12 books in catalog
✅ Can create new customer account
✅ Payment modal shows 3 methods

---

**Congratulations! You're all set!** 🎉

Start exploring the system at http://localhost:5176
