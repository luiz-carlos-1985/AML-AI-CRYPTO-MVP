Write-Host "========================================" -ForegroundColor Cyan
Write-Host "REINICIANDO BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Parando servidor Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "Servidor parado!" -ForegroundColor Green

Write-Host "[2/2] Iniciando backend..." -ForegroundColor Yellow
Set-Location backend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BACKEND REINICIANDO..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

npm run dev
