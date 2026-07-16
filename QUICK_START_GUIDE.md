# DeporteHN - Quick Start Guide

## Clone & Setup (5 minutes)

```bash
# Navigate to your workspace
cd /path/to/workspace

# Clone or extract the project
git clone <repo-url>
cd Partidos

# Install dependencies for backend
cd backend
npm install

# Set up backend environment
cp .env.example .env
# Edit .env if needed

# Initialize database
npx prisma migrate dev

# Install dependencies for frontend
cd ../frontend
npm install

# Set up frontend environment
cp .env.example .env
```

## Start Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Server runs at http://localhost:4000
# API available at http://localhost:4000/api
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# App runs at http://localhost:3000
```

### Terminal 3 (optional): Tests
```bash
cd backend
npm run test
```

## Verify Installation

1. **Backend Health**: `curl http://localhost:4000/api/health`
   - Expected: `{"status":"ok"}`

2. **Frontend**: Open http://localhost:3000 in browser
   - You should see DeporteHN dashboard

3. **API Test**: 
   ```bash
   curl http://localhost:4000/api/categories
   # Should return JSON array (may be empty)
   ```

---

## Folder Layout

```
Partidos/
├── backend/          ← Express.js API server
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env          ← Database URL, PORT, etc.
│
├── frontend/         ← Next.js React app
│   ├── app/
│   ├── src/
│   ├── package.json
│   └── .env.local    ← API URL
│
└── README.md
```

---

## Key Dependencies

### Backend
- `express@4.18.2` - Web framework
- `@prisma/client@5.6.0` - Database ORM
- `typescript@5.5.0` - Type safety
- `helmet@7.2.0` - Security headers
- `cors@2.8.5` - CORS middleware

### Frontend
- `next@13.5.6` - React framework
- `react@18.2.0` - UI library
- `tailwindcss` - Styling (via CDN)

---

## Critical Files to Know

### Backend
- `backend/src/server.ts` - Entry point
- `backend/prisma/schema.prisma` - Database schema
- `backend/src/infrastructure/http/routes/` - API endpoints

### Frontend
- `frontend/app/page.tsx` - Home page
- `frontend/src/features/home/HomeScreen.tsx` - Main dashboard
- `frontend/src/lib/apiClient.ts` - API communication

---

## Common Troubleshooting

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database errors
```bash
# Reset database
npx prisma migrate reset

# View database UI
npx prisma studio
```

### Port in use (Port 4000)
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

### Port in use (Port 3000)
```bash
# Use different port
PORT=3001 npm run dev
```

### TypeScript errors
```bash
# Regenerate Prisma types
npx prisma generate

# Clear build cache
rm -rf .next dist
```

---

## Environment Variables Reference

### Backend (.env)
```
DATABASE_URL=file:./dev.db
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_TELEMETRY_DISABLED=1
```

---

## API Quick Reference

### Create a Category
```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Fútbol Mayor","color":"#2563eb"}'
```

### List Categories
```bash
curl http://localhost:4000/api/categories
```

### Create a Team
```bash
curl -X POST http://localhost:4000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Real Madrid",
    "categoryId":"<category-id>",
    "crestUrl":"https://example.com/logo.png"
  }'
```

### List Teams in Category
```bash
curl http://localhost:4000/api/categories/<category-id>/teams
```

---

## Database Schema Overview

- **Category**: League/tournament divisions
- **Team**: Teams in a category
- **Player**: Players on teams
- **Match**: Games between teams
- **PlayerMatchStat**: Player performance in matches
- **Sponsor**: League sponsors

---

## Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Next Steps

1. ✅ Install all dependencies
2. ✅ Start backend and frontend
3. ✅ Verify they're running
4. Create test data (categories, teams, players)
5. Test API endpoints
6. Build custom UI components
7. Deploy to production

---

## Files You're Using

All of these are already in your project:

| File | Purpose |
|------|---------|
| `backend/package.json` | Backend dependencies |
| `frontend/package.json` | Frontend dependencies |
| `backend/prisma/schema.prisma` | Database structure |
| `backend/.env` | Backend config |
| `frontend/.env` | Frontend config |

No additional libraries or files needed - just run the commands above!

---

## Support Resources

### Documentation in Project
- `README.md` - Full project overview
- `backend/src/__tests__/` - Test examples
- API endpoints in `backend/src/infrastructure/http/routes/`

### Useful Tools
- Postman: Test API endpoints
- Prisma Studio: `npx prisma studio`
- Browser DevTools: Debug frontend

---

## Time Estimate

- Setup: 5 minutes
- First test: 2 minutes
- Total: ~7 minutes to working development environment

Good luck! 🚀
