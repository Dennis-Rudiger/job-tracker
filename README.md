<div align="center">

# Job Tracker

Track your job hunt, stay organized, and keep momentum.

Live app: https://my-job-tracked.vercel.app/

</div>

## Features
- Authentication: register, login, profile update
- Jobs CRUD: add, edit, delete, list
- Status tracking: applied, interview, offer, rejected
- Dashboard stats: totals, by status, last 30 days
- CSV export of jobs
- Date fields: date applied, interview dates, offer/rejected dates
- Responsive UI with Tailwind CSS
- Light/Dark mode toggle (persisted)
- SEO: meta tags, Open Graph/Twitter, robots.txt, sitemap.xml

## Tech Stack
Backend
- Node.js, Express, Mongoose (MongoDB)
- JWT auth (jsonwebtoken), bcryptjs
- CORS, Helmet, Morgan, express-validator

Frontend
- Vite, React, React Router
- Axios with interceptors
- Context API (auth and theme)
- Tailwind CSS

Deploy
- Frontend: Vercel
- Backend: Render

## Project Structure
```
client/   # Vite + React app
server/   # Express API
```

## Environment Variables

Server (`server/.env`)
- MONGO_URI=mongodb  uri
- MONGO_DB_NAME=job-tracker
- JWT_SECRET=change_me
- JWT_EXPIRES_IN=7d
- PORT=5000
- NODE_ENV=production|development
- CORS_ORIGIN=https://yourapp.vercel.app,http://localhost:3000

Client (`client/.env`)
- VITE_API_URL=yourserverapp
	- Note: the client ensures the trailing `/api` path automatically; both forms work:
		- https://yourserverapp.onrender.com
		- https://yourserverapp.onrender.com/api

## Local Development (Windows PowerShell)

1) Install dependencies
```powershell
# from repo root
npm install -w server
npm install -w client
```

2) Configure env files
- Copy `server/.env.example` to `server/.env`, set values
- Copy `client/.env.example` to `client/.env`, set VITE_API_URL (default http://localhost:5000)

3) Run
```powershell
# terminal 1
npm run dev:server

# terminal 2
npm run dev:client
```

4) URLs
- API: http://localhost:5000/api/health
- App: http://localhost:3000

## Production Deployment

Frontend (Vercel)
- Add env: VITE_API_URL=https://yourserver.onrender.com (or .../api)
- Ensure SPA rewrite is configured (see `client/vercel.json`)
- Redeploy

Backend (Render)
- Add envs from Server section
- Set `CORS_ORIGIN` to include your Vercel domain
- Deploy and verify `/api/health`

## API Overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET/PATCH /api/auth/me`
- Jobs: `GET /api/jobs`, `POST /api/jobs`, `GET /api/jobs/:id`, `PATCH /api/jobs/:id`, `DELETE /api/jobs/:id`
- Jobs export: `GET /api/jobs/export.csv`
- Stats: `GET /api/jobs/stats`

## Notes & Tips
- If you see 404 for auth in production, ensure client hits `/api/...` (we normalize that in the client).
- A 401 means token missing/expired; login again.
- To allow multiple frontends, add them comma-separated to `CORS_ORIGIN`.

## Roadmap
- Jobs filters/search/sorting, tags
- Password reset and email verification
- XLSX import, reminders and iCal export
- Stripe paywall (Pro features): reminders, unlimited jobs, attachments
- E2E tests (Playwright) and Sentry monitoring

## License
MIT
