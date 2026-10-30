/* Baumdiagramme: lesbar auch am Handy, Pfade antippen, Pfadregeln mit Brüchen, Lückenäste mit Tastatur.
   Knoten: { name, p, kinder, offen }. p als Text: "3/5", "0,4", "25%". Kurzform für Urnen: { urne: { r: 3, b: 2 }, zuege: 2, zuruecklegen: false }. */
const Bruch = (() => {
  const ggt = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const kurz = b => { const g = ggt(b.z, b.n); return { z: b.z / g, n: b.n / g, dez: b.dez }; };
  function lies(s) {
    s = String(s ?? "").replace(/\s/g, "").replace(/[−–]/g, "-");
    let m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return { z: +m[1], n: +m[2], dez: false };
    m = s.match(/^(-?\d+(?:[.,]\d+)?)%$/); if (m) { const d = (m[1].split(/[.,]/)[1] || "").length; return kurz({ z: Math.round(parseFloat(m[1].replace(",", ".")) * 10 ** d), n: 100 * 10 ** d, dez: true }); }
    m = s.match(/^-?\d+(?:[.,](\d+))?$/); if (m) { const d = (m[1] || "").length; return kurz({ z: Math.round(parseFloat(s.replace(",", ".")) * 10 ** d), n: 10 ** d, dez: d > 0 }); }
    let v = NaN; try { v = Term.zahl(s); } catch (e) {}
    return { z: v, n: 1, dez: true, roh: true };
  }
  const mal = (a, b) => ({ z: a.z * b.z, n: a.n * b.n, dez: a.dez || b.dez });
  const plus = (a, b) => kurz({ z: a.z * b.n + b.z * a.n, n: a.n * b.n, dez: a.dez || b.dez });
  const wert = b => b.z / b.n;
  const tex = b => b.dez || b.roh ? z(wert(b), 4).replace("−", "-").replace(",", "{,}") : b.n === 1 ? String(b.z) : (b.z < 0 ? "-" : "") + "\\frac{" + Math.abs(b.z) + "}{" + b.n + "}";
  const text = b => b.dez || b.roh ? z(wert(b), 4) : b.n === 1 ? String(b.z) : b.z + "/" + b.n;
  return { lies, mal, plus, kurz, wert, tex, text, ggt };
})();

// Pfadname: rr bei einbuchstabigen Namen, sonst 1; 6
const pfadName = p => p.every(k => /^[A-Za-zÄÖÜäöü]$/.test(k.name)) ? p.map(k => k.name).join("") : p.map(k => k.name).join("; ");
function baumAusUrne(U) {
  const namen = Object.keys(U.urne), zuege = U.zuege || 2, zurueck = !!U.zuruecklegen;
  function knoten(rest, tiefe) {
    if (tiefe >= zuege) return [];
    const summe = namen.reduce((s, k) => s + rest[k], 0);
    return namen.filter(k => rest[k] > 0).map(k => {
      const r2 = Object.assign({}, rest); if (!zurueck) r2[k]--;
      return { name: k, p: rest[k] + "/" + summe, kinder: knoten(zurueck ? rest : r2, tiefe + 1) };
    });
  }
  return { stufen: U.stufen || Array.from({ length: zuege }, (_, i) => (i + 1) + ". Zug"), kinder: knoten(Object.assign({}, U.urne), 0) };
}

