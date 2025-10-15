# Deployment Guide

## Quick Start - Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend  
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## Production Deployment (Neon + Vercel)

### 1. Database Setup (Neon)

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname`)
4. Save this for the next steps

### 2. Backend Deployment

**Option A: Deploy to Vercel**
```bash
cd backend
# Create vercel.json (already included)
vercel
```

When prompted:
- Set environment variable: `DATABASE_URL=your_neon_connection_string`
- Set `SEED_DATA=true` (for first deployment only)

**Option B: Deploy to Railway/Render**
- Connect your GitHub repo
- Set environment variables:
  - `DATABASE_URL`: Your Neon connection string
  - `SEED_DATA`: `true` (first time only)

### 3. Frontend Deployment (Vercel)

1. Update `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

2. Build and deploy:
```bash
cd frontend
npm run build
vercel --prod
```

### 4. Verify Deployment

1. Visit your frontend URL
2. Check that Reports tab works (this was the main bug fix)
3. Test creating projects, bugs, etc.

---

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host/db    # Required for production
PORT=3000                                       # Optional
NODE_ENV=production                             # Optional
SEED_DATA=true                                  # Only for first deployment
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Key Changes Made

### ✅ PostgreSQL Support
- Backend now supports both SQLite (local) and PostgreSQL (production)
- Automatically switches based on `DATABASE_URL` environment variable
- All SQL queries are PostgreSQL-compatible

### ✅ Fixed Reports Bug
- Updated all date functions from MySQL syntax to PostgreSQL
- `DATE_SUB(NOW(), INTERVAL ? DAY)` → `CURRENT_TIMESTAMP - INTERVAL '1 day' * $1`
- Reports tab now works correctly

### ✅ Deployment Ready
- Vercel-compatible configuration
- Neon database support
- Environment variable configuration

---

## Troubleshooting

### Reports showing 500 error
- Check DATABASE_URL is set correctly
- Verify database tables are created
- Check backend logs

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS is enabled on backend
- Ensure backend is running

### Database connection fails
- Verify Neon connection string
- Check SSL settings (should be enabled for Neon)
- Ensure database exists

---

## Support

For issues, check:
1. Backend logs for error messages
2. Browser console for frontend errors
3. Network tab to see API requests/responses

## Repository Structure
```
test-management-system/
├── backend/
│   ├── server.js           # Main server with PostgreSQL support
│   ├── database.js         # SQLite config (local)
│   ├── database-pg.js      # PostgreSQL config (production)
│   ├── seed-data.js        # Test data generator
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/     # React components
│   │   └── lib/api.ts      # API client
│   └── .env.example        # Environment template
└── DEPLOYMENT.md           # This file
```
