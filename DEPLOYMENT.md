# Deployment Guide

This guide covers how to push your code to GitHub and deploy your Job Tracker Dashboard.

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

If you haven't already initialized git in your project:

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Job Tracker Dashboard with SQL database and React UI"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it (e.g., `job-tracker-dashboard`)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 6: Verify

Refresh your GitHub repository page - you should see all your files!

---

## Part 2: Deployment Options

Since this is a full-stack application (backend + frontend), you have several deployment options:

### Option A: Deploy Frontend to Vercel/Netlify + Backend to Railway/Render

**Recommended for beginners**

#### Frontend (React) - Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `frontend`
5. Add environment variable: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
6. Click "Deploy"

#### Backend (Node.js) - Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set the **Root Directory** to `backend`
5. Railway will auto-detect Node.js and deploy
6. Add environment variable if needed: `PORT` = `5000`
7. Get your backend URL (e.g., `https://your-app.railway.app`)
8. Update frontend's `REACT_APP_API_URL` in Vercel to point to this URL

**Alternative Backend Hosting:**
- **Render**: Similar to Railway, free tier available
- **Heroku**: Requires credit card, but very reliable
- **Fly.io**: Good free tier

### Option B: Deploy Everything to a VPS (DigitalOcean, AWS EC2, etc.)

**For more control**

1. Set up a VPS (Virtual Private Server)
2. Install Node.js and npm
3. Clone your repository
4. Set up PM2 for process management
5. Configure Nginx as reverse proxy
6. Set up SSL with Let's Encrypt

### Option C: Use Docker and Deploy to Any Platform

Create Dockerfiles for easier deployment (see Docker section below).

---

## Part 3: Environment Variables

### Frontend (.env file in frontend folder)

Create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production, set this to your deployed backend URL.

### Backend (.env file in backend folder)

Create `backend/.env` (optional, defaults work):

```
PORT=5000
NODE_ENV=production
```

---

## Part 4: Database Considerations

### For Production Deployment:

1. **SQLite (Current)**: Works for small projects, but not ideal for production
2. **PostgreSQL (Recommended)**: 
   - Use services like:
     - Railway (includes PostgreSQL)
     - Render (includes PostgreSQL)
     - Supabase (free PostgreSQL)
     - Neon (serverless PostgreSQL)

### To Switch to PostgreSQL:

1. Install `pg` package: `npm install pg`
2. Update `backend/server.js` to use PostgreSQL connection
3. Update SQL syntax (e.g., `AUTOINCREMENT` → `SERIAL`)

---

## Part 5: Quick Deploy Scripts

### Update package.json scripts for production:

```json
{
  "scripts": {
    "build": "cd frontend && npm run build",
    "start:prod": "cd backend && npm start"
  }
}
```

---

## Part 6: GitHub Actions (CI/CD) - Optional

You can set up automated deployment using GitHub Actions. This will automatically deploy when you push to main branch.

---

## Recommended Quick Start Deployment:

1. **Push to GitHub** (Part 1)
2. **Deploy Backend to Railway**:
   - Root: `backend`
   - Get backend URL
3. **Deploy Frontend to Vercel**:
   - Root: `frontend`
   - Environment: `REACT_APP_API_URL` = your Railway backend URL
4. **Done!** Your app is live!

---

## Troubleshooting

### CORS Issues
- Make sure backend has CORS enabled (already done in server.js)
- Check that frontend API URL is correct

### Database Issues
- SQLite database file won't persist on free hosting
- Consider upgrading to PostgreSQL for production

### Build Errors
- Make sure all dependencies are in package.json
- Check Node.js version compatibility

---

## Security Notes for Production

1. Add rate limiting to API
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Add input validation
5. Consider adding authentication

