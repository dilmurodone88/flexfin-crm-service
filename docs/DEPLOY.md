# Joylashtirish

## Docker (tavsiya): nginx (TLS, HTTP/2, gzip) + NestJS

Talab: Docker 24+, Linux xost, xostdan `FlexFin` SQL Server'ga TCP yo'l (1433). Docker **Windows xostda** (109) odatda ishlamaydi: Linux xost kerak.

```bash
cp .env.example .env            # API_KEY=$(openssl rand -hex 32), DATABASE_URL, ALLOWED_IPS
./scripts/gen-certs.sh          # yoki certs/server.crt va server.key ga kompaniya sertifikatini qo'ying
docker compose up -d --build
curl -sk https://localhost/health
```

- Faqat nginx (80/443) tashqariga ochiq; API konteyneri `expose` (ichki tarmoq 172.28.0.0/24). `TRUSTED_PROXIES=172.28.0.10` (nginx).
- nginx: HTTP/2, TLS 1.2/1.3, gzip (JSON), 80→443, `limit_req`, GET/HEAD/OPTIONS dan boshqasi 405, SSE uchun buferlashsiz alohida `location`, `X-Forwarded-For` qo'shilmaydi, **yoziladi** (soxtalashtirib bo'lmaydi).
- API: `read_only` fayl tizimi, `cap_drop: ALL`, `no-new-privileges`, 512 MB, tini (to'g'ri signal), HEALTHCHECK, graceful shutdown (SSE oqimlar yopiladi).
- Loglar: `docker compose logs -f api`; Docker `json-file` 20 MB × 10 fayl aylanadi.
- Prisma Client `Dockerfile`da `prisma generate` bilan quriladi, shuning uchun `prisma/schema.prisma` (docs/SCHEMA.md) image ichida bo'lishi kerak.

## Docker'siz (Windows Server, 109)

1. Node 20+ (portable `C:\flexfin-crm-service\node` bor), kodni ko'chiring, so'ng:
   ```powershell
   $env:PATH='C:\flexfin-crm-service\node;'+$env:PATH
   npm ci ; npx prisma generate ; npx nest build
   ```
2. `.env`: Windows autentifikatsiya yoki SQL login, `LOG_FILE=true`, `COMPRESS=true`.
3. Avtomatik ishga tushirish va qayta ko'tarish: `powershell -ExecutionPolicy Bypass -File deploy\windows\install-service.ps1`.
4. Firewall: 8085 faqat 21.4 (yoki nginx xosti) uchun.

## Baza tomonidan himoya (tavsiya)

`sql/readonly-login.sql`: `db_datareader` + `isUser.Password/PasswordSalt` uchun `DENY`. Skriptni **o'zingiz** ko'rib chiqib ishga tushirasiz; servis hech qachon bajarmaydi.

## Yangilash

`docker compose up -d --build` (nginx uzilmaydi, API healthcheck o'tgach almashadi). Muammo bo'lsa: `docker compose logs api`, `GET /ready`, `GET /metrics`.
