# 🎨 Vercel Deployment Guide (Frontend)

Deploy your React/Vite frontend to Vercel in 5 minutes.

## Prerequisites

- GitHub account with code pushed
- Vercel account (free at https://vercel.com)
- Backend deployed to Render
- Backend API URL ready

## Step-by-Step Deployment

### 1. Prepare Your Frontend

Your frontend is already configured! Required files:
- ✅ `frontend/package.json` - Dependencies
- ✅ `frontend/vite.config.js` - Build configuration
- ✅ `frontend/src/services/api.js` - API configuration

### 2. Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (easiest)
3. Authorize Vercel to access your repositories

### 3. Import Your Repository

1. From Vercel Dashboard, click **Add New +**
2. Select **Project**
3. Click **Import Git Repository**
4. Find and select `book-management-system`
5. Click **Import**

### 4. Configure Project

Vercel will ask about your project structure:

**These settings auto-detect, but verify:**

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 5. Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-render-service.onrender.com/api` |

**Important:** Replace with your actual Render backend URL!

To find your Render URL:
- Go to Render Dashboard
- Click on your "book-management-api" service
- Copy the URL (looks like: `https://book-management-api-xxxx.onrender.com`)

### 6. Deploy

Click **Deploy**

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the frontend (`npm run build`)
4. Deploy to CDN

**Status:**
- 🔄 Building... (shows progress)
- 🟢 Ready (deployment complete!)

### 7. Get Your Frontend URL

After deployment, you'll see your live URL:
```
https://book-management-system.vercel.app
```

(or similar based on your project name)

## 🧪 Test Your Deployment

### 1. Visit Your Frontend

Open your Vercel URL in browser:
```
https://your-project.vercel.app
```

### 2. Test Key Features

- ✅ Page loads without errors
- ✅ Books display on catalog
- ✅ Navigation works
- ✅ Login page appears
- ✅ Login with test credentials:
  - Email: `diyafathima@admin.com`
  - Password: `admin123456`

### 3. Check Browser Console

- Open DevTools (F12)
- Check Console tab - should be no errors
- Check Network tab - verify API calls to Render

### 4. Test API Connection

If frontend shows "Cannot fetch books":
1. Open Console (F12)
2. Run: `fetch('YOUR_RENDER_URL/api/books').then(r => r.json()).then(console.log)`
3. Should show array of books

## 🔗 Updating Backend URL

If you need to change the backend URL:

### Option 1: Via Vercel Dashboard

1. Go to Vercel Project Settings
2. Click **Environment Variables**
3. Edit `VITE_API_URL`
4. Click **Save**
5. Vercel auto-redeployed

### Option 2: Via Git Push

1. Edit `frontend/src/services/api.js` (if hardcoded)
2. Or edit backend URL in environment setup
3. Push to GitHub:
   ```bash
   git add frontend/
   git commit -m "Update backend API URL"
   git push
   ```
4. Vercel auto-redeploys on push

## ⚠️ Important Notes

### Auto-Deployments

Vercel automatically deploys when you:
- Push to `main` branch
- Create a pull request (preview deployment)
- Use Vercel CLI

### Preview Deployments

For every pull request, Vercel creates a preview URL to test changes before merging.

### Custom Domain

To use your own domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records per Vercel instructions

## 🔧 Troubleshooting

### "Cannot GET /" error

**Check:**
- Build command is correct
- Output directory is `dist`
- `frontend/vite.config.js` exists

### Books not loading ("API Error")

**Check:**
- ✅ Backend is deployed on Render
- ✅ `VITE_API_URL` is set correctly
- ✅ Backend URL doesn't have trailing slash

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Check `VITE_API_URL` value
3. Should be: `https://your-render-service.onrender.com/api`
4. Save and redeploy

### Login not working

**Check:**
- ✅ Backend API `/api/auth/login` works
- ✅ CORS is enabled on backend
- ✅ JWT tokens stored in localStorage

**Test in Console:**
```javascript
fetch('YOUR_RENDER_URL/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'diyafathima@admin.com', password: 'admin123456' })
}).then(r => r.json()).then(console.log)
```

### Deployment fails

**Check build logs:**
1. Vercel Dashboard → Project
2. Click on failed deployment
3. View build logs for specific error

**Common issues:**
- Missing dependencies in `package.json`
- TypeScript errors (if using TS)
- Failed imports or missing files
- Environment variables not set

## 📋 Deployment Checklist

- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Build settings configured (root: `frontend`)
- [ ] Environment variable set: `VITE_API_URL`
- [ ] Backend URL is deployed on Render
- [ ] Deployment successful (green status)
- [ ] Frontend loads without 404 errors
- [ ] `/api/books` endpoint responds
- [ ] Login page functional
- [ ] Can login and access dashboard

## 🚀 After Deployment

### Share Your App

- **Frontend URL**: `https://your-project.vercel.app`
- **Backend API**: `https://your-render-backend.onrender.com`
- **GitHub Repo**: `https://github.com/DIYAFATHIMATA/book-management-system`

### Monitor Performance

In Vercel Analytics:
- View page load times
- Check user engagement
- Monitor error rates

### Set Up Custom Domain

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In Vercel: Settings → Domains → Add
3. Update DNS with Vercel nameservers
4. Site accessible at custom domain!

## ✅ Success!

Your frontend is now live! 🎉

**Both deployed:**
- ✅ Backend on Render
- ✅ Frontend on Vercel

**Next step:** Share your live URLs with the world!
