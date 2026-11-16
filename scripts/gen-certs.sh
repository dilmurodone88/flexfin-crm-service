#!/usr/bin/env bash
# O'z-o'zidan imzolangan TLS sertifikat (ichki tarmoq uchun). Ishlab chiqarishda kompaniya CA sertifikatini qo'ying: certs/server.crt, certs/server.key
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p certs
HOSTNAME_CN="${1:-flexfin-crm-service.local}"
[ -f certs/server.crt ] && { echo "certs/server.crt allaqachon bor, tegmadim."; exit 0; }
openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
  -keyout certs/server.key -out certs/server.crt \
  -subj "/CN=${HOSTNAME_CN}" -addext "subjectAltName=DNS:${HOSTNAME_CN},IP:127.0.0.1"
chmod 600 certs/server.key
echo "Tayyor: certs/server.crt, certs/server.key (${HOSTNAME_CN})"
