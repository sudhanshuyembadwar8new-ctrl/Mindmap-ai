# Start MongoDB
Start-Process -FilePath "C:\Users\Sudhanshu\.agent\mindmap-ai\mongodb\mongodb-win32-x86_64-windows-7.0.5\bin\mongod.exe" -ArgumentList '--dbpath="C:\Users\Sudhanshu\.agent\mindmap-ai\mongodb-data"' -NoNewWindow
Write-Host "MongoDB Starting..." -ForegroundColor Green

# Start Backend
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd C:\Users\Sudhanshu\.agent\mindmap-ai\server && npm run dev"
Write-Host "Backend Starting on port 5001..." -ForegroundColor Cyan

# Start Frontend
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd C:\Users\Sudhanshu\.agent\mindmap-ai\client && npm run dev"
Write-Host "Frontend Starting on port 5173..." -ForegroundColor Yellow

Write-Host "All services are starting. Visit http://localhost:5173 once ready!" -ForegroundColor White
