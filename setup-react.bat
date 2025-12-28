@echo off
echo ============================================================
echo SURAKSHA AI - Full Stack React Setup
echo ============================================================
echo.

echo Step 1: Installing root dependencies...
call npm install
echo.

echo Step 2: Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo To start the application:
echo   npm run dev     (Runs both server and client)
echo.
echo Or separately:
echo   npm run server  (Backend only on port 5000)
echo   npm run client  (Frontend only on port 3000)
echo.
pause
