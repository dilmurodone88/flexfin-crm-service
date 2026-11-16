# Bitta buyruq: paketlar -> schema'ni bazadan o'qish (faqat o'qiydi) -> generate -> serverni ko'tarish.
# Ishga tushirish:  powershell -ExecutionPolicy Bypass -File .\up.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path .env)) { Write-Error ".env yo'q. .env.example dan nusxa oling va API_KEY ni to'ldiring."; exit 1 }
# .env ni jarayonga yuklash (Prisma CLI ham o'qiydi, server esa process.env dan)
Get-Content .env | Where-Object { $_ -match '^\s*[^#\s][^=]*=' } | ForEach-Object {
  $k, $v = $_ -split '=', 2
  [Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim().Trim('"'), 'Process')
}

if (-not (Test-Path node_modules)) { npm install }
# Eski modellarni olib tashlash (yaroqsiz bo'lsa db pull to'xtab qoladi): faqat generator + datasource qoladi
$p = 'prisma\schema.prisma'; $t = Get-Content $p -Raw; $i = $t.IndexOf('datasource db'); $j = $t.IndexOf('}', $i)
if ($i -ge 0 -and $j -gt $i) { $t.Substring(0, $j+1) | Set-Content $p -Encoding ascii }
npm run up
