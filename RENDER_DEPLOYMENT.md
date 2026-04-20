# 🚀 Render Deployment Guide (Backend)

Deploy your Node.js/Express backend to Render in 5 minutes.

## Prerequisites

- GitHub account
- Render account (free at https://render.com)
- MongoDB connection string
- Backend code pushed to GitHub

## Step-by-Step Deployment

### 1. Prepare Your Backend

Your backend is already configured! Required files:
- ✅ `backend/server.js` - Entry point
- ✅ `backend/package.json` - Dependencies
- ✅ `backend/.env.example` - Environment template

### 2. Set Up MongoDB

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster:
   - Click "Create"
   - Choose "Free" tier
   - Select region closest to you
   - Wait for cluster creation (5-10 minutes)
4. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true`

### 3. Create Render Web Service

1. Go to https://render.com/dashboard
2. Click **New +** (top right)
3. Select **Web Service**
4. Choose your `book-management-system` repository
5. Click **Connect**

### 4. Configure Service

Fill in these exact values:

```
Name: book-management-api
Environment: Node
Region: (choose closest)
Branch: main
Build Command: npm install
Start Command: node backend/server.js
Instance Type: Free
```

### 5. Add Environment Variables

Before clicking "Create Web Service", scroll to **Environment** section:

Click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | `your-super-secret-key-12345-change-this` |
| `RAZORPAY_KEY_ID` | Your live Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Your live Razorpay secret |
| `PORT` | `5000` |

### 6. Deploy

Click **Create Web Service**

Render will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build the application
4. Start the server (`node backend/server.js`)

**Status Indicators:**
- 🟡 Yellow = Building
- 🟢 Green = Live and running

### 7. Get Your API URL

Once deployment is complete, you'll see:
```
https://your-service-name.onrender.com
```

Your API endpoints are at:
```
https://your-service-name.onrender.com/api/
```

## 🧪 Test Your Deployment

### Test the API

```bash
# In browser or Postman
GET https://your-service-name.onrender.com/api/books
```

Expected response: Array of books in JSON format

### Test specific endpoints

```bash
# Get all books
https://your-service-name.onrender.com/api/books

# Check health
https://your-service-name.onrender.com/

# Documentation
https://your-service-name.onrender.com/api/auth
https://your-service-name.onrender.com/api/payments
```

## ⚠️ Important Notes

### Free Tier Limitations

- Services spin down after **15 minutes** of no requests
- First request after idle takes **30+ seconds**
- Good for development/testing only

### Upgrade to Production

For production, upgrade to:
- **Standard Plan**: $7/month (always running)
- Or higher tiers for more resources

## 🔧 Troubleshooting

### Deployment fails with "Build failed"

**Check:**
- ✅ Node version compatible (v14+)
- ✅ All dependencies in `package.json`
- ✅ No missing environment variables
- ✅ GitHub repository has all files

**Solution:**
```bash
# Test locally first
cd backend
npm install
npm run dev
```

### API returns 500 error

**Check:**
- ✅ MongoDB connection string is correct
- ✅ MongoDB cluster allows connections from anywhere (0.0.0.0/0)
- ✅ All environment variables are set

**View logs:**
- Render Dashboard → Your Service → Logs tab

### Cannot connect to MongoDB

**Solution:**
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Ensure "Allow access from anywhere" is enabled (IP: 0.0.0.0/0)
4. Or add specific Render IPs (not recommended for free tier)

## 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Environment variables added:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `RAZORPAY_KEY_ID`
  - [ ] `RAZORPAY_KEY_SECRET`
  - [ ] `PORT`
- [ ] Service deployed (green status)
- [ ] `/api/books` endpoint tested
- [ ] Frontend can connect to this URL

## 🔗 Connect Frontend

After deployment, copy your API URL and give it to frontend:
```
Backend URL: https://your-service-name.onrender.com
API Base: https://your-service-name.onrender.com/api
```

## 📊 Monitoring

In Render Dashboard:
- View live logs
- Check CPU/memory usage
- Monitor deployment history
- Enable auto-deploys on push

## ✅ Success!

Your backend is now live! 🎉

Next step: Deploy frontend to Vercel (see VERCEL_DEPLOYMENT.md)
