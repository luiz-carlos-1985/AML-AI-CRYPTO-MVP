Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FORCANDO ATUALIZACAO DO FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "[1/4] Parando servidor Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "[2/4] Limpando cache do Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "Cache do Vite removido!" -ForegroundColor Green
} else {
    Write-Host "Cache do Vite nao encontrado" -ForegroundColor Gray
}

Write-Host "[3/4] Limpando dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Dist removido!" -ForegroundColor Green
} else {
    Write-Host "Dist nao encontrado" -ForegroundColor Gray
}

Write-Host "[4/4] Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SERVIDOR REINICIANDO..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

npm run dev
