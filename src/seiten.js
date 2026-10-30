/* Seiten: Betty.funktionen, Betty.lernschritte, Betty.uebung, Betty.tastatur, Betty.zufall */
const Betty = (() => {
  const $ = id => document.getElementById(id);
  function seite(cfg, html) {
    if (!document.getElementById("betty-stil")) { const s = document.createElement("style"); s.id = "betty-stil"; s.textContent = BETTY_CSS; document.head.appendChild(s); }
    document.title = cfg.titel || "Mathe";
    const m = document.createElement("main"); m.innerHTML = `<h1 id="titel"></h1><div class="auftrag" id="auftrag"></div>` + html; document.body.appendChild(m);
    $("titel").textContent = cfg.titel || ""; Tex.text($("auftrag"), cfg.auftrag || ""); Tastatur.vorgabe(cfg.tastatur);
  }
  function regler(box, r, neu, klasse) {
    if (!(r.name in P)) P[r.name] = r.start;
    const l = document.createElement("label"); l.className = klasse || "regler"; l.innerHTML = `${r.anzeige || r.name} = <b></b>`;
    const inp = document.createElement("input"); Object.assign(inp, { type: "range", min: r.min, max: r.max, step: r.schritt, value: P[r.name] });
    const w = () => l.querySelector("b").textContent = reglerText(r, P[r.name]);
    inp.addEventListener("input", () => { P[r.name] = rund(+inp.value, r.schritt); w(); neu(); }); w(); l.appendChild(inp); box.appendChild(l); return inp;
  }
  function reglerText(r, v) {
    const winkel = r.grad ?? (r.pi && /winkel|dreh|[αβγδφθ]/i.test((r.anzeige || "") + " " + r.name));
    if (!winkel) return r.pi ? pib(v) : z(v, 3);
    const bog = r.pi ? v : v * Math.PI / 180;
    return z(bog * 180 / Math.PI, 1) + "° = " + pib(bog);
  }
  function rundPruefen(C, aufrufe) {
    const v = C.ansicht; if (!v || v.gleicheEinheiten !== undefined) return;
    const q = (v.yMax - v.yMin) / (v.xMax - v.xMin); if (!(q >= 0.2 && q <= 1.6)) return;
    let rund = false; const s = {};
    Object.keys(g).forEach(k => { s[k] = () => 0; }); s.kreis = s.bogen = () => { rund = true; };
    aufrufe.forEach(f => { try { f(s); } catch (e) {} });
    if (rund) v.gleicheEinheiten = true;
  }
  function beiGroesse(f) { let w = 0; addEventListener("resize", () => { cancelAnimationFrame(w); w = requestAnimationFrame(f); }); }

  function funktionen(C) {
    seite(C, `<div class="layout"><svg id="figur" role="img" aria-label="Interaktive Zeichnung"></svg><div class="panel"><div id="terme"></div><div id="regler"></div><div class="anzeige" id="anzeige" aria-live="polite"></div><p class="klein" id="hinweis" hidden>Punkte mit weißem Ring kannst du mit Maus oder Finger ziehen.</p><button type="button" id="reset">Zurücksetzen</button></div></div>`);
    const fig = $("figur"); let griffe = [], aktiv = null; C.parameter = C.parameter || []; C.funktionen = C.funktionen || [];
    function griff(x, y, text, farbe, setze) {
      if (!isFinite(x) || !isFinite(y)) return;
      el("circle", { cx: px(x), cy: py(y), r: 8, fill: farbe, stroke: "#fff", "stroke-width": 3 }); el("circle", { cx: px(x), cy: py(y), r: 11, fill: "none", stroke: farbe, "stroke-width": 1 });
      if (text) el("text", { x: px(x) + 13, y: py(y) - 11, class: "marke", fill: farbe }).textContent = marke(text);
      griffe.push({ sx: px(x), sy: py(y), setze });
    }
    function zeichne() {
      leinwand(fig, C.ansicht); griffe = [];
      if (C.hintergrund) C.hintergrund(g, P);
      C.funktionen.forEach(f => g.kurve(f.f, f));
      if (C.extras) C.extras(g, P);
      C.parameter.filter(q => q.ziehen).forEach(q => { const f = C.funktionen[q.ziehen.funktion].f;
        griff(P[q.name], f(P[q.name], P), q.ziehen.text, "var(--f1)", x => { P[q.name] = Math.min(q.max, Math.max(q.min, rund(x, q.schritt))); $("r_" + q.name).value = P[q.name]; }); });
      (C.punkte || []).forEach(q => griff(P[q.name].x, P[q.name].y, q.name, q.farbe || "var(--f1)", (x, y) => { const r = q.raster || 0.1; P[q.name] = { x: rund(Math.min(V.xMax, Math.max(V.xMin, x)), r), y: rund(Math.min(V.yMax, Math.max(V.yMin, y)), r) }; }));
      fig.style.touchAction = griffe.length ? "none" : "auto"; $("hinweis").hidden = !griffe.length;
      $("terme").innerHTML = ""; C.funktionen.filter(f => f.term).forEach(f => { const p = document.createElement("p"); p.className = "term"; p.innerHTML = `<b style="color:${f.farbe || "var(--f1)"}">●</b> `; const s = document.createElement("span"); Tex.text(s, f.term(P)); p.appendChild(s); $("terme").appendChild(p); });
      C.parameter.forEach(q => { $("w_" + q.name).textContent = reglerText(q, P[q.name]); });
      $("anzeige").innerHTML = ""; if (C.anzeige) C.anzeige(P).forEach(([k, v]) => { const d = document.createElement("div"), a = document.createElement("span"), b = document.createElement("span"); Tex.text(a, k); Tex.text(b, v); d.append(a, b); $("anzeige").appendChild(d); });
    }
    const punktIn = e => { const r = fig.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    const bewege = e => { const [sx, sy] = punktIn(e); aktiv.setze(V.xMin + sx / W * (V.xMax - V.xMin), V.yMax - sy / H * (V.yMax - V.yMin)); zeichne(); };
    fig.addEventListener("pointerdown", e => { const [sx, sy] = punktIn(e); let best = null, bd = 26; griffe.forEach(q => { const d = Math.hypot(q.sx - sx, q.sy - sy); if (d < bd) { bd = d; best = q; } }); if (!best) return; aktiv = best; fig.setPointerCapture(e.pointerId); e.preventDefault(); bewege(e); });
    fig.addEventListener("pointermove", e => { if (aktiv) return bewege(e); const [sx, sy] = punktIn(e); fig.style.cursor = griffe.some(q => Math.hypot(q.sx - sx, q.sy - sy) < 26) ? "grab" : "default"; });
    ["pointerup", "pointercancel"].forEach(t => fig.addEventListener(t, () => { aktiv = null; }));
    const start = () => { C.parameter.forEach(q => { P[q.name] = q.start; const r = $("r_" + q.name); if (r) r.value = q.start; }); (C.punkte || []).forEach(q => { P[q.name] = { x: q.x, y: q.y }; }); };
    C.parameter.forEach(q => {
      const l = document.createElement("label"); l.innerHTML = `${q.anzeige || q.name} <span class="wert" id="w_${q.name}"></span>`;
      const r = document.createElement("input"); Object.assign(r, { type: "range", id: "r_" + q.name, min: q.min, max: q.max, step: q.schritt });
      r.addEventListener("input", () => { P[q.name] = rund(+r.value, q.schritt); zeichne(); }); l.appendChild(r); $("regler").appendChild(l);
    });
    $("reset").addEventListener("click", () => { start(); zeichne(); }); beiGroesse(zeichne); start();
    rundPruefen(C, [s => C.hintergrund && C.hintergrund(s, P), s => C.extras && C.extras(s, P)]); zeichne();
  }

  function lernschritte(C) {
    seite(C, `<div class="layout"><svg id="figur" role="img" aria-label="Zeichnung zum aktuellen Schritt"></svg><div><div id="schritte"></div><div class="knoepfe nav"><button type="button" id="zurueck">◀ Zurück</button><button type="button" class="haupt" id="weiter">Weiter ▶</button></div><div class="punkte" id="punkte"></div></div></div>`);
    const fig = $("figur"), karten = [], erg = [], n = C.schritte.length; let jetzt = 0;
    if (!C.ansicht) { fig.remove(); document.querySelector(".layout").classList.add("ohne"); }
    if (C.regler) { const k = document.createElement("div"); k.className = "karte"; $("schritte").before(k); C.regler.forEach(r => regler(k, r, () => zeichne())); }
    const zeichne = () => { if (!C.ansicht) return; leinwand(fig, C.ansicht); const bis = Math.min(jetzt, n - 1); C.schritte.forEach((s, i) => { if (i <= bis && s.zeichne) s.zeichne(g, P, i === bis); }); };
    function zeige(k) {
      jetzt = k; karten.forEach((c, i) => c.hidden = i !== k);
      $("zurueck").disabled = k === 0; $("weiter").disabled = k === karten.length - 1; $("weiter").textContent = k >= n - 1 ? "Fertig ✓" : "Weiter ▶";
      [...$("punkte").children].forEach((d, i) => d.className = i === k ? "an" : i < k ? "fertig" : ""); zeichne();
    }
    C.schritte.forEach((s, i) => {
      const c = document.createElement("div"); c.className = "karte";
      c.innerHTML = `<div class="nr">Schritt ${i + 1} von ${n}</div><h2></h2><div class="text"></div>`;
      c.querySelector("h2").textContent = (s.titel || "").replace(/^\s*(Schritt\s*)?\d+\s*[.:)]\s*/i, ""); Tex.text(c.querySelector(".text"), s.text);
      (s.regler || []).forEach(r => regler(c, r, () => zeichne()));
      if (s.frage) { const f = document.createElement("div"); f.className = "aufgabe"; c.appendChild(f); erg.push(baueAufgabe(f, s.frage, "Schritt " + (i + 1), () => {})); }
      $("schritte").appendChild(c); karten.push(c);
      const d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", "Schritt " + (i + 1)); d.addEventListener("click", () => zeige(i)); $("punkte").appendChild(d);
    });
    const ende = document.createElement("div"); ende.className = "karte";
    ende.innerHTML = `<h2>Geschafft</h2><p>${erg.length ? "Kopiere deine Antworten und füge sie im Chat ein. Dann bekommst du zu allem auf einmal Rückmeldung." : "Wenn noch etwas unklar ist, schreib es in den Chat."}</p>`;
    if (erg.length) ende.appendChild(knopf("Ergebnisse in den Chat kopieren", e => kopiere(ergebnisText(C.titel, erg), e.currentTarget), "haupt"));
    ende.appendChild(knopf("Noch einmal von vorn", () => zeige(0))); $("schritte").appendChild(ende); karten.push(ende);
    $("zurueck").addEventListener("click", () => zeige(Math.max(0, jetzt - 1))); $("weiter").addEventListener("click", () => { if (jetzt < karten.length - 1) zeige(jetzt + 1); });
    rundPruefen(C, C.schritte.map(s => g2 => s.zeichne && s.zeichne(g2, P, true)));
    beiGroesse(zeichne); zeige(0);
  }

  function uebung(C) {
    seite(C, `<div id="aufgaben"></div><div class="karte"><p id="stand"></p><p class="klein">Wenn du fertig bist oder nicht weiterkommst: Kopiere deine Ergebnisse und füge sie im Chat ein. Dann bekommst du zu allen Aufgaben auf einmal Rückmeldung.</p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
    const st = C.aufgaben.map((a, i) => { const b = document.createElement("div"); b.className = "karte"; b.innerHTML = `<div class="nr">Aufgabe ${i + 1}</div>`; $("aufgaben").appendChild(b); return baueAufgabe(b, a, i + 1, stand); });
    function stand() { const o = st.filter(s => s.offen).length; $("stand").innerHTML = "<b>" + st.filter(s => s.richtig).length + " von " + (st.length - o) + " richtig</b>" + (o ? " · " + o + " prüft Betty im Chat" : ""); }
    stand(); $("kopieren").addEventListener("click", e => kopiere(ergebnisText(C.titel, st), e.currentTarget));
  }

  function tastatur(C) {
    seite(C, `<div id="felder"></div><div class="knoepfe"><button type="button" class="haupt" id="kopieren">In den Chat kopieren</button><button type="button" id="leeren">Leeren</button></div><p class="klein">□/□ macht einen Bruch, xⁿ eine Hochzahl, √ eine Wurzel. Mit ◀ und ▶ kommst du aus einer Klammer heraus. Oben wechselst du zwischen Zahlen, Funktionen und Zeichen. Unter dem Feld siehst du, wie die Formel aussieht.</p>`);
    const fs = (C.felder || [{ name: "Antwort" }]).map(f => { const b = document.createElement("div"); b.className = "karte";
      if (C.felder && (C.felder.length > 1 || f.frage)) { const l = document.createElement("div"); l.className = "frage"; Tex.text(l, f.frage || f.name + ":"); b.appendChild(l); }
      $("felder").appendChild(b); return { name: f.name, feld: Tastatur.feld(b, { platzhalter: f.platzhalter, tastatur: f.tastatur }) }; });
    $("kopieren").addEventListener("click", e => { const t = fs.filter(f => f.feld.wert()).map(f => (fs.length > 1 ? f.name + ": " : "") + "$" + f.feld.tex() + "$"); kopiere(t.length ? "Meine Antwort: " + t.join("; ") : "", e.currentTarget); });
    $("leeren").addEventListener("click", () => fs.forEach(f => { f.feld.input.value = ""; f.feld.input.dispatchEvent(new Event("input")); }));
    fs[0].feld.input.focus();
  }

  function zufall(C) {
    seite(C, `<div class="knoepfe" id="knoepfe"></div><p class="stand" id="stand" aria-live="polite"></p><svg id="balken" class="diagramm" role="img" aria-label="Relative Häufigkeiten"></svg><p class="klein" id="legende"></p><div id="verlaufBox"><h2 id="verlaufTitel"></h2><svg id="verlauf" class="diagramm" role="img" aria-label="Verlauf der relativen Häufigkeit"></svg></div>`);
    let zaehler, n, verlauf, letztes;
    const prozent = v => z(v * 100, 1) + " %", nett = m => { for (const s of [0.05, 0.1, 0.2, 0.25, 0.5, 1]) if (s * 4 >= m) return s; return 1; };
    const e2 = (s, tag, a) => el(tag, a, s);
    function neu() { zaehler = C.ergebnisse.map(() => 0); n = 0; verlauf = []; letztes = ""; zeichne(); }
    function ziehen(k) { for (let i = 0; i < k; i++) { const r = C.ziehe(); zaehler[r.index]++; n++; letztes = r.text || C.ergebnisse[r.index]; if (C.verfolge != null) verlauf.push(zaehler[C.verfolge] / n); } zeichne(); }
    function zeichne() { $("stand").textContent = n === 0 ? `Noch keine ${C.wort}.` : `${z(n, 0)} ${n === 1 ? C.einzahl : C.wort}. Zuletzt: ${letztes}`; balken(); kurve(); }
    function balken() {
      const s = $("balken"); s.textContent = ""; const Wb = Math.max(280, Math.round(s.getBoundingClientRect().width)), Hb = Math.round(Math.min(300, Math.max(220, Wb * 0.42)));
      s.setAttribute("viewBox", `0 0 ${Wb} ${Hb}`); s.style.height = Hb + "px";
      const L = 46, R = 10, T = 12, B = 26, k = C.ergebnisse.length, bw = (Wb - L - R) / k, rel = zaehler.map(c => (n ? c / n : 0)), th = C.wahrscheinlichkeit;
      const max = Math.max(0.05, ...rel, ...(th || []).map(v => v * 1.25)), st = nett(max), top = Math.ceil(max / st) * st, y = v => T + (Hb - T - B) * (1 - v / top);
      for (let v = 0; v <= top + 1e-9; v += st) { e2(s, "line", { x1: L, x2: Wb - R, y1: y(v), y2: y(v), stroke: "var(--grid)" }); e2(s, "text", { x: L - 6, y: y(v) + 4, "text-anchor": "end", fill: "var(--muted)", class: "tick" }).textContent = prozent(v); }
      rel.forEach((v, i) => { const x = L + i * bw; e2(s, "rect", { x: x + bw * 0.15, y: y(v), width: bw * 0.7, height: y(0) - y(v), fill: "var(--f1)", "fill-opacity": 0.8 });
        if (th) e2(s, "line", { x1: x + bw * 0.08, x2: x + bw * 0.92, y1: y(th[i]), y2: y(th[i]), stroke: "var(--ink)", "stroke-width": 2.5 });
        e2(s, "text", { x: x + bw / 2, y: Hb - 8, "text-anchor": "middle", fill: "var(--ink)", class: "tick" }).textContent = C.ergebnisse[i]; });
      e2(s, "line", { x1: L, x2: Wb - R, y1: y(0), y2: y(0), stroke: "var(--axis)", "stroke-width": 1.4 });
      $("legende").textContent = "Blaue Balken: relative Häufigkeiten bisher." + (th ? " Schwarze Striche: Wahrscheinlichkeit." : "");
    }
    function kurve() {
      if (C.verfolge == null) { $("verlaufBox").hidden = true; return; }
      $("verlaufTitel").textContent = `Relative Häufigkeit von „${C.ergebnisse[C.verfolge]}“ im Verlauf der ${C.wort}`;
      const s = $("verlauf"); s.textContent = ""; const Wv = Math.max(280, Math.round(s.getBoundingClientRect().width)), Hv = 190, L = 46, R = 12, T = 10, B = 24;
      s.setAttribute("viewBox", `0 0 ${Wv} ${Hv}`); s.style.height = Hv + "px";
      const pT = C.wahrscheinlichkeit ? C.wahrscheinlichkeit[C.verfolge] : null, top = Math.min(1, Math.max(0.1, (pT || 0.2) * 3)), st = nett(top);
      const N = Math.max(10, n), x = i => L + (Wv - L - R) * i / N, y = v => T + (Hv - T - B) * (1 - Math.min(v, top) / top);
      for (let v = 0; v <= top + 1e-9; v += st) { e2(s, "line", { x1: L, x2: Wv - R, y1: y(v), y2: y(v), stroke: "var(--grid)" }); e2(s, "text", { x: L - 6, y: y(v) + 4, "text-anchor": "end", fill: "var(--muted)", class: "tick" }).textContent = prozent(v); }
      e2(s, "text", { x: Wv - R, y: Hv - 6, "text-anchor": "end", fill: "var(--muted)", class: "tick" }).textContent = z(N, 0); e2(s, "text", { x: L, y: Hv - 6, fill: "var(--muted)", class: "tick" }).textContent = "0";
      if (pT != null) e2(s, "line", { x1: L, x2: Wv - R, y1: y(pT), y2: y(pT), stroke: "var(--ink)", "stroke-width": 1.5, "stroke-dasharray": "6 5" });
      if (verlauf.length) { const sch = Math.max(1, Math.floor(verlauf.length / (Wv * 2))); let d = ""; for (let i = 0; i < verlauf.length; i += sch) d += (d ? "L" : "M") + x(i + 1).toFixed(1) + " " + y(verlauf[i]).toFixed(1); e2(s, "path", { d, fill: "none", stroke: "var(--f2)", "stroke-width": 2 }); }
    }
    C.anzahlen = C.anzahlen || [1, 10, 100, 1000]; C.wort = C.wort || "Versuche"; C.einzahl = C.einzahl || "Versuch";
    C.anzahlen.forEach((k, i) => $("knoepfe").appendChild(knopf(k === 1 ? "1-mal" : z(k, 0) + "-mal", () => ziehen(k), i === 0 ? "haupt" : "")));
    $("knoepfe").appendChild(knopf("Von vorn", neu)); beiGroesse(zeichne); neu();
  }
  return { funktionen, lernschritte, uebung, tastatur, zufall, probearbeit: C => probearbeit(C, { seite, $, beiGroesse, rundPruefen }), version: "1.0.0" };
})();
