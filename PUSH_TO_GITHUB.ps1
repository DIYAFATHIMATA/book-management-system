# PowerShell script to push your Book Management System to GitHub
# 
# Usage: 
#   1. Replace YOUR_GITHUB_URL with your actual repository URL
#   2. Run this script

# Set your GitHub repository URL here
$GITHUB_URL = "YOUR_GITHUB_URL"  # e.g., https://github.com/yourusername/book-management.git

if ($GITHUB_URL -eq "YOUR_GITHUB_URL") {
    Write-Host "ERROR: Please replace YOUR_GITHUB_URL with your actual GitHub repository URL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Your repository URL should look like:" -ForegroundColor Yellow
    Write-Host "  https://github.com/your-username/your-repo-name.git" -ForegroundColor Cyan
    Write-Host "  OR"
    Write-Host "  git@github.com:your-username/your-repo-name.git" -ForegroundColor Cyan
    exit 1
}

Write-Host "Starting push to GitHub..." -ForegroundColor Green
Write-Host "Repository: $GITHUB_URL" -ForegroundColor Cyan
Write-Host ""

# Add remote
Write-Host "Step 1: Adding remote origin..." -ForegroundColor Yellow
git remote add origin $GITHUB_URL

# Rename branch to main if needed
Write-Host "Step 2: Ensuring branch is named 'main'..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Step 3: Pushing code to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Your code has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: $GITHUB_URL" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed. Please check:" -ForegroundColor Red
    Write-Host "  1. Your GitHub URL is correct" -ForegroundColor Yellow
    Write-Host "  2. You have internet connection" -ForegroundColor Yellow
    Write-Host "  3. Your GitHub credentials are configured" -ForegroundColor Yellow
}
