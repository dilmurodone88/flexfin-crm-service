# Docker'siz (Windows Server): o'chib-yonganda, jarayon o'lganda, hatto nazoratchi o'lganda ham qayta ko'tariladi.
#   Admin PowerShell:  powershell -ExecutionPolicy Bypass -File deploy\windows\install-service.ps1 -Root C:\flexfin-crm-service [-OpenFirewall -AllowFrom 192.168.21.4]
param(
  [string]$Root = "C:\flexfin-crm-service",
  [string]$Name = "flexfin-crm-service",
  [int]$Port = 8085,
  [switch]$OpenFirewall,
  [string]$AllowFrom = "192.168.21.4"
)
$ErrorActionPreference = "Stop"
$node = Join-Path $Root "node\node.exe"
if (-not (Test-Path $node)) { $node = (Get-Command node).Source }
if (-not (Test-Path (Join-Path $Root "dist\main.js"))) { throw "dist\main.js yo'q: avval npm ci ; npx prisma generate ; npx nest build" }
if (-not (Test-Path (Join-Path $Root ".env"))) { throw ".env yo'q: .env.example dan nusxa oling" }

# Nazoratchi: node o'lsa 3 soniyadan keyin qayta ko'taradi (tez-tez yiqilsa kutishni oshiradi, 60s gacha).
$runner = Join-Path $Root "run.ps1"
@"
`$ErrorActionPreference = 'Continue'
Set-Location '$Root'
New-Item -ItemType Directory -Force -Path logs | Out-Null
`$delay = 3
while (`$true) {
  Get-Content .env | Where-Object { `$_ -match '^\s*[^#\s][^=]*=' } | ForEach-Object { `$a = `$_ -split '=',2; [Environment]::SetEnvironmentVariable(`$a[0].Trim(), `$a[1].Trim().Trim('"'), 'Process') }
  `$t0 = Get-Date
  & '$node' dist\main.js
  `$code = `$LASTEXITCODE
  `$ran = ((Get-Date) - `$t0).TotalSeconds
  Add-Content logs\supervisor.log ("{0} node chiqdi (kod {1}, {2}s ishladi); {3}s dan keyin qayta ko'tariladi" -f (Get-Date -Format s), `$code, [int]`$ran, `$delay)
  Start-Sleep -Seconds `$delay
  if (`$ran -lt 30) { `$delay = [Math]::Min(`$delay * 2, 60) } else { `$delay = 3 }
}
"@ | Set-Content $runner -Encoding ascii

$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`""
# Kompyuter yonganda + har 5 daqiqada tekshiradi (nazoratchi o'lgan bo'lsa tiriltiradi; ishlayotgan bo'lsa IgnoreNew bilan e'tibor bermaydi)
$trigger = New-ScheduledTaskTrigger -AtStartup
$trigger.Repetition = (New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)).Repetition
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) `
  -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $Name -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null

if ($OpenFirewall) {
  Get-NetFirewallRule -DisplayName "$Name $Port" -ErrorAction SilentlyContinue | Remove-NetFirewallRule
  New-NetFirewallRule -DisplayName "$Name $Port" -Direction Inbound -Protocol TCP -LocalPort $Port -RemoteAddress $AllowFrom -Action Allow | Out-Null
  Write-Host "Firewall: $Port faqat $AllowFrom uchun ochildi."
}
Start-ScheduledTask -TaskName $Name
Write-Host "O'rnatildi va ishga tushirildi: $Name"
Write-Host "Tekshirish: Get-ScheduledTask $Name | Get-ScheduledTaskInfo ; Invoke-RestMethod http://127.0.0.1:$Port/health"
Write-Host "ESLATMA: SYSTEM hisobi Windows-autentifikatsiya bilan SQL'ga kira olmasligi mumkin. .env da faqat-o'qiydigan SQL login ishlating (sql/readonly-login.sql)."
