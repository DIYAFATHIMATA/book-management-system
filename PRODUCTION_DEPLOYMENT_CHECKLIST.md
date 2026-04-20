# 🚀 Production Deployment Checklist

Complete verification and setup checklist before deploying to production.

---

## 🔐 Security Checklist

### Environment Variables
- [ ] Set `JWT_SECRET` to a strong random value (minimum 32 characters)
- [ ] Add real `RAZORPAY_KEY_ID` from https://dashboard.razorpay.com
- [ ] Add real `RAZORPAY_KEY_SECRET` (keep secret, never commit)
- [ ] Set `NODE_ENV=production`
- [ ] Use production `MONGODB_URI` (Atlas cluster, never localhost)
- [ ] Verify `.env` file is in `.gitignore`
- [ ] Confirm `.env` is NOT committed to git

### Database Security
- [ ] Create dedicated MongoDB user (not admin)
- [ ] Enable MongoDB Atlas IP whitelist (only production server IPs)
- [ ] Enable MongoDB authentication
- [ ] Use TLS/SSL for database connection (`mongodb+srv://`)
- [ ] Regular database backups configured
- [ ] Database access logging enabled

### API Security
- [ ] Enable CORS only for production frontend domain
- [ ] Update `corsOptions` origin from `*` to specific URL
- [ ] Disable debug endpoints in production
- [ ] Rate limiting configured (consider express-rate-limit)
- [ ] HTTPS/SSL certificates obtained and installed
- [ ] Security headers configured (helmet.js)

### Payment Security
- [ ] Use Razorpay production keys (not test keys)
- [ ] Verify signature validation is enabled
- [ ] Payment webhook URL configured in Razorpay dashboard
- [ ] Webhook signature validation implemented
- [ ] Never expose Razorpay secret in frontend
- [ ] Payment amount validation on server-side

---

## 📋 Code Quality Checklist

### Backend
- [ ] All console.log statements removed (use proper logging)
- [ ] Error messages don't expose system details
- [ ] Input validation on all endpoints
- [ ] SQL/NoSQL injection prevention verified
- [ ] Password hashing verified (bcrypt rounds >= 10)
- [ ] No hardcoded credentials in code
- [ ] Tests passing (if applicable)

### Frontend
- [ ] Build completed successfully: `npm run build`
- [ ] No console errors or warnings
- [ ] console.log statements removed (or minimized)
- [ ] API base URL uses production endpoint
- [ ] Environment variables properly set
- [ ] Build size optimized (check `dist/` folder)
- [ ] No development dependencies in production build

---

## 🗄️ Database Checklist

### Schema Verification
- [ ] All indexes created on frequently queried fields
  - `users.email` (unique)
  - `transactions.userId`
  - `transactions.bookId`
  - `books.isbn` (unique)
- [ ] Database backups automated and tested
- [ ] Point-in-time recovery configured
- [ ] User permissions properly scoped (not admin user)
- [ ] Database naming follows conventions

### Data Verification
- [ ] All 12 books properly seeded
- [ ] Admin account created with strong password
- [ ] Test customers deleted if any
- [ ] No duplicate books or users
- [ ] Stock levels verified
- [ ] Pricing in correct currency (INR)

---

## 🌐 Deployment Infrastructure

### Backend Server
- [ ] Node.js version matches local dev (18+)
- [ ] npm/yarn dependencies installed
- [ ] PM2 or similar process manager configured
- [ ] Auto-restart on crash enabled
- [ ] Logging to persistent storage configured
- [ ] HTTPS/SSL certificate installed
- [ ] Server has sufficient resources (2GB+ RAM recommended)
- [ ] Firewall configured (only ports 5000 or 443 exposed)

### Frontend Server
- [ ] Build artifacts in `dist/` folder
- [ ] Web server configured (nginx, Apache, or CDN)
- [ ] Caching headers set appropriately
- [ ] Gzip compression enabled
- [ ] 404 routing configured (spa-redirect)
- [ ] HTTPS enforced
- [ ] Performance optimized

