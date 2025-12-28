@echo off
echo ============================================================
echo Starting SURAKSHA AI Full Stack Application
echo ============================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ============================================================
echo.

start cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul
start cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Check the new terminal windows for logs
echo.
pause
