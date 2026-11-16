# Ichkarida sinash: servis ishlab turgan paytda boshqa PowerShell oynasida ishga tushiring.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env = @{}
Get-Content .env | Where-Object { $_ -match '^\s*[^#\s][^=]*=' } | ForEach-Object { $k,$v = $_ -split '=',2; $env[$k.Trim()] = $v.Trim().Trim('"') }
$base = "http://127.0.0.1:" + $(if ($env.PORT) { $env.PORT } else { "8085" })
$h = @{ "x-api-key" = $env.API_KEY }
"health: " + (Invoke-RestMethod "$base/health").ok
$m = (Invoke-RestMethod "$base/v1/models" -Headers $h).data
"modellar soni: " + $m.Count
$pref = 'Loan','LoanApplication','BaseClient','Person','PaymentTransaction'
$pick = $pref | Where-Object { $m.model -contains $_ } | Select-Object -First 1
if (-not $pick) { $pick = $m[0].model }
"namuna model: $pick"
$r = Invoke-RestMethod "$base/v1/$pick`?take=2" -Headers $h
"qaytgan yozuv: " + $r.count
$r.data | ConvertTo-Json -Depth 4 -Compress
