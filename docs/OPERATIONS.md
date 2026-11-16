# Ekspluatatsiya (runbook)

## Doimiy ishlash (o'chmaydi)

| Qatlam | Mexanizm |
|---|---|
| Jarayon yiqilsa | Docker `restart: unless-stopped` / Windows `run.ps1` nazoratchisi (3 s, yiqilish takrorlansa 60 s gacha) |
| Server o'chib-yonsa | Docker daemon avtostart / Task Scheduler `AtStartup` |
| Nazoratchi o'lsa | Task Scheduler har 5 daqiqada tekshiradi (`MultipleInstances IgnoreNew`) |
| Baza uzilsa | Prisma qayta ulanadi; GET bir marta qayta uriniladi; SSE `error` hodisasi yuboradi va davom etadi; katalog o'qilmagan bo'lsa qayta uriniladi |
| Ishlamayotgan bo'lsa | Docker `HEALTHCHECK` (`/health`), orkestratorlar uchun `/ready` (bazaga ulanish + katalog) |
| To'xtatish | SIGTERM: yangi so'rov rad, ochiq so'rov/oqimlar yopilguncha ≤10 s kutiladi |

Real vaqt mijozlari **uzilsa qayta ulansin**: SSE'da `Last-Event-ID` (LSN) bilan qolgan joydan davom etadi, yo'qotish bo'lmaydi.

## Kundalik buyruqlar

```bash
# Docker
docker compose ps && docker compose logs -f api
curl -sk https://localhost/health ; curl -sk -H "x-api-key: $KEY" https://localhost/ready
docker compose up -d --build            # yangilash
```
```powershell
# Windows
Get-ScheduledTask flexfin-crm-service | Get-ScheduledTaskInfo
Invoke-RestMethod http://127.0.0.1:8085/health
Get-Content C:\flexfin-crm-service\logs\supervisor.log -Tail 20     # nega qayta ko'tarildi
Stop-ScheduledTask flexfin-crm-service ; Start-ScheduledTask flexfin-crm-service
```

## Nosozliklar jadvali

| Belgi | Sabab | Nima qilish |
|---|---|---|
| `/health` 200, `catalog:false`, `/ready` 503 | baza yoki katalog hali o'qilmagan | baza ulanishini (`DATABASE_URL`, firewall 1433) tekshiring; o'zi qayta uriniladi |
| `expand`/`/full`/`raw`/feed 404 | katalog yuklanmagan | yuqoridagi bilan bir xil; log: "Katalog o'qilmadi" |
| 401 / 403 | kalit yoki IP | `API_KEY`, `ALLOWED_IPS`; nginx orqasida `TRUSTED_PROXIES` |
| 429 | tezlik / parallel / oqimlar | `RATE_LIMIT_PER_MIN`, `MAX_CONCURRENT`, `MAX_STREAMS` |
| 504 | baza sekin | og'ir filtr (indekssiz ustun), `DB_TIMEOUT_MS`, `take` ni kamaytiring |
| SSE uzilib qoladi | proksi buferlaydi | nginx `location = /v1/feed/stream` (buferlashsiz) ishlatilsin |
| Windows'da SQL'ga kirmaydi | SYSTEM + `integratedSecurity` | `.env` da SQL login (sql/readonly-login.sql) |

## Monitoring

`/metrics` (Prometheus): `flexfin_http_requests_total{route,status}`, `flexfin_http_request_duration_ms`, `flexfin_sse_streams`,
`flexfin_db_transient_errors`, `flexfin_models`. Tavsiya: alert `5xx > 1%`, `/ready` ≠ 200 (2 daqiqa), `flexfin_db_transient_errors` o'sishi.

## Loglar

JSON qator. Maydonlar: `reqId`, `req.method`, `req.path`, `req.params` (faqat nomlar), `req.ip` (haqiqiy mijoz), `res.status`, `responseTime`.
So'rov qiymatlari va `x-api-key` yozilmaydi. Muammoni `reqId` bo'yicha toping: mijoz `x-request-id` yuborsa shu qaytadi.
