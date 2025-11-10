@echo off
echo ========================================
echo  CryptoAML - Starting All Services
echo ========================================
echo.

echo [1/3] Starting ML Service...
start "ML Service" cmd /k "cd ml-service && python app.py"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  All services started!
echo ========================================
echo  ML Service:  http://localhost:8000
echo  Backend:     http://localhost:3001
echo  Frontend:    http://localhost:3000
echo ========================================
