# @module config | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
$ErrorActionPreference = "Stop"
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install
Write-Host "Installing backend dependencies (MongoDB/Mongoose)..." -ForegroundColor Cyan
npm --prefix vendora-backend install
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm --prefix vendora-frontend install
if (-not (Test-Path "vendora-backend/.env")) {
  Copy-Item "vendora-backend/.env.example" "vendora-backend/.env"
  Write-Host "Created vendora-backend/.env." -ForegroundColor Yellow
}
$mongo = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongo) {
  if ($mongo.Status -ne 'Running') {
    Write-Host "Starting MongoDB Windows service..." -ForegroundColor Cyan
    try { Start-Service MongoDB } catch { Write-Host "Could not start MongoDB service automatically. Start it manually or run PowerShell as Administrator." -ForegroundColor Yellow }
  }
  Write-Host "MongoDB service is running." -ForegroundColor Green
} else {
  Write-Host "MongoDB Windows service was not found. Start mongod manually or put your MongoDB Atlas URI in vendora-backend/.env." -ForegroundColor Yellow
}
Write-Host "Next: npm run seed" -ForegroundColor Green
Write-Host "Then: npm run dev" -ForegroundColor Green
