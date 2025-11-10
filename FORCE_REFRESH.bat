@echo off
echo ========================================
echo FORCANDO ATUALIZACAO DO FRONTEND
echo ========================================
echo.

cd frontend

echo [1/4] Parando servidor...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Limpando cache do Vite...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Cache do Vite removido!
) else (
    echo Cache do Vite nao encontrado
)

echo [3/4] Limpando dist...
if exist dist (
    rmdir /s /q dist
    echo Dist removido!
) else (
    echo Dist nao encontrado
)

echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo SERVIDOR REINICIANDO...
echo ========================================
echo.
echo Pressione Ctrl+C para parar
echo.

npm run dev
