# 🚀 Create GitHub Repository - Step-by-Step Guide

Follow these steps to create a GitHub repository and push your Book Management System code.

## Step 1: Go to GitHub.com

1. Open https://github.com in your browser
2. Log in to your GitHub account (create one if you don't have it)
3. Click the **+** icon in the top right corner
4. Select **New repository**

## Step 2: Configure Your Repository

Fill in the following details:

| Field | Value |
|-------|-------|
| **Repository name** | `book-management` (or your preferred name) |
| **Description** | `Full-stack book buying and rental platform with Razorpay payment integration` |
| **Visibility** | `Public` (choose based on your preference) |
| **Initialize this repository with** | Leave unchecked (we already have files) |

Then click **Create repository**.

## Step 3: Copy Your Repository URL

After creating the repository, GitHub will show you a page with your repository URL. You'll see two options:

- **HTTPS**: `https://github.com/your-username/book-management.git`
- **SSH**: `git@github.com:your-username/book-management.git`

**Copy the HTTPS URL** (easier for beginners)

## Step 4: Add Remote and Push

Open PowerShell in your project directory and run these commands:

```powershell
cd "c:\Users\DIYA FATHIMA TA\Downloads\book management"
```

Then add your repository as the remote:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/book-management.git
```

Replace `YOUR_USERNAME` with your actual GitHub username and `book-management` with your repo name if different.

Make sure the branch is named "main":

```powershell
git branch -M main
```

Finally, push your code:

```powershell
git push -u origin main
```

## Step 5: Authenticate (First Time Only)

When you run `git push`, you'll be prompted for authentication. Choose one:

### Option A: Personal Access Token (Recommended)

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name like "Book Management Push"
4. Check these scopes:
   - `repo` (full control of private repositories)
   - `workflow` (if using GitHub Actions)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. When prompted for password during push, paste the token

### Option B: GitHub Token (Newer Method)

1. Go to https://github.com/settings/personal-access-tokens/new
2. Follow GitHub's new token setup
3. Use it like a password when pushing

## Step 6: Verify Success

After the push completes:

1. Go to https://github.com/your-username/book-management
2. Verify all your files are there
3. Your repository is now on GitHub! 🎉

## Troubleshooting

### "fatal: unable to access 'https://...' could not resolve host"
- Check your internet connection

### "fatal: 'origin' already exists"
- Run: `git remote remove origin`
- Then add the correct remote again

### "fatal: Could not read Username for 'https://github.com'"
- Use a Personal Access Token instead of your password
- Create one at: https://github.com/settings/tokens

### "Permission denied (publickey)" (SSH error)
- You're using SSH but don't have keys configured
- Use HTTPS URL instead, or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## After Your First Push

Your repository is now live! You can:
- ✅ Share the repository URL with others
- ✅ Configure GitHub Pages for documentation
- ✅ Set up GitHub Actions for CI/CD
- ✅ Track issues and pull requests
- ✅ Collaborate with other developers

## Optional: Add More Details

After pushing, enhance your repository:

1. **Add topics**: Go to repository settings and add tags like:
   - `book-management`
   - `razorpay`
   - `react`
   - `nodejs`
   - `mongodb`

2. **Add a CI/CD workflow**: GitHub Actions can automatically test your code

3. **Enable Discussions**: Allow community feedback in your repository

## Questions?

For more help:
- GitHub Documentation: https://docs.github.com
- Git Documentation: https://git-scm.com/doc
- Razorpay Integration: https://razorpay.com/docs/