// Zeichnet den Baum in ein SVG. o: { breite, hoehe (nur in Zeichnungen), zeile, info, produkte, markiert: Set von Pfadschlüsseln, beiKlick }
function baumZeichnen(ziel, B, o = {}) {
  if (B.urne) B = baumAusUrne(B);
  const Wp = o.breite || Math.max(280, Math.round(ziel.getBoundingClientRect().width || 640)), schmal = Wp < 460;
  const blaetter = [];
  (function sammle(k, pfad) { (k.kinder || []).forEach(c => { const p2 = pfad.concat([c]); if (c.kinder && c.kinder.length) sammle(c, p2); else blaetter.push(p2); }); })(B, []);
  const tiefe = Math.max(1, ...blaetter.map(p => p.length)), kopf = B.stufen ? 24 : 6;
  const info = o.info !== false, infoW = info ? (schmal ? 64 : 150) : 0;
  const zeile = o.hoehe ? Math.max(20, (o.hoehe - kopf - 8) / Math.max(1, blaetter.length)) : (o.zeile || (schmal ? 36 : 40));
  const Hp = o.hoehe || Math.round(kopf + blaetter.length * zeile + 8);
  if (!o.hoehe) { ziel.setAttribute("viewBox", `0 0 ${Wp} ${Hp}`); ziel.style.height = Hp + "px"; ziel.textContent = ""; }
  const gross = schmal ? 13 : 14;
  const mass = s => { const t = el("text", { x: -999, y: -999, "font-size": gross, "font-weight": 700 }, ziel); t.textContent = s; let w = s.length * 8; try { w = t.getBBox().width || w; } catch (e) {} t.remove(); return w; };
  const blattBreite = Math.max(10, ...blaetter.map(p => mass(p[p.length - 1].name))) / 2 + 6;
  const x0 = 16, sx = k => x0 + k * (Wp - x0 - infoW - blattBreite - 10) / tiefe;
  const schl = pfad => pfad.map(k => k.name).join("-");
  const lage = new Map(); blaetter.forEach((p, i) => lage.set(p, kopf + (i + 0.5) * zeile));
  const yVon = (k, pfad) => { if (!k.kinder || !k.kinder.length) return lage.get(blaetter.find(b => b.length === pfad.length && b.every((x, i) => x === pfad[i]))); const ys = k.kinder.map(c => yVon(c, pfad.concat([c]))); return (Math.min(...ys) + Math.max(...ys)) / 2; };
  const mk = o.markiert || new Set();
  const teil = (pfad, i) => schl(pfad.slice(0, i + 1));
  const aufMarkiert = pfad => [...mk].some(m => m === schl(pfad) || m.startsWith(schl(pfad) + "-"));
  if (B.stufen) B.stufen.forEach((s, i) => { if (i < tiefe) el("text", { x: sx(i + 1), y: 15, "text-anchor": "middle", class: "tick", fill: "var(--muted)" }, ziel).textContent = s; });
  const ebeneKanten = el("g", {}, ziel), ebeneMarken = el("g", {}, ziel), ebeneKnoten = el("g", {}, ziel);
  function kasten(x, y, text, farbe, parent, fett) {
    const t = el("text", { x, y: y + gross * 0.36, "text-anchor": "middle", "font-size": gross, fill: farbe || "var(--ink)", "font-weight": fett ? 700 : 500 }, parent); t.textContent = text;
    let b; try { b = t.getBBox(); } catch (e) { b = { x: x - text.length * 4, y: y - 8, width: text.length * 8, height: 16 }; }
    const r = el("rect", { x: b.x - 4, y: b.y - 2, width: b.width + 8, height: b.height + 4, rx: 5, fill: "#fff" }, parent); parent.insertBefore(r, t); return t;
  }
  (function male(k, pfad, x, y) {
    (k.kinder || []).forEach(c => {
      const p2 = pfad.concat([c]), cx = sx(p2.length), cy = yVon(c, p2), an = aufMarkiert(p2);
      el("line", { x1: x, y1: y, x2: cx, y2: cy, stroke: an ? "var(--f2)" : "var(--hilf)", "stroke-width": an ? 3.5 : 1.8 }, ebeneKanten);
      if (c.p != null || c.offen) {
        const t = 0.55, mx = x + (cx - x) * t, my = y + (cy - y) * t, auf = cy <= y, ver = auf ? -gross * 0.75 : gross * 0.75;
        const txt = c.offen && !c.geloest ? "?" : Bruch.text(Bruch.lies(c.p));
        kasten(mx, my + (Math.abs(cy - y) < 2 ? -gross * 0.75 : ver * 0.65), txt, c.offen ? (c.geloest ? "var(--gut)" : "var(--f2)") : "var(--f1)", ebeneMarken, c.offen);
      }
      kasten(cx, cy, c.name, an ? "var(--f2)" : "var(--ink)", ebeneKnoten, true);
      male(c, p2, cx + 0, cy);
    });
  })(B, [], x0, yVon(B, []));
  el("circle", { cx: x0, cy: yVon(B, []), r: 4, fill: "var(--ink)" }, ebeneKnoten);
  if (info) blaetter.forEach(p => {
    const y = lage.get(p), an = mk.has(schl(p)), xi = sx(tiefe) + blattBreite + 4;
    const pr = p.reduce((a, k) => (k.offen && !k.geloest) || a == null ? null : Bruch.mal(a, Bruch.lies(k.p)), { z: 1, n: 1, dez: false });
    const zeig = o.produkte === false || !pr ? (schmal ? "" : pfadName(p)) : (schmal ? "" : pfadName(p) + ": ") + Bruch.text(Bruch.kurz(pr));
    if (an) el("rect", { x: xi - 6, y: y - zeile / 2 + 3, width: Wp - xi + 4, height: zeile - 6, rx: 6, fill: "#fdf0e3" }, ebeneKanten);
    const t = el("text", { x: xi, y: y + 4, "font-size": schmal ? 12.5 : 13.5, fill: an ? "var(--f2)" : "var(--muted)" }, ebeneKnoten); t.textContent = zeig;
    if (o.beiKlick) { const h = el("rect", { x: sx(tiefe) - 26, y: y - zeile / 2, width: Wp - sx(tiefe) + 26, height: zeile, fill: "transparent", style: "cursor:pointer" }, ziel); h.addEventListener("click", () => o.beiKlick(schl(p), p)); }
  });
  return { blaetter, schl, hoehe: Hp };
}
g.baum = (B, o = {}) => baumZeichnen(svg, B, Object.assign({ breite: W, hoehe: H }, o, { markiert: new Set(o.markiert || []) }));

