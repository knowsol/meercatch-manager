# status.ps1 - Show status of meercatch services
# Usage: .\scripts\status.ps1

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
Set-Location $WorkspaceRoot

# ── Read ports from .env ──────────────────────────────────────────────────────
$envFile = "$WorkspaceRoot\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env not found at $envFile" -ForegroundColor Red
    exit 1
}

$envTxt    = Get-Content $envFile -Raw
$webPort   = if ($envTxt -match '(?m)^WEB_PORT=(\d+)')   { $Matches[1] } else { "?" }
$apiPort   = if ($envTxt -match '(?m)^API_PORT=(\d+)')   { $Matches[1] } else { "?" }
$adminPort = if ($envTxt -match '(?m)^ADMIN_PORT=(\d+)') { $Matches[1] } else { "?" }
$serverIp  = if ($envTxt -match '(?m)^SERVER_IP=(.+)')   { $Matches[1].Trim() } else { "192.168.0.200" }

# ── Container status ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  meercatch — Container Status" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray
docker compose ps
Write-Host ""

# ── Health checks ─────────────────────────────────────────────────────────────
Write-Host "  Health Checks" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray

$checks = @(
    @{ Name = "web   "; Url = "http://$serverIp`:$webPort/health" },
    @{ Name = "api   "; Url = "http://$serverIp`:$apiPort/health" },
    @{ Name = "admin "; Url = "http://$serverIp`:$adminPort/health" }
)

foreach ($c in $checks) {
    try {
        $resp = Invoke-WebRequest -Uri $c.Url -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
            Write-Host "  [OK]  $($c.Name)  $($c.Url)" -ForegroundColor Green
        } else {
            Write-Host "  [??]  $($c.Name)  $($c.Url)  (HTTP $($resp.StatusCode))" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [ERR] $($c.Name)  $($c.Url)  (unreachable)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  URLs" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "    Web   http://$serverIp`:$webPort"         -ForegroundColor White
Write-Host "    API   http://$serverIp`:$apiPort/health"  -ForegroundColor White
Write-Host "    Admin http://$serverIp`:$adminPort"       -ForegroundColor White
Write-Host ""
