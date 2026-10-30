/* Koordinatensystem als SVG. Zeichenhilfen in g: kurve, linie, gerade, senkrechte, punkt, text, pfeil, rechteck, polygon, flaeche, bogen, kreis */
const NS = "http://www.w3.org/2000/svg", P = {};
let svg = null, A = {}, W = 640, H = 420, V = {};
function z(v, nk = 2) {
  if (typeof v !== "number" || !isFinite(v)) return "–";
  let r = Number(v.toFixed(nk)); if (Object.is(r, -0)) r = 0;
  return r.toLocaleString("de-DE", { maximumFractionDigits: nk }).replace("-", "−");
}
function pib(v) {
  const k = v / Math.PI; if (Math.abs(k) < 1e-9) return "0";
  for (const d of [1, 2, 3, 4, 6, 12]) { const n = Math.round(k * d); if (Math.abs(k * d - n) < 1e-6) { const g2 = (a, b) => b ? g2(b, a % b) : a, t = g2(Math.abs(n), d), z1 = n / t, n1 = d / t;
    return (z1 < 0 ? "−" : "") + (Math.abs(z1) === 1 ? "" : Math.abs(z1)) + "π" + (n1 === 1 ? "" : "/" + n1); } }
  return z(v);
}
function pm(v, nk = 2) { if (Math.abs(v) < 1e-9) return ""; return v > 0 ? " + " + z(v, nk) : " − " + z(-v, nk); }
function koef(v, punkt) { return v === 1 ? "" : v === -1 ? "−" : z(v) + (punkt ? "·" : ""); }
function rund(v, s) { const d = (String(s).split(".")[1] || "").length; return Number((Math.round(v / s) * s).toFixed(d)); }
function winkel(A1, B1, C1) { const u = [A1.x - B1.x, A1.y - B1.y], w = [C1.x - B1.x, C1.y - B1.y]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180 / Math.PI; }
const wuerfel = () => 1 + Math.floor(Math.random() * 6), muenze = () => (Math.random() < 0.5 ? 0 : 1);
function el(tag, a, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in a) { const v = a[k]; if (v === undefined) continue; if (typeof v === "string" && v.startsWith("var(")) e.style.setProperty(k, v); else e.setAttribute(k, v); }
  (parent || svg).appendChild(e); return e;
}
const TIEF = "₀₁₂₃₄₅₆₇₈₉";
function marke(s) {
  return String(s ?? "").replace(/\$([^$]+)\$/g, (m, f) => {
    f = f.replace(/_\{?(\d+)\}?/g, (m2, d) => [...d].map(c => TIEF[c]).join(""));
    if (f.includes("\\")) return Tex.einfach(f);
    return f.replace(/<=/g, "≤").replace(/>=/g, "≥").replace(/\*/g, "·").replace(/sqrt/g, "√").replace(/(^|[^a-zA-Z])pi(?![a-zA-Z])/g, "$1π")
      .replace(/\^2(?!\d)/g, "²").replace(/\^3(?!\d)/g, "³").replace(/(\d)\.(\d)/g, "$1,$2").replace(/-/g, "−");
  });
}
const px = x => (x - V.xMin) / (V.xMax - V.xMin) * W, py = y => H - (y - V.yMin) / (V.yMax - V.yMin) * H;
function messen() {
  const xR = A.xMax - A.xMin, yR = A.yMax - A.yMin;
  W = Math.max(A.hoehe ? 120 : 260, Math.round(svg.getBoundingClientRect().width || 640));
  V = { xMin: A.xMin, xMax: A.xMax, yMin: A.yMin, yMax: A.yMax };
  const HM = Math.round(Math.min(480, Math.max(240, (window.innerHeight || 800) * 0.55)));
  if (A.gleicheEinheiten) {
    H = W * yR / xR;
    if (H > HM) { H = HM; const n = W * yR / H, m = (A.xMin + A.xMax) / 2; V.xMin = m - n / 2; V.xMax = m + n / 2; }
    if (H < 220) { H = 220; const n = H * xR / W, m = (A.yMin + A.yMax) / 2; V.yMin = m - n / 2; V.yMax = m + n / 2; }
  } else H = Math.min(HM, Math.max(220, W * 0.66));
  if (A.hoehe) { // feste Höhe für kleine Graphen (Zuordnen, Lernzettel)
    H = A.hoehe; V = { xMin: A.xMin, xMax: A.xMax, yMin: A.yMin, yMax: A.yMax };
    if (A.gleicheEinheiten) { const n = W * yR / H; if (n >= xR) { const m = (A.xMin + A.xMax) / 2; V.xMin = m - n / 2; V.xMax = m + n / 2; } else { const n2 = H * xR / W, m = (A.yMin + A.yMax) / 2; V.yMin = m - n2 / 2; V.yMax = m + n2 / 2; } }
  }
  H = Math.round(H);
}
function teilung(r, p) { const roh = r / Math.max(2, p / 55), q = 10 ** Math.floor(Math.log10(roh)); for (const k of [1, 2, 5, 10]) if (k * q >= roh) return k * q; }
function piText(k) { const s = k < 0 ? "−" : ""; k = Math.abs(k); return k % 2 === 0 ? s + (k === 2 ? "" : k / 2) + "π" : s + (k === 1 ? "" : k) + "π/2"; }
function spitze(x, y, w, f) { const l = 9, b = 4.5, c = Math.cos(w), s = Math.sin(w); el("polygon", { points: `${x},${y} ${x - l * c - b * s},${y - l * s + b * c} ${x - l * c + b * s},${y - l * s - b * c}`, fill: f }); }
function achsen() {
  const dicht = A.hoehe && A.hoehe < 200 ? 2 : 1; // kleine Graphen: mehr Skalenstriche
  let sx = teilung(V.xMax - V.xMin, W * dicht), sy = teilung(V.yMax - V.yMin, H * dicht);
  if (A.xPi) sx = W / (V.xMax - V.xMin) * Math.PI / 2 >= 45 ? Math.PI / 2 : Math.PI; else if (A.gleicheEinheiten) sx = sy = Math.max(sx, sy);
  const xs = [], ys = [];
  const sk = A.skalaX || [-Infinity, Infinity];
  for (let i = Math.ceil(V.xMin / sx); i * sx <= V.xMax + 1e-9; i++) if (i * sx >= sk[0] - 1e-9 && i * sx <= sk[1] + 1e-9) xs.push(i);
  for (let i = Math.ceil(V.yMin / sy); i * sy <= V.yMax + 1e-9; i++) ys.push(i);
  if (A.gitter !== false) { const gg = el("g", { stroke: "var(--grid)" }); xs.forEach(i => el("line", { x1: px(i * sx), x2: px(i * sx), y1: 0, y2: H }, gg)); ys.forEach(i => el("line", { x1: 0, x2: W, y1: py(i * sy), y2: py(i * sy) }, gg)); }
  if (A.achsen === false) return;
  const ax = Math.min(Math.max(py(0), 0), H), ay = Math.min(Math.max(px(0), 0), W);
  el("line", { x1: 0, x2: W - 2, y1: ax, y2: ax, stroke: "var(--axis)", "stroke-width": 1.4 }); el("line", { x1: ay, x2: ay, y1: H, y2: 2, stroke: "var(--axis)", "stroke-width": 1.4 });
  spitze(W - 1, ax, 0, "var(--axis)"); spitze(ay, 1, -Math.PI / 2, "var(--axis)");
  const t = el("g", { class: "tick", fill: "var(--muted)" });
  xs.forEach(i => { if (!i) return; const X = px(i * sx); if (X < 10 || X > W - 18) return; el("line", { x1: X, x2: X, y1: ax - 4, y2: ax + 4, stroke: "var(--axis)" }, t);
    el("text", { x: X, y: ax + 17 > H - 3 ? ax - 8 : ax + 17, "text-anchor": "middle" }, t).textContent = A.xPi ? piText(sx === Math.PI ? 2 * i : i) : z(i * sx, 3); });
  ys.forEach(i => { if (!i) return; const Y = py(i * sy); if (Y < 14 || Y > H - 8) return; el("line", { x1: ay - 4, x2: ay + 4, y1: Y, y2: Y, stroke: "var(--axis)" }, t);
    const l = ay > 34; el("text", { x: l ? ay - 7 : ay + 7, y: Y + 4, "text-anchor": l ? "end" : "start" }, t).textContent = z(i * sy, 3); });
  if (py(0) > 0 && py(0) < H && px(0) > 0 && px(0) < W) el("text", { x: ay - 6, y: ax + 16, "text-anchor": "end" }, t).textContent = "0";
  el("text", { x: W - 12, y: ax - 9, class: "marke", fill: "var(--axis)" }).textContent = "x"; el("text", { x: ay + 9, y: 15, class: "marke", fill: "var(--axis)" }).textContent = "y";
}
function leinwand(ziel, ansicht) {
  svg = ziel; A = ansicht; messen(); svg.textContent = ""; svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.style.height = H + "px";
  const cp = el("clipPath", { id: "clip" }, el("defs", {})); el("rect", { x: 0, y: 0, width: W, height: H }, cp); achsen();
}
const g = {
  get px() { return px; }, get py() { return py; },
  kurve(f, o = {}) {
    const n = Math.round(W * 1.5), sp = V.yMax - V.yMin, von = o.von ?? V.xMin, bis = o.bis ?? V.xMax; let d = "", an = false, alt = 0;
    for (let i = 0; i <= n; i++) { const x = von + (bis - von) * i / n; let y; try { y = f(x, P); } catch (e) { y = NaN; }
      if (typeof y !== "number" || !isFinite(y)) { an = false; continue; } if (an && Math.abs(y - alt) > sp) an = false;
      d += (an ? "L" : "M") + px(x).toFixed(1) + " " + py(Math.max(V.yMin - sp, Math.min(V.yMax + sp, y))).toFixed(1); an = true; alt = y; }
    return el("path", { d, fill: "none", stroke: o.farbe || "var(--f1)", "stroke-width": o.breite || 2.5, "stroke-linejoin": "round", "stroke-dasharray": o.gestrichelt ? "7 5" : undefined, "clip-path": "url(#clip)" });
  },
  linie(x1, y1, x2, y2, o = {}) { return el("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), stroke: o.farbe || "var(--hilf)", "stroke-width": o.breite || 2, "stroke-dasharray": o.gestrichelt ? "6 5" : undefined, "clip-path": "url(#clip)" }); },
  gerade(x0, y0, m, o) { return g.linie(V.xMin, y0 + m * (V.xMin - x0), V.xMax, y0 + m * (V.xMax - x0), o); },
  senkrechte(x0, o) { return g.linie(x0, V.yMin, x0, V.yMax, o); },
  punkt(x, y, o = {}) { if (!isFinite(x) || !isFinite(y)) return; el("circle", { cx: px(x), cy: py(y), r: o.r || 5, fill: o.farbe || "var(--ink)", stroke: "#fff", "stroke-width": 1.5 }); if (o.text) g.text(x, y, o.text, { dx: o.dx ?? 9, dy: o.dy ?? -9, farbe: o.farbe }); },
  text(x, y, s, o = {}) { s = marke(s); const t = el("text", { x: px(x) + (o.dx || 0), y: py(y) + (o.dy || 0), class: "marke", fill: o.farbe || "var(--ink)", "text-anchor": o.anker || "start" }); t.textContent = s; return t; },
  pfeil(x1, y1, x2, y2, o = {}) { const f = o.farbe || "var(--ink)"; el("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), stroke: f, "stroke-width": o.breite || 2.5 }); spitze(px(x2), py(y2), Math.atan2(py(y2) - py(y1), px(x2) - px(x1)), f); },
  rechteck(x1, y1, x2, y2, o = {}) { return el("rect", { x: Math.min(px(x1), px(x2)), y: Math.min(py(y1), py(y2)), width: Math.abs(px(x2) - px(x1)), height: Math.abs(py(y2) - py(y1)), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 1 : undefined, "clip-path": "url(#clip)" }); },
  polygon(pts, o = {}) { return el("polygon", { points: pts.map(q => px(q[0]).toFixed(1) + "," + py(q[1]).toFixed(1)).join(" "), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 2 : undefined, "clip-path": "url(#clip)" }); },
  flaeche(f, a, b, o = {}) { const p = [[a, 0]]; for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; p.push([x, f(x, P)]); } p.push([b, 0]); return g.polygon(p, o); },
  bogen(mx, my, r, w1, w2, o = {}) { const p = []; for (let i = 0; i <= 90; i++) { const w = w1 + (w2 - w1) * i / 90; p.push(px(mx + r * Math.cos(w)).toFixed(1) + " " + py(my + r * Math.sin(w)).toFixed(1)); }
    return el("path", { d: "M" + p.join("L") + (o.fuellen ? `L${px(mx).toFixed(1)} ${py(my).toFixed(1)}Z` : ""), fill: o.fuellen || "none", "fill-opacity": o.fuellen ? 0.2 : undefined, stroke: o.farbe || "var(--f1)", "stroke-width": o.breite || 2.5, "stroke-dasharray": o.gestrichelt ? "6 5" : undefined }); },
  kreis(mx, my, r, o = {}) { return g.bogen(mx, my, r, 0, 2 * Math.PI, o); },
};
