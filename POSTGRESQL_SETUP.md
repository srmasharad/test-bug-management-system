# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for local development and deploy to Neon for production.

## Option 1: Use Neon (Recommended for Quick Start)

Neon is a serverless PostgreSQL database perfect for this project.

### Steps:

1. **Create a Neon Account**
   - Go to https://neon.tech
   - Sign up for a free account
   - Create a new project

2. **Get Your Connection String**
   - In your Neon dashboard, find your connection string
   - It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

3. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and add your Neon connection string:
   ```
   DATABASE_URL=your_neon_connection_string_here
   ```

4. **Install Dependencies & Start**
   ```bash
   npm install
   npm start
   ```
   
   The database will be automatically initialized with tables and seed data!

## Option 2: Local PostgreSQL

### Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Create Database

```bash
# Login as postgres user
psql postgres

# Create database and user
CREATE DATABASE test_management;
CREATE USER test_user WITH ENCRYPTED PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE test_management TO test_user;
\q
```

### Configure Backend

Create `backend/.env`:
```
DATABASE_URL=postgresql://test_user:test_password@localhost:5432/test_management
PORT=3000
NODE_ENV=development
```

### Start Backend

```bash
cd backend
npm install
npm start
```

The tables and seed data will be created automatically!

## Deployment to Neon

### 1. Prepare Your Code

Make sure your `.env` file uses the Neon connection string:
```
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 2. Deploy Backend

You can deploy the backend to:
- **Vercel** (recommended)
- **Railway**
- **Render**
- **Fly.io**

### 3. Deploy Frontend to Vercel

```bash
cd frontend
# Update .env to point to your deployed backend
VITE_API_URL=https://your-backend-url.vercel.app
npm run build
```

Deploy the `dist` folder to Vercel.

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Check your DATABASE_URL is correct
2. Ensure PostgreSQL is running: `pg_isready`
3. Check firewall allows port 5432
4. For Neon, ensure SSL mode is set: `?sslmode=require`

### Migration from SQLite

The backend automatically detects whether to use PostgreSQL or SQLite based on the `DATABASE_URL` environment variable:
- If `DATABASE_URL` is set → Uses PostgreSQL
- If not set → Uses SQLite (for local development)

## Verification

Test your connection:
```bash
curl http://localhost:3000/healthz
# Should return: {"status":"ok","database":"PostgreSQL"}
```

Test data retrieval:
```bash
curl http://localhost:3000/api/projects
# Should return array of projects
```
