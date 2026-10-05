// Prüft alle Texte der Anlagenzeichnung auf Überschneidungen.
// Arbeitet in viewBox-Einheiten (Bildschirm-Rechtecke werden zurückgerechnet).
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
// Ablage für Chrome-Profil und Bildschirmfotos (wird nicht versioniert).
const OUT = process.env.SIM_OUT || path.join(os.tmpdir(), 'sim-pruefung');
mkdirSync(OUT, { recursive: true });
import fs from 'node:fs';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9100 + Math.floor(Math.random() * 90);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${OUT}/txt-${Date.now()}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 50; i++) { try { const t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page'); ws = new WebSocket(t.webSocketDebuggerUrl); break; } catch { await sleep(200); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: process.argv[2] }); await sleep(1500);
await ev(`[...document.querySelectorAll('button')].find(b=>/Verstanden/.test(b.textContent))?.click()`);
const scenario = process.argv[3] || 'full';
// Szenario: Protokoll und Meldungen füllen, Abläufe laufen lassen.
if (scenario === 'full') {
  await ev(`document.querySelector('[data-action=saltOut]').click()`); await sleep(11000);
  await ev(`document.querySelector('[data-action=brineOut]').click()`); await sleep(12500);
  await ev(`document.querySelector('[data-action=saltIn]').click()`); await sleep(3500);
  await ev(`document.querySelector('[data-action=produce]').click()`); await sleep(5000);
}
const res = await ev(`(()=>{
  const svg=document.querySelector('.ps-svg'); const ctm=svg.getScreenCTM(); const inv=ctm.inverse();
  const toUnits=(r)=>{const p1=new DOMPoint(r.left,r.top).matrixTransform(inv), p2=new DOMPoint(r.right,r.bottom).matrixTransform(inv);return {x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y};};
  const vis=(el)=>{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity!==0&&!el.closest('[opacity="0"]')};
  const items=[];
  svg.querySelectorAll('text').forEach(t=>{ if(!t.textContent.trim()||!vis(t)) return; if(t.closest('.ps-vehicle')) return; const r=t.getBoundingClientRect(); if(!r.width) return; items.push({kind:'text',label:t.textContent.trim().slice(0,28),cls:t.getAttribute('class')||'',fs:getComputedStyle(t).fontSize,...toUnits(r)}); });
  svg.querySelectorAll('.ps-marker circle').forEach(c=>{ const r=c.getBoundingClientRect(); items.push({kind:'marker',label:'Pos '+c.nextElementSibling.textContent,...toUnits(r)}); });
  const out=[]; const pad=0.5;
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j]; if(a.kind==='marker'&&b.kind==='marker') continue;
    // Positionsnummer und ihr eigener Text gehören zusammen
    if((a.kind==='marker'&&b.cls==='')||(b.kind==='marker'&&a.cls==='')) continue;
    const ox=Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1), oy=Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1);
    if(ox>pad&&oy>pad) out.push(a.label+'  ×  '+b.label+'  ('+ox.toFixed(1)+'×'+oy.toFixed(1)+')');}
  // Texte, die über den sichtbaren Ausschnitt hinausragen
  const vb=svg.viewBox.baseVal; items.filter(t=>t.kind==='text').forEach(t=>{ if(t.x1<vb.x-0.5||t.x2>vb.x+vb.width+0.5||t.y1<vb.y-0.5||t.y2>vb.y+vb.height+0.5) out.push('außerhalb: '+t.label); });
  // Texte in Zellen des SalzManager-Bildschirms und in Behältern: gegen ihre Rahmen prüfen
  const screen=svg.querySelector('.ps-screen > rect').getBoundingClientRect(); const su=toUnits(screen);
  items.filter(t=>t.kind==='text').forEach(t=>{ if(t.x1>=su.x1-1&&t.y1>=su.y1-1&&t.y2<=su.y2+1&&t.x1<su.x2){ if(t.x2>su.x2-4) out.push('ragt aus Bildschirm: '+t.label); } });
  const sizes={}; items.filter(t=>t.kind==='text').forEach(t=>{sizes[t.cls]=t.fs});
  return {n:items.length, out, sizes};
})()`);
console.log('geprüfte Elemente:', res.n);
console.log('Schriftgrößen (viewBox-px):', JSON.stringify(res.sizes));
console.log(res.out.length ? res.out.join('\n') : 'keine Überschneidungen');
console.log('Funde:', res.out.length);
if (process.argv[4]) { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(process.argv[4], Buffer.from(s.result.data, 'base64')); }
ws.close(); chrome.kill();
