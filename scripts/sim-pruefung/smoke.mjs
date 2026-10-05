import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
const pages = ['/', '/leistungen', '/produkte-technik', '/referenzen', '/anlagensimulation', '/anlagensimulation?bereich=silo', '/danke', '/impressum', '/datenschutz', '/cookie-richtlinie'];
const sizes = [[1440, 900], [390, 844]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9500 + Math.floor(Math.random() * 300);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/smoke-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); let issues = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') issues.push('JS-Fehler: ' + (d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text).split('\n')[0]);
  if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) issues.push('Konsole ' + d.params.type + ': ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
  if (d.method === 'Network.responseReceived' && d.params.response.status >= 400) issues.push('HTTP ' + d.params.response.status + ': ' + d.params.response.url);
  if (d.method === 'Network.loadingFailed' && !d.params.canceled) issues.push('Laden fehlgeschlagen: ' + d.params.errorText);
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Network.enable'); await send('Page.enable');
let total = 0;
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  for (const p of pages) {
    issues = [];
    await send('Page.navigate', { url: 'http://localhost:4399' + p });
    await sleep(1800);
    // Seite einmal ganz durchscrollen, damit scrollgekoppelte Animationen laufen.
    await send('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);})()`, awaitPromise: true });
    if (p.startsWith('/anlagensimulation')) {
      await send('Runtime.evaluate', { expression: `['produce','saltOut'].forEach(a=>document.querySelector('[data-action='+a+']')?.click())` });
      await sleep(4000);
    }
    await sleep(400);
    total += issues.length;
    console.log(`${w}px ${p}: ${issues.length ? '\n   ' + [...new Set(issues)].join('\n   ') : 'ok'}`);
  }
}
console.log('Probleme gesamt:', total);
ws.close(); chrome.kill();
