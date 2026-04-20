@echo off
REM Book Management System - Installation Verification Script (Windows)
REM Run this after installation to verify all components are working

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   BOOK MANAGEMENT SYSTEM - INSTALLATION VERIFICATION           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion
set passed=0
set failed=0

echo 📋 CHECKING PREREQUISITES
echo ─────────────────────────────

REM Check Node.js
node -v >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ Node.js installed
    set /a passed+=1
) else (
    echo ❌ Node.js not found - install from https://nodejs.org
    set /a failed+=1
)

REM Check npm
npm -v >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ npm installed
    set /a passed+=1
) else (
    echo ❌ npm not found
    set /a failed+=1
)

echo.
echo 📁 CHECKING BACKEND
echo ─────────────────────────────

if exist "backend" (
    echo ✅ Backend directory exists
    set /a passed+=1
) else (
    echo ❌ Backend directory missing
    set /a failed+=1
)

if exist "backend\package.json" (
    echo ✅ Backend package.json exists
    set /a passed+=1
) else (
    echo ❌ Backend package.json missing
    set /a failed+=1
)

if exist "backend\server.js" (
    echo ✅ Backend server.js exists
    set /a passed+=1
) else (
    echo ❌ Backend server.js missing
    set /a failed+=1
)

if exist "backend\node_modules" (
    echo ✅ Backend node_modules installed
    set /a passed+=1
) else (
    echo ❌ Backend node_modules missing - run: cd backend ^&^& npm install
    set /a failed+=1
)

echo.
echo 🎨 CHECKING FRONTEND
echo ─────────────────────────────

if exist "frontend" (
    echo ✅ Frontend directory exists
    set /a passed+=1
) else (
    echo ❌ Frontend directory missing
    set /a failed+=1
)

if exist "frontend\package.json" (
    echo ✅ Frontend package.json exists
    set /a passed+=1
) else (
    echo ❌ Frontend package.json missing
    set /a failed+=1
)

if exist "frontend\src\App.jsx" (
    echo ✅ Frontend App.jsx exists
    set /a passed+=1
) else (
    echo ❌ Frontend App.jsx missing
    set /a failed+=1
)

if exist "frontend\node_modules" (
    echo ✅ Frontend node_modules installed
    set /a passed+=1
) else (
    echo ❌ Frontend node_modules missing - run: cd frontend ^&^& npm install
    set /a failed+=1
)

echo.
echo ⚙️ CHECKING CONFIGURATION
echo ─────────────────────────────

if exist "backend\.env" (
    echo ✅ Backend .env exists
    set /a passed+=1
) else (
    echo ❌ Backend .env missing - create from template
    set /a failed+=1
)

findstr /M "MONGODB_URI" "backend\.env" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ MongoDB URI configured
    set /a passed+=1
) else (
    echo ❌ MongoDB URI not in .env
    set /a failed+=1
)

findstr /M "JWT_SECRET" "backend\.env" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ JWT_SECRET configured
    set /a passed+=1
) else (
    echo ❌ JWT_SECRET not in .env
    set /a failed+=1
)

echo.
echo 📚 CHECKING DOCUMENTATION
echo ─────────────────────────────

if exist "README.md" (
    echo ✅ README.md exists
    set /a passed+=1
) else (
    echo ❌ README.md missing
    set /a failed+=1
)

if exist "QUICK_START.md" (
    echo ✅ QUICK_START.md exists
    set /a passed+=1
) else (
    echo ❌ QUICK_START.md missing
    set /a failed+=1
)

if exist "SYSTEM_SETUP_GUIDE.md" (
    echo ✅ SYSTEM_SETUP_GUIDE.md exists
    set /a passed+=1
) else (
    echo ❌ SYSTEM_SETUP_GUIDE.md missing
    set /a failed+=1
)

if exist "PRODUCTION_DEPLOYMENT_CHECKLIST.md" (
    echo ✅ PRODUCTION_DEPLOYMENT_CHECKLIST.md exists
    set /a passed+=1
) else (
    echo ❌ PRODUCTION_DEPLOYMENT_CHECKLIST.md missing
    set /a failed+=1
)

echo.
echo 🔐 CHECKING SECURITY
echo ─────────────────────────────

if exist ".gitignore" (
    echo ✅ .gitignore exists
    set /a passed+=1
) else (
    echo ❌ .gitignore missing
    set /a failed+=1
)

if exist "backend\.gitignore" (
    echo ✅ Backend .gitignore exists
    set /a passed+=1
) else (
    echo ❌ Backend .gitignore missing
    set /a failed+=1
)

echo.
echo ════════════════════════════════════════════════════════════════
echo Checks Passed: %passed%
echo Checks Failed: %failed%
echo ════════════════════════════════════════════════════════════════

if %failed% equ 0 (
    echo.
    echo ✅ ALL CHECKS PASSED - SYSTEM READY
    echo.
    echo Next steps:
    echo 1. Start backend: cd backend ^&^& npm run dev
    echo 2. Start frontend: cd frontend ^&^& npm run dev (in new terminal)
    echo 3. Open: http://localhost:5176
    echo 4. Login with: diyafathima@admin.com / admin123456
    echo.
) else (
    echo.
    echo ❌ SOME CHECKS FAILED - FIX ISSUES ABOVE
    echo.
)

pause
