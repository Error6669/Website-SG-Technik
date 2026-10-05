import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
import fs from 'node:fs';
const sizes = [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[390,664],[375,667],[360,740],[320,568]];
const shots = (process.argv[3] || '').split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 150);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/dlg-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errs = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errs.push(d.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Page.navigate', { url: process.argv[2] }); await sleep(1500);
await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
let fails = 0;
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Page.navigate', { url: process.argv[2] }); await sleep(1500);
  await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
  const tools = await ev(`(()=>{const t=[...document.querySelectorAll('.ps-tool')].map(b=>b.getBoundingClientRect());return t.every(r=>r.width>0&&r.bottom<=innerHeight&&r.right<=innerWidth)})()`);
  const out = [];
  for (const k of ['info', 'parts']) {
    const r = await ev(`(async()=>{document.querySelector('[data-dialog=${k}]').click();await new Promise(r=>setTimeout(r,250));const d=document.querySelector('[data-dlg=${k}]');const b=d.querySelector('.ps-dlg-body');const rd=d.getBoundingClientRect();const res={open:d.open,fits:b.scrollHeight<=b.clientHeight+1,inView:rd.top>=0&&rd.bottom<=innerHeight&&rd.right<=innerWidth,font:b.style.fontSize,cols:getComputedStyle(b.firstElementChild).gridTemplateColumns.split(' ').length};return res})()`);
    if (shots.includes(`${w}x${h}-${k}`)) { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`${OUT}/dlg-${w}x${h}-${k}.png`, Buffer.from(s.result.data, 'base64')); }
    await ev(`document.querySelector('[data-dlg=${k}] [data-close]').click()`);
    const closed = await ev(`!document.querySelector('[data-dlg=${k}]').open`);
    const ok = r.open && r.fits && r.inView && closed;
    if (!ok) fails++;
    out.push(`${k}: ${ok ? 'OK' : 'FEHLER'} Schrift ${r.font}, ${r.cols} Sp.${r.inView ? '' : ' ragt raus'}${closed ? '' : ' schließt nicht'}`);
  }
  if (!tools) fails++;
  console.log(`${String(w).padStart(4)}×${String(h).padEnd(4)} Knöpfe ${tools ? 'sichtbar' : 'FEHLEN'} | ${out.join(' | ')}`);
}
console.log('Fehler:', fails, errs.length ? 'JS: ' + errs.join(' / ') : '');
ws.close(); chrome.kill();
