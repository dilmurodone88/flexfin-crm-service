param([string]$Name = "flexfin-crm-service", [int]$Port = 8085)
Stop-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
Unregister-ScheduledTask -TaskName $Name -Confirm:$false -ErrorAction SilentlyContinue
Get-NetFirewallRule -DisplayName "$Name $Port" -ErrorAction SilentlyContinue | Remove-NetFirewallRule
Write-Host "$Name olib tashlandi (fayllar va ma'lumotlarga tegilmadi)."
