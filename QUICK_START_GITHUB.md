# Quick Start: Push to GitHub

Follow these simple steps to push your Job Tracker Dashboard to GitHub:

## Prerequisites
- Git installed on your computer
- GitHub account

**⚠️ If Git is not installed:** See [INSTALL_GIT_WINDOWS.md](./INSTALL_GIT_WINDOWS.md) for installation instructions first!

## Steps

### 1. Open Terminal/Command Prompt
Navigate to your project directory:
```bash
cd "C:\Users\Asmita Joshi\OneDrive\Desktop\Mood-playlisy"
```

### 2. Initialize Git (if not already done)
```bash
git init
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Your First Commit
```bash
git commit -m "Initial commit: Job Tracker Dashboard with SQL and React"
```

### 5. Create Repository on GitHub
1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right corner
3. Click **"New repository"**
4. Enter a repository name (e.g., `job-tracker-dashboard`)
5. **IMPORTANT**: Do NOT check "Initialize with README" (we already have files)
6. Click **"Create repository"**

### 6. Connect and Push
After creating the repository, GitHub will show you commands. Use these (replace with your actual username and repo name):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/asmitajoshi/job-tracker-dashboard.git
git branch -M main
git push -u origin main
```

### 7. Verify
- Go to your GitHub repository page
- You should see all your files!
- Your code is now on GitHub! 🎉

## Next Steps

### To Deploy Your App Online:
See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to:
- Vercel (Frontend)
- Railway (Backend)
- Or other platforms

### To Make Future Updates:
```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

**If you get "fatal: remote origin already exists":**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**If you get authentication errors:**
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app for easier authentication

**If you need to update your remote URL:**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

