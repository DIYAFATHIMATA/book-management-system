# 🚀 Deployment Guide: Vercel (Frontend) & Render (Backend)

This guide will help you deploy your Book Management System to production.

## 📋 Overview

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | https://your-name-book-management.vercel.app |
| **Backend** | Render | https://your-name-book-management.onrender.com |

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create a Web Service

1. Click **New +** → **Web Service**
2. Select your `book-management-system` repository
3. Click **Connect**

### Step 3: Configure the Web Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `book-management-api` |
| **Environment** | `Node` |
| **Region** | Select closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node backend/server.js` |
| **Plan** | `Free` (sufficient for testing) |

### Step 4: Add Environment Variables

Scroll to **Environment** section and add:

```
MONGODB_URI=mongodb+srv://your-cluster-connection-string
JWT_SECRET=your-super-secret-key-here
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=your_live_secret_key
```

**Getting MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` and `<username>` with your credentials

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically build and deploy
3. Wait for green "Live" status
4. Your backend URL will be at `https://your-service-name.onrender.com`

**Test your backend:**
```
https://your-service-name.onrender.com/api/books
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **Add New +** → **Project**
2. Click **Import Git Repository**
3. Select your `book-management-system` repository
4. Click **Import**

### Step 3: Configure Build Settings

In the **Configure Project** screen:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 4: Add Environment Variables

In the **Environment Variables** section, add:

```
VITE_API_URL=https://your-service-name.onrender.com/api
```

Replace `your-service-name` with your actual Render service name.

### Step 5: Deploy

1. Click **Deploy**
2. Vercel will build and deploy automatically
3. Wait for the deployment to complete
4. Your frontend URL will appear (e.g., `https://book-management-system.vercel.app`)

---

## 🔗 Step 3: Connect Frontend to Deployed Backend

### Update Frontend API Configuration

1. Open [frontend/src/services/api.js](../frontend/src/services/api.js)
2. Update the base URL to your deployed backend:

```javascript
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

3. Commit and push the changes:
```bash
git add frontend/src/services/api.js
git commit -m "Update API URL to production Render backend"
git push
```

4. Vercel will automatically redeploy with the new API URL

---

## 🧪 Testing Your Deployment

### Test Backend API

```bash
# In your browser or Postman
https://your-service-name.onrender.com/api/books
```

You should see a JSON array of books.

### Test Frontend

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Try these flows:
   - ✅ Browse books
   - ✅ Login with: `diyafathima@admin.com` / `admin123456`
   - ✅ Make a purchase (test payment)
   - ✅ Check dashboard

---

## 💳 Production Payment Setup

### Prepare for Real Payments

1. **Get Live Razorpay Keys:**
   - Go to https://dashboard.razorpay.com/settings/api-keys
   - Copy your live (not test) keys
   - Replace in Render environment variables

2. **Update Backend Code** (if needed):
   - Remove test mode detection
   - Use real payment verification

3. **Update Frontend** (if needed):
   - Ensure payment modal works with live keys
   - Test payment flow thoroughly

---

## 🚨 Important Notes

### Render Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after idle may take 30+ seconds
- **Upgrade to paid** for production reliability

### Vercel Deployment

- Automatic deployments on `git push main`
- Can set up preview deployments for PRs
- Free tier includes all essential features

### Database

- MongoDB Atlas has a free tier (500MB limit)
- Good for development/testing only
- Upgrade for production data

---

## 📊 Deployment Checklist

### Backend (Render)

- [ ] Render account created
- [ ] Web Service created
- [ ] Build/Start commands configured
- [ ] Environment variables set
- [ ] Deployment successful (green status)
- [ ] API endpoint tested

### Frontend (Vercel)

- [ ] Vercel account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] API URL set in environment variables
- [ ] Deployment successful
- [ ] Frontend accessible

### Integration

- [ ] Frontend API URL updated
- [ ] Code pushed to GitHub
- [ ] Vercel auto-redeployed
- [ ] Frontend can fetch from backend
- [ ] Login works
- [ ] Payment works

---

## 🔧 Troubleshooting

### Backend not responding

**Problem**: CORS errors or connection timeouts
- **Solution**: Check MongoDB connection string
- **Solution**: Verify Render environment variables
- **Solution**: Check service logs in Render dashboard

### Frontend showing API errors

**Problem**: "Cannot fetch from backend"
- **Solution**: Verify `VITE_API_URL` in Vercel environment variables
- **Solution**: Check backend is actually deployed
- **Solution**: Browser console may show exact error

### Books not loading

**Problem**: Empty book list on catalog page
- **Solution**: Check MongoDB connection
- **Solution**: Verify seed data was loaded
- **Solution**: Run `node backend/seed.js` locally to test seeding

### Payment not working

**Problem**: "Request failed with status code 500"
- **Solution**: Verify Razorpay keys are valid
- **Solution**: Check test vs. live keys are correct
- **Solution**: Review backend logs in Render

### Vercel deployment fails

**Problem**: Build fails with "module not found"
- **Solution**: Check `frontend/src/services/api.js` imports
- **Solution**: Verify all dependencies in `package.json`
- **Solution**: Check Node version compatibility

---

## 📈 Next Steps After Deployment

1. **Monitor Performance:**
   - Render dashboard: Check CPU/memory usage
   - Vercel analytics: Monitor page load times

2. **Enable Auto-Scaling:**
   - Render paid plans auto-scale
   - Vercel auto-scales by default

3. **Set Up Error Tracking:**
   - Use Sentry for error monitoring
   - Enable logging on both platforms

4. **Backup Database:**
   - Enable MongoDB backup snapshots
   - Schedule regular backups

5. **Optimize Images:**
   - Images are from Unsplash CDN (fast)
   - Good for production use

---

## 💰 Cost Estimation

- **Render**: Free tier + $7/month for production
- **Vercel**: Free (includes next.js and vite)
- **MongoDB Atlas**: Free tier (or $0.57/month for M0)
- **Razorpay**: Pay per transaction (2.36% + ₹3)

Total: ~$10/month for full production setup

---

## 🆘 Getting Help

- **Render Support**: https://render.com/support
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Razorpay**: https://razorpay.com/docs/

---

## ✅ You're Live!

After deployment, share your production URLs:
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-service.onrender.com/api`

Congratulations on deploying your Book Management System! 🎉
