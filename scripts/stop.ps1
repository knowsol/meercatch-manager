# stop.ps1 - Stop all meercatch services
# Usage: .\scripts\stop.ps1

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
Set-Location $WorkspaceRoot

Write-Host "Stopping meercatch services..." -ForegroundColor Cyan
docker compose down

Write-Host "All containers stopped." -ForegroundColor Green
