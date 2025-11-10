Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTANDO API DE WALLETS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obter token (você precisa fazer login primeiro)
Write-Host "Para testar, você precisa de um token JWT." -ForegroundColor Yellow
Write-Host "1. Faça login no frontend" -ForegroundColor Yellow
Write-Host "2. Abra DevTools (F12)" -ForegroundColor Yellow
Write-Host "3. Vá em Application > Local Storage" -ForegroundColor Yellow
Write-Host "4. Copie o valor de 'token'" -ForegroundColor Yellow
Write-Host ""
$token = Read-Host "Cole o token aqui"

Write-Host ""
Write-Host "Testando GET /api/wallets..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/wallets" -Method Get -Headers $headers
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "RESPOSTA DA API:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $response | ForEach-Object {
        Write-Host "Wallet: $($_.label)" -ForegroundColor Cyan
        Write-Host "  Address: $($_.address)" -ForegroundColor Gray
        Write-Host "  Blockchain: $($_.blockchain)" -ForegroundColor Gray
        Write-Host "  Risk Level: $($_.riskLevel)" -ForegroundColor Gray
        
        if ($null -ne $_._count) {
            Write-Host "  _count:" -ForegroundColor Green
            Write-Host "    transactions: $($_._count.transactions)" -ForegroundColor Green
            Write-Host "    alerts: $($_._count.alerts)" -ForegroundColor Green
        } else {
            Write-Host "  _count: NULL/UNDEFINED" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    Write-Host "JSON completo:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host ""
    Write-Host "ERRO:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
