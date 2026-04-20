#!/bin/bash
# Book Management System - Installation Verification Script
# Run this after installation to verify all components are working

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   BOOK MANAGEMENT SYSTEM - INSTALLATION VERIFICATION           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_failed=0

# Function to check a condition
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((checks_passed++))
    else
        echo -e "${RED}❌${NC} $2"
        ((checks_failed++))
    fi
}

echo "📋 CHECKING PREREQUISITES"
echo "─────────────────────────────"

# Check Node.js
node -v > /dev/null 2>&1
check_status $? "Node.js installed"

# Check npm
npm -v > /dev/null 2>&1
check_status $? "npm installed"

# Check MongoDB connection (if local)
if command -v mongosh &> /dev/null; then
    mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1
    check_status $? "MongoDB running"
else
    echo -e "${YELLOW}⚠️${NC}  MongoDB check skipped (mongosh not found - Atlas may be in use)"
fi

echo ""
echo "📁 CHECKING BACKEND"
echo "─────────────────────────────"

# Check backend files
[ -d "backend" ] && check_status 0 "Backend directory exists" || check_status 1 "Backend directory missing"
[ -f "backend/package.json" ] && check_status 0 "Backend package.json exists" || check_status 1 "Backend package.json missing"
[ -f "backend/server.js" ] && check_status 0 "Backend server.js exists" || check_status 1 "Backend server.js missing"
[ -d "backend/node_modules" ] && check_status 0 "Backend node_modules installed" || check_status 1 "Backend node_modules missing - run: cd backend && npm install"

echo ""
echo "🎨 CHECKING FRONTEND"
echo "─────────────────────────────"

# Check frontend files
[ -d "frontend" ] && check_status 0 "Frontend directory exists" || check_status 1 "Frontend directory missing"
[ -f "frontend/package.json" ] && check_status 0 "Frontend package.json exists" || check_status 1 "Frontend package.json missing"
[ -f "frontend/src/App.jsx" ] && check_status 0 "Frontend App.jsx exists" || check_status 1 "Frontend App.jsx missing"
[ -d "frontend/node_modules" ] && check_status 0 "Frontend node_modules installed" || check_status 1 "Frontend node_modules missing - run: cd frontend && npm install"

echo ""
echo "⚙️ CHECKING CONFIGURATION"
echo "─────────────────────────────"

# Check .env files
[ -f "backend/.env" ] && check_status 0 "Backend .env exists" || check_status 1 "Backend .env missing - copy from template"
grep -q "MONGODB_URI" backend/.env 2>/dev/null && check_status 0 "MongoDB URI configured" || check_status 1 "MongoDB URI not in .env"
grep -q "JWT_SECRET" backend/.env 2>/dev/null && check_status 0 "JWT_SECRET configured" || check_status 1 "JWT_SECRET not in .env"

echo ""
echo "🖥️ CHECKING API ENDPOINTS"
echo "─────────────────────────────"

# Check if backend is running
if curl -s http://localhost:5000/api/books > /dev/null 2>&1; then
    check_status 0 "Backend API responding"
    
    # Check specific endpoints
    curl -s http://localhost:5000/api/books 2>/dev/null | grep -q '"_id"' && check_status 0 "Books endpoint working" || check_status 1 "Books endpoint not responding"
    curl -s http://localhost:5000/api/payments/methods 2>/dev/null | grep -q '"name"' && check_status 0 "Payment methods endpoint working" || check_status 1 "Payment methods endpoint not responding"
else
    echo -e "${YELLOW}⚠️${NC}  Backend not running on port 5000"
    echo "   Start backend: cd backend && npm run dev"
fi

echo ""
echo "📚 CHECKING DOCUMENTATION"
echo "─────────────────────────────"

# Check documentation files
[ -f "README.md" ] && check_status 0 "README.md exists" || check_status 1 "README.md missing"
[ -f "QUICK_START.md" ] && check_status 0 "QUICK_START.md exists" || check_status 1 "QUICK_START.md missing"
[ -f "SYSTEM_SETUP_GUIDE.md" ] && check_status 0 "SYSTEM_SETUP_GUIDE.md exists" || check_status 1 "SYSTEM_SETUP_GUIDE.md missing"
[ -f "PAYMENT_SETUP.md" ] && check_status 0 "PAYMENT_SETUP.md exists" || check_status 1 "PAYMENT_SETUP.md missing"
[ -f "PRODUCTION_DEPLOYMENT_CHECKLIST.md" ] && check_status 0 "PRODUCTION_DEPLOYMENT_CHECKLIST.md exists" || check_status 1 "PRODUCTION_DEPLOYMENT_CHECKLIST.md missing"

echo ""
echo "🔐 CHECKING SECURITY"
echo "─────────────────────────────"

# Check .gitignore
[ -f ".gitignore" ] && check_status 0 ".gitignore exists" || check_status 1 ".gitignore missing"
grep -q ".env" .gitignore 2>/dev/null && check_status 0 ".env protected in .gitignore" || check_status 1 ".env not in .gitignore"
[ -f "backend/.gitignore" ] && check_status 0 "Backend .gitignore exists" || check_status 1 "Backend .gitignore missing"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}Checks Passed: $checks_passed${NC}"
echo -e "${RED}Checks Failed: $checks_failed${NC}"
echo "════════════════════════════════════════════════════════════════"

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - SYSTEM READY${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd backend && npm run dev"
    echo "2. Start frontend: cd frontend && npm run dev (in new terminal)"
    echo "3. Open: http://localhost:5176"
    echo "4. Login with: diyafathima@admin.com / admin123456"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED - FIX ISSUES ABOVE${NC}"
    exit 1
fi
