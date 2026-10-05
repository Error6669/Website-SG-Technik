import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
import fs from 'node:fs';
const sizes = [[1920,1080],[1440,900],[1366,768],[1280,720],[1100,700],[1024,768],[390,664]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9200 + Math.floor(Math.random() * 90);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/pan-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errs = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errs.push(d.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result.value;
await send('Page.enable'); await send('Runtime.enable');
const url = process.argv[2];
await send('Page.navigate', { url }); await sleep(1500);
await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Page.navigate', { url }); await sleep(1500);
  await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
  const r = await ev(`(async()=>{
    const R=s=>document.querySelector(s).getBoundingClientRect();
    document.querySelector('[data-dialog=parts]').click(); await new Promise(r=>setTimeout(r,250));
    const d=document.querySelector('[data-dlg=parts]'); const b=d.querySelector('.ps-dlg-body'); const dr=d.getBoundingClientRect();
    const info=R('[data-dialog=info]'), parts=R('[data-dialog=parts]'), acts=R('.ps-actions'), svg=R('.ps-svg');
    const res={panel:d.classList.contains('is-panel'), modal: d.matches(':modal'), fits:b.scrollHeight<=b.clientHeight+1, font:b.style.fontSize,
      dTop:Math.round(dr.top), infoTop:Math.round(info.top), dBottom:Math.round(dr.bottom), roadBottom:Math.round(svg.bottom),
      dLeft:Math.round(dr.left), wantLeft:Math.round(Math.min(info.left,acts.left)), dRight:Math.round(dr.right), wantRight:Math.round(Math.max(parts.right,acts.right)), inView: dr.bottom<=innerHeight};
    return res})()`);
  if (w === 1440 || w === 390) { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`${OUT}/panel-${w}x${h}.png`, Buffer.from(s.result.data, 'base64')); }
  // schließen: Esc, dann erneut öffnen und per Klick daneben schließen
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(150);
  const afterEsc = await ev(`document.querySelector('[data-dlg=parts]').open`);
  let afterOutside = 'n/a';
  if (r.panel) {
    await ev(`document.querySelector('[data-dialog=parts]').click()`); await sleep(150);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 300, y: Math.round(h * 0.6), button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 300, y: Math.round(h * 0.6), button: 'left', clickCount: 1 });
    await sleep(150);
    afterOutside = await ev(`document.querySelector('[data-dlg=parts]').open`) ? 'bleibt offen' : 'zu';
  }
  const aligned = r.panel ? (Math.abs(r.dTop - r.infoTop) <= 1 && Math.abs(r.dBottom - r.roadBottom) <= 1 && Math.abs(r.dLeft - r.wantLeft) <= 1 && Math.abs(r.dRight - r.wantRight) <= 1) : null;
  console.log(`${w}×${h}: ${r.panel ? 'Feld' : r.modal ? 'Pop-up Mitte' : '?'} | passt ${r.fits ? 'ja' : 'NEIN'} (${r.font}) | ${r.panel ? `oben ${r.dTop}/${r.infoTop}, unten ${r.dBottom}/${r.roadBottom}, links ${r.dLeft}/${r.wantLeft}, rechts ${r.dRight}/${r.wantRight} → ${aligned ? 'bündig' : 'NICHT bündig'}` : 'im Bild ' + r.inView} | Esc ${afterEsc ? 'NICHT zu' : 'zu'} | Klick daneben: ${afterOutside}`);
}
console.log('JS-Fehler:', errs.length);
ws.close(); chrome.kill();
