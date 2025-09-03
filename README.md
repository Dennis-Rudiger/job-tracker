This is a simple job tracking app
## MVP
Login/register
Clean Hero section with a dashboard
Add Job Application
Status tracking
View applications
Edit/delete applications
store data in database(Mongodb)


## BACKEND STACK
Express for REST API
Mongoose for MongoDB models
JWT + bcrypt
dotenv for config


## FRONTEND STACK
React Router for navigation
Axios for API requests
Content API for auth + global state
Tailwind CSS for styling

## WORKFLOW
server runs on localhost:5000
client runs on localhost:3000

client makes API calls -> Express -> MongoDB

## Setup (Windows PowerShell)

1) Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas URI)

2) Configure environment variables
- Edit `server/.env` and set:
	- `MONGO_URI` to your connection string (for local: mongodb://127.0.0.1:27017/job-tracker)
	- `JWT_SECRET` to a strong random string

3) Install dependencies
```
# from repo root
npm install -w server
npm install -w client
```

4) Run the servers
```
# terminal 1
npm run dev:server

# terminal 2
npm run dev:client
```

5) URLs
- API: http://localhost:5000/api/health
- App: http://localhost:3000

6) First run checklist
- Register a user, then login
- Add a job (company, position). It should show in Jobs list
- Edit/delete jobs as needed

Troubleshooting
- If Mongo fails to connect, ensure the service is running and the `MONGO_URI` uses 127.0.0.1
- If 401 appears after some time, your token may have expired; login again