### Database Server
- [ ] MongoDB 5+ running and stable
- [ ] Sufficient disk space (minimum 10GB)
- [ ] Regular monitoring enabled
- [ ] Automatic restarts configured
- [ ] Memory and CPU monitoring enabled
- [ ] Connection pooling configured

---

## 🔄 Testing Checklist

### Manual Testing
- [ ] Admin can login
- [ ] Admin can add/edit/delete books
- [ ] Customer can register
- [ ] Customer can login
- [ ] Customer can browse books
- [ ] Book details page displays correctly
- [ ] Payment modal opens with 3 methods
- [ ] Payment creation works (order ID generated)
- [ ] Transaction history displays
- [ ] Logout works and clears session

### Payment Testing (Use Razorpay Test Cards)
- [ ] UPI payment flow (use test UPI)
- [ ] Card payment with valid test card
- [ ] Failed payment handling
- [ ] Payment verification working
- [ ] Webhook receiving transactions

### API Testing
- [ ] GET /api/books returns 200
- [ ] POST /api/auth/register returns 201
- [ ] POST /api/auth/login returns JWT token
- [ ] Protected routes reject unauthenticated requests
- [ ] Admin routes reject customer requests
- [ ] Invalid input rejected with 400 errors
- [ ] Rate limiting working (if implemented)

---

## 📊 Monitoring & Logging

- [ ] Application logs captured
- [ ] Database query logs enabled (for performance)
- [ ] Error tracking set up (Sentry, DataDog, etc.)
- [ ] Performance monitoring configured
- [ ] Uptime monitoring configured
- [ ] Alert system for critical errors
- [ ] Log retention policy set
- [ ] Access logs configured

---

## 📞 Post-Deployment

### Verification
- [ ] Website accessible at production URL
- [ ] All pages load correctly
- [ ] API endpoints responding
- [ ] Database operations working
- [ ] Payments processing successfully
- [ ] Emails sending (if configured)
- [ ] SSL certificate working (no warnings)

### Documentation
- [ ] README updated with production URL
- [ ] Team trained on deployment process
- [ ] Rollback procedure documented
- [ ] Emergency contacts documented
- [ ] Access credentials secured (password manager)
- [ ] Production troubleshooting guide created

### Monitoring
- [ ] Daily uptime checks
- [ ] Weekly performance review
- [ ] Monthly security audit
- [ ] Database backup verification
- [ ] Error rate monitoring
- [ ] User activity monitoring

---

## 🚨 Emergency Procedures

### If Payment System Down
- [ ] Notify customers via email
- [ ] Enable maintenance mode
- [ ] Check Razorpay status page
- [ ] Review error logs
- [ ] Contact Razorpay support if needed

### If Database Down
- [ ] Activate backup/failover
- [ ] Notify users of temporary outage
- [ ] Review backup logs
- [ ] Check MongoDB Atlas status
- [ ] Restore from latest backup if needed

### If Security Breach Suspected
- [ ] Take site offline immediately
- [ ] Change all sensitive credentials
- [ ] Check logs for unauthorized access
- [ ] Notify users and enable password resets
- [ ] Conduct security audit before relaunch

---

## 📝 Pre-Launch Sign-Off

- [ ] Development Lead: _________________ Date: _______
- [ ] DevOps Lead: _________________ Date: _______
- [ ] Product Manager: _________________ Date: _______
- [ ] Security Lead: _________________ Date: _______

---

## 🎉 Launch Complete

- [ ] DNS updated to production server
- [ ] SSL certificate verified
- [ ] All services operational
- [ ] Users notified of launch
- [ ] Monitoring team aware
- [ ] Support team trained

---

## 📊 Post-Launch Monitoring (First 24 Hours)

- [ ] Server performance stable
- [ ] No critical errors in logs
- [ ] Payment transactions processing
- [ ] User registrations working
- [ ] Database responding quickly
- [ ] No security alerts
- [ ] Support team handles inquiries

---

**Last Updated:** Current Session
**Version:** 1.0
**Status:** Ready for Production

For detailed setup instructions, see [SYSTEM_SETUP_GUIDE.md](./SYSTEM_SETUP_GUIDE.md)
