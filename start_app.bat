@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && (npm run mysql:start || echo Local MySQL bootstrap skipped) && npm start"

echo Starting Frontend Dev Server...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo Both servers should now be starting.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
