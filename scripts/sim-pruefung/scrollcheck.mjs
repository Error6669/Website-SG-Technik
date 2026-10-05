import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
import fs from 'node:fs';
const sizes = [[2560,1440],[1920,1080],[1680,1050],[1440,900],[1366,768],[1280,720],[1100,700],[1024,768],[768,1024],[390,844],[390,664]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9000 + Math.floor(Math.random() * 40);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/scr-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result.value;
await send('Page.enable'); await send('Runtime.enable');
const url = process.argv[2];
await send('Page.navigate', { url }); await sleep(1500);
await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
const shots = (process.argv[3] || '').split(',');
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Page.navigate', { url }); await sleep(1600);
  await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`); await sleep(200);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: w / 2, y: h / 2, deltaX: 0, deltaY: 800 }); await sleep(400);
  const r = await ev(`(()=>{const f=document.querySelector('body footer').getBoundingClientRect();const acts=[...document.querySelectorAll('.ps-act')].map(a=>a.getBoundingClientRect().bottom);const svg=document.querySelector('.ps-svg').getBoundingClientRect();return {lock:document.documentElement.classList.contains('ps-noscroll'),scrollY:Math.round(scrollY),docH:document.documentElement.scrollHeight,vh:innerHeight,footerBottom:Math.round(f.bottom),footerTop:Math.round(f.top),actsBottom:Math.round(Math.max(...acts)),svg:Math.round(svg.width)+'×'+Math.round(svg.height)}})()`);
  const desktop = r.lock;
  const ok = desktop ? r.scrollY === 0 && r.docH <= r.vh && r.footerBottom <= r.vh : true;
  console.log(`${String(w).padStart(4)}×${String(h).padEnd(4)} ${desktop ? 'gesperrt' : 'scrollbar'} | nach Mausrad scrollY=${r.scrollY} | Seite ${r.docH}/${r.vh} | Fußzeile ${r.footerTop}–${r.footerBottom} | Zeichnung ${r.svg} | ${ok ? 'OK' : 'FEHLER'}`);
  if (shots.includes(`${w}x${h}`)) { await ev('scrollTo(0,0)'); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`${OUT}/scr-${w}x${h}.png`, Buffer.from(s.result.data, 'base64')); }
}
ws.close(); chrome.kill();
