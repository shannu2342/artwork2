@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node index.js"

echo Starting Frontend Dev Server...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo Both servers should now be starting. The application will be available at http://localhost:5173
