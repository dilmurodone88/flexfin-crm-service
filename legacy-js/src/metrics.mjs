// Prometheus matn formatidagi metrikalar (tashqi paketsiz).
const BUCKETS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
const requests = new Map(); // "route|status" -> son
const hist = new Map(); // route -> { b: number[], sum, n }
const started = Date.now();
let dbErrors = 0;

export const metrics = {
  observe(route, status, ms) {
    const k = `${route}|${status}`;
    requests.set(k, (requests.get(k) ?? 0) + 1);
    let h = hist.get(route);
    if (!h) hist.set(route, (h = { b: BUCKETS.map(() => 0), sum: 0, n: 0 }));
    BUCKETS.forEach((le, i) => { if (ms <= le) h.b[i]++; });
    h.sum += ms;
    h.n++;
  },
  dbError() { dbErrors++; },
  render(gauges = {}) {
    const L = [];
    L.push("# TYPE flexfin_requests_total counter");
    for (const [k, n] of requests) {
      const [route, status] = k.split("|");
      L.push(`flexfin_requests_total{route="${route}",status="${status}"} ${n}`);
    }
    L.push("# TYPE flexfin_request_duration_ms histogram");
    for (const [route, h] of hist) {
      BUCKETS.forEach((le, i) => L.push(`flexfin_request_duration_ms_bucket{route="${route}",le="${le}"} ${h.b[i]}`));
      L.push(`flexfin_request_duration_ms_bucket{route="${route}",le="+Inf"} ${h.n}`);
      L.push(`flexfin_request_duration_ms_sum{route="${route}"} ${h.sum.toFixed(1)}`);
      L.push(`flexfin_request_duration_ms_count{route="${route}"} ${h.n}`);
    }
    L.push("# TYPE flexfin_db_errors_total counter", `flexfin_db_errors_total ${dbErrors}`);
    L.push("# TYPE flexfin_uptime_seconds gauge", `flexfin_uptime_seconds ${Math.round((Date.now() - started) / 1000)}`);
    for (const [name, v] of Object.entries(gauges)) L.push(`# TYPE flexfin_${name} gauge`, `flexfin_${name} ${v}`);
    return L.join("\n") + "\n";
  },
};
