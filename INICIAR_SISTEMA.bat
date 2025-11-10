@echo off
echo ========================================
echo   CryptoAML - Sistema Completo
echo ========================================
echo.
echo Iniciando Backend e Frontend...
echo.
echo IMPORTANTE: Duas janelas serao abertas:
echo   1. Backend (porta 3001)
echo   2. Frontend (porta 3000)
echo.
echo Aguarde alguns segundos para tudo iniciar...
echo.
pause

start "CryptoAML Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "CryptoAML Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Sistema Iniciado!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