function baumSeite(C, H) {
  const { seite, $, beiGroesse } = H;
  seite(C, `<div class="karte"><svg id="baum" class="baum" role="img" aria-label="Baumdiagramm"></svg><p class="klein" id="baumhinweis"></p><div id="rechnung" aria-live="polite"></div></div><div id="luecken"></div><div id="aufgaben"></div><div class="karte"><p id="stand"></p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
  const B = C.urne ? baumAusUrne(C) : C.baum || C, mk = new Set(), schlVon = s => Array.isArray(s) ? s.join("-") : String(s);
  (C.markiert || (C.ereignis && C.ereignis.pfade) || []).forEach(s => mk.add(schlVon(s)));
  let erg = { blaetter: [] };
  const zeichne = () => { erg = baumZeichnen($("baum"), B, { markiert: mk, produkte: C.produkte !== false, beiKlick: (k) => { mk.has(k) ? mk.delete(k) : mk.add(k); zeichne(); rechne(); } }); };
  $("baumhinweis").textContent = "Tipp auf einen Pfad (rechts neben dem Ende), um ihn auszuwählen. Die Rechnung steht darunter.";
  function rechne() {
    const box = $("rechnung"); box.textContent = "";
    const pfade = erg.blaetter.filter(p => mk.has(erg.schl(p)));
    if (!pfade.length) return;
    const offen = pfade.some(p => p.some(k => k.offen && !k.geloest));
    if (offen) { neu("p", "klein", box).textContent = "Füll zuerst die fehlenden Wahrscheinlichkeiten aus."; return; }
    const prod = pfade.map(p => { const fs = p.map(k => Bruch.lies(k.p)), roh = fs.reduce(Bruch.mal, { z: 1, n: 1, dez: false }), k2 = Bruch.kurz(roh);
      const dez = fs.some(f => f.dez || f.roh); let t = fs.map(Bruch.tex).join(" \\cdot ") + " = " + (dez ? Bruch.tex(Object.assign({}, k2, { dez: true })) : Bruch.tex(roh) + (roh.n !== k2.n ? " = " + Bruch.tex(k2) : ""));
      return { name: pfadName(p), t, wert: k2, dez }; });
    const pn = s => /^[A-Za-z]+$/.test(s) ? s : "\\text{" + s + "}";
    prod.forEach(q => { const d = document.createElement("div"); d.className = "zeile"; Tex.formel("P(" + pn(q.name) + ") = " + q.t, d); box.appendChild(d); });
    if (prod.length > 1) {
      const dez = prod.some(q => q.dez), summe = prod.reduce((a, q) => Bruch.plus(a, q.wert), { z: 0, n: 1, dez: false });
      let t;
      if (dez) t = prod.map(q => Bruch.tex(Object.assign({}, q.wert, { dez: true }))).join(" + ") + " = " + Bruch.tex(Object.assign({}, summe, { dez: true }));
      else { const kgv = prod.reduce((a, q) => a * q.wert.n / Bruch.ggt(a, q.wert.n), 1), zs = prod.reduce((s, q) => s + q.wert.z * kgv / q.wert.n, 0);
        t = prod.map(q => Bruch.tex(q.wert)).join(" + ") + " = " + (zs !== summe.z || kgv !== summe.n ? "\\frac{" + zs + "}{" + kgv + "} = " : "") + Bruch.tex(summe); }
      const d = document.createElement("div"); d.className = "zeile summe"; Tex.formel((C.ereignis && C.ereignis.name ? "P(" + pn(C.ereignis.name) + ")" : "P") + " = " + t, d); box.appendChild(d);
    }
  }
  const neu = (tag, klasse, eltern) => { const e = document.createElement(tag); if (klasse) e.className = klasse; eltern.appendChild(e); return e; };
  // Lückenäste
  const luecken = []; (function suche(k, pfad) { (k.kinder || []).forEach(c => { const p2 = pfad.concat([c]); if (c.offen) luecken.push({ k: c, pfad: p2 }); suche(c, p2); }); })(B, []);
  if (luecken.length) {
    const kk = neu("div", "karte", $("luecken")); neu("p", "frage", kk).textContent = "Ergänze die fehlenden Wahrscheinlichkeiten (die Äste mit ?).";
    luecken.forEach(L => { const z = neu("div", "feldzeile", kk), v = neu("span", "vor", z);
      v.textContent = L.pfad.map((k, i) => (B.stufen && B.stufen[i] ? B.stufen[i] + ": " : "") + k.name).join(" → ") + " :";
      L.feld = Tastatur.feld(z, { platzhalter: "z. B. 2/4", tastatur: C.tastatur || "stochastik", vorschau: "auto", beiEnter: pruefe }); L.erg = neu("div", "erg", kk); L.erg.hidden = true; });
    const kn = neu("div", "knoepfe", kk); kn.appendChild(knopf("Prüfen", pruefe, "haupt"));
  }
  function pruefe() {
    luecken.forEach(L => { const roh = L.feld.wert(); if (!roh) return; const ok = Term.gleich(roh, String(L.k.p), {}); L.versuche = (L.versuche || 0) + 1; L.k.geloest = ok; L.erg.hidden = false; L.erg.className = "erg " + (ok ? "richtig" : "falsch");
      L.erg.textContent = ok ? "✓ " + L.pfad.map(k => k.name).join(" → ") + ": richtig" : "✗ " + L.pfad.map(k => k.name).join(" → ") + ": noch nicht. " + (L.k.tipp || "Wie viele Kugeln sind nach dem ersten Zug noch da?"); if (ok) L.feld.sperre(true); });
    zeichne(); rechne(); stand();
  }
  const st = (C.fragen || C.aufgaben || []).map((a, i) => { const b = document.createElement("div"); b.className = "karte"; b.innerHTML = `<div class="nr">Frage ${i + 1}</div>`; $("aufgaben").appendChild(b); return baueAufgabe(b, a, i + 1, stand); });
  function stand() { const l = luecken.filter(L => L.k.geloest).length; $("stand").innerHTML = (luecken.length ? "<b>Lücken: " + l + " von " + luecken.length + "</b>" : "") + (st.length ? (luecken.length ? " · " : "") + "<b>Fragen: " + st.filter(s => s.richtig).length + " von " + st.length + " richtig</b>" : "") || "Wähl Pfade aus und kopiere deine Ergebnisse in den Chat, wenn du Fragen hast."; }
  $("kopieren").addEventListener("click", e => {
    const z = [ergebnisText(C.titel || "Baumdiagramm", st)];
    if (luecken.length) z.push("Lücken: " + luecken.map(L => L.pfad.map(k => k.name).join("→") + " = " + (L.feld.wert() ? Term.lesbar(L.feld.wert()) : "–") + (L.k.geloest ? " ✓" : L.versuche ? " ✗" : "")).join("; "));
    if (mk.size) z.push("Ausgewählte Pfade: " + erg.blaetter.filter(p => mk.has(erg.schl(p))).map(pfadName).join(", "));
    kopiere(z.join("\n"), e.currentTarget);
  });
  beiGroesse(zeichne); zeichne(); rechne(); stand();
}
