@echo off
echo Testing API endpoint...
curl -X GET http://localhost:3000/api/wallets -H "Authorization: Bearer YOUR_TOKEN_HERE"
pause
