import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
import fs from 'node:fs';
const sizes = [[1920,1080],[1680,1050],[1440,900],[1366,768],[1280,720],[1024,768],[820,1180],[768,1024],[430,932],[390,844],[390,664],[375,667],[360,740]];
const url = process.argv[2];
const shots = (process.argv[3] || '').split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/fit-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
// Hinweis „Verstanden“ einmal bestätigen, danach gilt der normale Seitenaufruf.
await send('Page.navigate', { url }); await sleep(1500);
await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()` });
let fails = 0;
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Page.navigate', { url }); await sleep(1600);
  const notice = (await send('Runtime.evaluate', { expression: `!!document.querySelector('dialog[open]')`, returnByValue: true })).result.result.value;
  if (notice) { await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()` }); await sleep(300); }
  const r = (await send('Runtime.evaluate', { returnByValue: true, expression: `(()=>{const vh=innerHeight;const svg=document.querySelector('.ps-svg').getBoundingClientRect();const acts=[...document.querySelectorAll('.ps-act')].map(a=>a.getBoundingClientRect());const lowest=Math.max(...acts.map(a=>a.bottom));const st=document.querySelector('.ps-stage').getBoundingClientRect();return {vh, scrollY, svgTop:Math.round(svg.top), svgBottom:Math.round(svg.bottom), svgW:Math.round(svg.width), svgH:Math.round(svg.height), actsBottom:Math.round(lowest), side:getComputedStyle(document.querySelector('.ps-main')).display, fit:getComputedStyle(document.querySelector('.ps')).getPropertyValue('--ps-fit')}})()` })).result.result.value;
  const ok = r.svgBottom <= r.vh && r.actsBottom <= r.vh && r.scrollY === 0;
  if (!ok) fails++;
  console.log(`${String(w).padStart(4)}×${String(h).padEnd(4)} ${ok ? 'OK  ' : 'FEHLT'} Zeichnung ${r.svgW}×${r.svgH} (Unterkante ${r.svgBottom}), Knöpfe bis ${r.actsBottom} von ${r.vh}${r.side === 'grid' ? ', Knöpfe rechts' : ''}${notice ? ' [Hinweis war offen]' : ''}`);
  if (shots.includes(`${w}x${h}`)) { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`${OUT}/fit-${w}x${h}.png`, Buffer.from(s.result.data, 'base64')); }
}
console.log('nicht passend:', fails);
ws.close(); chrome.kill();
