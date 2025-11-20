# Job Tracker Dashboard
<img width="1882" height="871" alt="image" src="https://github.com/user-attachments/assets/5a6bf42b-8cbf-42c8-a530-1362a4f6e2a0" />


A full-stack web application to track job applications with SQL database normalization, advanced queries, and a beautiful React dashboard with charts and filtering capabilities.

## Features

- 📊 **Normalized SQL Database**: Properly normalized tables (companies, applications, contacts) with foreign key relationships
- 📈 **Statistics Dashboard**: View conversion rates, applications per week, status breakdowns, and more
- 🔍 **Advanced Filtering**: Filter applications by status, company, date range
- 📝 **Application Management**: Add, edit, and delete job applications
- 🏢 **Company & Contact Management**: Track companies and contacts separately
- 📉 **Data Visualization**: Interactive charts using Recharts (pie charts, bar charts, line charts)
- 🎨 **Modern UI/UX**: Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: React 18, Recharts, Axios, date-fns
- **Backend**: Node.js, Express
- **Database**: SQLite (easily switchable to PostgreSQL)
- **API**: RESTful API with proper SQL joins and queries

## Database Schema

The database uses normalized tables:

- **companies**: Company information (name, website, industry)
- **contacts**: Contact information linked to companies
- **applications**: Job applications linked to companies
- **application_contacts**: Junction table for many-to-many relationship between applications and contacts

## SQL Queries Implemented

1. **Applications per week**: Groups applications by week using SQL date functions
2. **Conversion rate**: Calculates percentage of applications that reached interview/offer/accepted status
3. **Status breakdown**: Groups applications by status
4. **Top companies**: Shows companies with most applications
5. **Filtered queries**: Complex joins with WHERE clauses for filtering

## Installation

1. **Install dependencies for all packages**:
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

## Usage

1. Open `http://localhost:3000` in your browser
2. Navigate to "Add Application" to start tracking jobs
3. Use "Dashboard" to see overview and recent applications
4. Use "Applications" to view and filter all applications
5. Use "Statistics" to see charts and detailed analytics

## API Endpoints

- `GET /api/applications` - Get all applications (with filters)
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create new company
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `GET /api/stats/overview` - Get statistics overview

## Project Structure

```
job-tracker-dashboard/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json
│   └── job_tracker.db     # SQLite database (created automatically)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── ApplicationForm.js
│   │   │   ├── ApplicationList.js
│   │   │   └── Statistics.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Database Initialization

The database is automatically initialized when the server starts. Tables are created if they don't exist.

To manually initialize (optional):
```bash
cd backend
npm run init-db
```

## Switching to PostgreSQL

To use PostgreSQL instead of SQLite:

1. Install `pg` package: `npm install pg`
2. Update `backend/server.js` to use PostgreSQL connection
3. Update SQL syntax for PostgreSQL (e.g., `AUTOINCREMENT` → `SERIAL`)

## Deploying to GitHub

### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Job Tracker Dashboard"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. **Don't** initialize with README (we already have one)
3. Copy the repository URL

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy Your Application

For detailed deployment instructions (Vercel, Railway, etc.), see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy:**
- **Frontend**: Deploy to [Vercel](https://vercel.com) (set root to `frontend`)
- **Backend**: Deploy to [Railway](https://railway.app) (set root to `backend`)

## License

MIT

