// Weiches Mausrad für Safari auf den Seiten mit Winterdienst-Straße.
//
// Safari scrollt beim Mausrad ruckweise: Die Scroll-Position ändert sich nur
// etwa alle 100 ms um eine Raste (4–75 px), die ganze Seite springt — und mit
// ihr das Fahrzeug, das auf der Straße liegt. Chrome rollt Rasten selbst aus,
// das Touchpad liefert ohnehin in jedem Bild eine neue Position.
//
// Deshalb rollt dieses Skript in Safari Mausrad-Rasten selbst weich aus.
// Touchpad, Tastatur, Bildlaufleiste und alles, was in einem eigenen
// scrollbaren Bereich liegt, bleiben beim Browser.
//
// Safari meldet Mausrad und Touchpad mit gleich aufgebauten Werten
// (wheelDeltaY = −3 × deltaY), und beim schnellen Drehen kommen auch
// Mausrad-Ereignisse in jedem Bild. Gemessen an Maus und Touchpad eines Mac
// unterscheiden sie sich so:
//   - Mausrad: Eine Geste beginnt mit genau ±4 px, danach Werte mit
//     Nachkommastellen (33.7, 127.56 …), deltaX immer 0.
//   - Touchpad: nur ganze Zahlen, beginnt mit ±1 oder ±2, deltaX fast immer
//     ungleich 0.
// Entschieden wird je Geste (Ereignisse ohne längere Pause dazwischen).

/** Anteil des Restwegs, der je Bild (bei 60 Hz) zurückgelegt wird. */
const EASE = 0.16;
/** Längere Pause = neue Geste (gemessen: Mausrad bis 125 ms, Touchpad bis 85 ms). */
const GESTURE_GAP = 150;

/** true, wenn ein Element zwischen Ziel und Seite selbst in diese Richtung scrollen kann. */
function innerScroller(target: EventTarget | null, dy: number): boolean {
  for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
    if (el.scrollHeight <= el.clientHeight + 1) continue;
    const overflow = getComputedStyle(el).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
  }
  return false;
}

export function smoothWheel(enabled: () => boolean): void {
  let target = 0;
  let current = 0;
  let frame = 0;
  let last = 0;
  let lastEvent = -Infinity;
  /** Gerät der laufenden Geste. */
  let mouse: boolean | null = null;

  const maxScroll = (): number => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const step = (now: number): void => {
    // Hat inzwischen etwas anderes gescrollt (Touchpad, Tastatur,
    // Bildlaufleiste, Sprungmarke), gibt das Mausrad nach.
    if (Math.abs(window.scrollY - current) > 3) {
      frame = 0;
      return;
    }
    const k = 1 - Math.pow(1 - EASE, Math.min(now - last, 100) / (1000 / 60));
    last = now;
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo({ top: current, behavior: 'instant' });
    frame = current === target ? 0 : requestAnimationFrame(step);
  };

  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastEvent > GESTURE_GAP) mouse = null;
      lastEvent = now;
      if (e.deltaX) mouse = false;
      else if (mouse === null) mouse = Math.abs(e.deltaY) === 4 || !Number.isInteger(e.deltaY);
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || !e.deltaY || !enabled()) return;
      if (!mouse) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (innerScroller(e.target, e.deltaY)) return;
      if (getComputedStyle(document.documentElement).overflowY === 'hidden') return;
      if (getComputedStyle(document.body).overflowY === 'hidden') return;

      e.preventDefault();
      if (!frame) {
        current = target = window.scrollY;
        last = now;
        frame = requestAnimationFrame(step);
      }
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
    },
    { passive: false },
  );
}
