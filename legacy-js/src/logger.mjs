// Tuzilgan (JSON qator) log: stdout + kunlik fayl (logs/access-YYYY-MM-DD.log), eskilari avtomatik tozalanadi.
// LOG_FILE=false  -> faqat stdout (Docker uchun: loglarni Docker yig'adi)
// LOG_DIR, LOG_RETENTION_DAYS (default 30; 0 = hech qachon o'chirmaslik)
import fs from "node:fs";
import path from "node:path";

const toFile = process.env.LOG_FILE !== "false";
const dir = process.env.LOG_DIR ?? "logs";
const keepDays = Number(process.env.LOG_RETENTION_DAYS ?? 30);
let stream = null;
let day = "";

function cleanup() {
  if (!(keepDays > 0)) return;
  try {
    for (const f of fs.readdirSync(dir)) {
      const m = /^access-(\d{4}-\d{2}-\d{2})\.log$/.exec(f);
      if (m && (Date.now() - Date.parse(m[1])) / 864e5 > keepDays) fs.unlinkSync(path.join(dir, f));
    }
  } catch { /* log tozalash xatosi ishni to'xtatmasin */ }
}

function out() {
  const d = new Date().toISOString().slice(0, 10);
  if (d !== day) {
    stream?.end();
    day = d;
    fs.mkdirSync(dir, { recursive: true });
    stream = fs.createWriteStream(path.join(dir, `access-${d}.log`), { flags: "a" });
    stream.on("error", () => {});
    cleanup();
  }
  return stream;
}

export function log(level, msg, extra = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...extra });
  (level === "error" ? console.error : console.log)(line);
  if (toFile) {
    try { out().write(line + "\n"); } catch { /* fayl yozilmasa ham servis ishlaydi */ }
  }
}
