/* Zuordnen: Paare durch Antippen bilden (Term ↔ Graph, Begriff ↔ Beispiel …). Einträge sind Text mit $…$ oder kleine
   Graphen: { f: x => …, ansicht } bzw. { zeichne: (g, p) => …, ansicht }. Mit Ablenkern rechts, Prüfen, Lösung nach Versuchen. */
function zuordnenSeite(C, H) {
  const { seite, $, beiGroesse } = H;
  seite(C, `<div class="karte"><div class="zuordnen"><div><div class="spaltenkopf" id="kopfL"></div><div id="spL"></div></div><div><div class="spaltenkopf" id="kopfR"></div><div id="spR"></div></div></div>
    <div class="rueck" id="zrueck" hidden></div><div class="knoepfe"><button type="button" class="haupt" id="zpruefen">Prüfen</button><button type="button" id="zloesung" hidden>Lösung zeigen</button></div></div>
    <div class="karte"><p class="klein">Tippe links einen Eintrag an und dann rechts den passenden. Falsch gesetzte Paare kannst du einfach neu verbinden.</p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
  $("kopfL").textContent = C.links || ""; $("kopfR").textContent = C.rechts || "";
  const BU = "ABCDEFGHIJKLMNOP", figuren = [];
  const L = C.paare.map((p, i) => ({ i, inhalt: p.links, ziel: i })), R0 = C.paare.map((p, i) => ({ inhalt: p.rechts, paar: i })).concat((C.extra || []).map(x => ({ inhalt: x, paar: -1 })));
  // Mischen, aber nie in der Ausgangsreihenfolge
  let R = R0.slice(); for (let k = 0; k < 20; k++) { R.sort(() => Math.random() - 0.5); if (R.some((r, i) => r.paar !== i)) break; }
  R.forEach((r, j) => r.j = j);
  const zu = new Map(); let wahl = null, versuche = 0, fertig = false, frueher = [];
  function inhalt(box, x) {
    if (x && typeof x === "object" && (x.f || x.zeichne)) {
      const s = document.createElementNS(NS, "svg"); s.setAttribute("class", "mini"); s.setAttribute("role", "img"); s.setAttribute("aria-label", x.text || "Graph"); box.appendChild(s);
      const A = Object.assign({ xMin: -5, xMax: 5, yMin: -4, yMax: 6, hoehe: 120 }, C.ansicht || {}, x.ansicht || {});
      figuren.push(() => { leinwand(s, A); if (x.f) g.kurve(x.f, { farbe: x.farbe || "var(--f1)" }); if (x.zeichne) x.zeichne(g, P); });
      if (x.text) { const t = document.createElement("div"); t.className = "unter"; Tex.text(t, x.text); box.appendChild(t); }
    } else { const t = document.createElement("div"); Tex.text(t, typeof x === "object" ? x.text : x); box.appendChild(t); }
  }
  function karte(eltern, marke, x) {
    const b = document.createElement("button"); b.type = "button"; b.className = "zkarte";
    const m = document.createElement("span"); m.className = "marke"; m.textContent = marke; b.appendChild(m);
    const i = document.createElement("div"); i.className = "inhalt"; b.appendChild(i); inhalt(i, x);
    const z = document.createElement("span"); z.className = "verbunden"; b.appendChild(z); eltern.appendChild(b); return b;
  }
  L.forEach(l => { l.el = karte($("spL"), String(l.i + 1), l.inhalt); l.el.addEventListener("click", () => tippe(l, null)); });
  R.forEach(r => { r.el = karte($("spR"), BU[r.j], r.inhalt); r.el.addEventListener("click", () => tippe(null, r)); });
  function tippe(l, r) {
    if (fertig) return;
    if (l) { if (l.ok) return; if (wahl && wahl.r) { verbinde(l, wahl.r); wahl = null; } else wahl = wahl && wahl.l === l ? null : { l }; }
    else if (r) { if (r.ok) return; if (wahl && wahl.l) { verbinde(wahl.l, r); wahl = null; } else wahl = wahl && wahl.r === r ? null : { r }; }
    male();
  }
  function verbinde(l, r) { for (const [k, v] of zu) if (v === r) zu.delete(k); zu.set(l, r); l.falsch = r.falsch = false; }
  function male() {
    L.forEach(l => { const r = zu.get(l); l.el.querySelector(".verbunden").textContent = r ? "→ " + BU[r.j] : ""; l.el.classList.toggle("gewaehlt", !!(wahl && wahl.l === l)); l.el.classList.toggle("ok", !!l.ok); l.el.classList.toggle("falsch", !!l.falsch); });
    R.forEach(r => { const l = [...zu].find(([, v]) => v === r); r.el.querySelector(".verbunden").textContent = l ? "← " + (l[0].i + 1) : ""; r.el.classList.toggle("gewaehlt", !!(wahl && wahl.r === r)); r.el.classList.toggle("ok", !!r.ok); r.el.classList.toggle("falsch", !!r.falsch); });
  }
  $("zpruefen").addEventListener("click", () => {
    if (fertig) return; versuche++; let n = 0;
    L.forEach(l => { const r = zu.get(l); if (!r) return; if (r.paar === l.ziel) { l.ok = r.ok = true; n++; } else { l.falsch = r.falsch = true; frueher.push((l.i + 1) + "→" + BU[r.j]); } });
    const ok = L.filter(l => l.ok).length, rb = $("zrueck"); rb.hidden = false;
    fertig = ok === L.length; rb.className = "rueck" + (fertig ? " gut" : " schlecht");
    rb.textContent = fertig ? (C.lob || "Alles richtig zugeordnet.") : ok + " von " + L.length + " richtig. " + (zu.size < L.length ? "Es fehlen noch Paare. " : "") + "Verbinde die roten neu.";
    if (!fertig && versuche >= (C.loesungNach ?? 3)) $("zloesung").hidden = false;
    male();
  });
  $("zloesung").addEventListener("click", () => { L.forEach(l => { const r = R.find(x => x.paar === l.ziel); zu.set(l, r); l.ok = r.ok = true; l.falsch = r.falsch = false; }); fertig = true; C.geloest = true; male(); $("zloesung").hidden = true; $("zrueck").textContent = "Das ist die richtige Zuordnung."; });
  $("kopieren").addEventListener("click", e => {
    const ok = L.filter(l => l.ok && !C.geloest).length;
    kopiere("Meine Ergebnisse: " + (C.titel || "Zuordnen") + "\n" + (versuche ? ok + " von " + L.length + " richtig zugeordnet nach " + versuche + (versuche === 1 ? " Prüfung" : " Prüfungen") : "noch nicht geprüft")
      + (C.geloest ? " (Lösung angesehen)" : "") + (frueher.length ? "\nZuerst falsch: " + [...new Set(frueher)].join(", ") : ""), e.currentTarget);
  });
  beiGroesse(() => figuren.forEach(f => f())); figuren.forEach(f => f()); male();
}

/* Fehlersuche: vorgerechnete Lösung mit Fehler. Erst die erste falsche Zeile antippen, dann erklären und verbessern. */
function fehlersucheSeite(C, H) {
  const { seite, $ } = H;
  seite(C, `<div id="fs"></div><div class="karte"><p id="stand"></p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
  const liste = (C.aufgaben || [C]).map((A, ai, alle) => {
    const k = document.createElement("div"); k.className = "karte fehlersuche"; $("fs").appendChild(k);
    k.innerHTML = `<div class="nr">${alle.length > 1 ? "Aufgabe " + (ai + 1) : "Aufgabe"}</div>`;
    const auf = document.createElement("div"); auf.className = "frage"; Tex.text(auf, A.aufgabe || A.frage || ""); k.appendChild(auf);
    const hin = document.createElement("p"); hin.className = "klein"; hin.textContent = A.hinweis || "Tippe die erste Zeile an, in der ein Fehler steckt."; k.appendChild(hin);
    const E = { A, versuche: 0, gefunden: false, getippt: [] }, fehler = Array.isArray(A.fehler) ? A.fehler[0] : A.fehler;
    const zeilen = A.zeilen.map((z, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "fzeile";
      const n = document.createElement("span"); n.className = "fnr"; n.textContent = (i + 1); b.appendChild(n);
      const t = document.createElement("span"); t.className = "ftext"; Tex.text(t, z); b.appendChild(t);
      b.addEventListener("click", () => tippe(i)); k.appendChild(b); return b;
    });
    const rueck = document.createElement("div"); rueck.className = "rueck"; rueck.hidden = true; k.appendChild(rueck);
    const teil2 = document.createElement("div"); teil2.className = "teil2"; teil2.hidden = true; k.appendChild(teil2);
    function tippe(i) {
      if (E.gefunden) return; E.versuche++; E.getippt.push(i + 1); rueck.hidden = false;
      if (i === fehler) {
        E.gefunden = true; zeilen[i].classList.add("fehlerzeile"); zeilen.forEach((z, j) => { if (j < i) z.classList.add("stimmt"); });
        rueck.className = "rueck gut"; rueck.textContent = "Genau, in Zeile " + (i + 1) + " steckt der Fehler."; zeige2(); stand(); return;
      }
      rueck.className = "rueck schlecht";
      rueck.textContent = i < fehler ? "Zeile " + (i + 1) + " stimmt noch. Der Fehler kommt später." : "In Zeile " + (i + 1) + " wirkt schon ein Fehler nach. Der erste Fehler steckt weiter oben.";
      if (E.versuche >= 3 && A.tipp) { rueck.textContent += " Tipp: "; const s = document.createElement("span"); Tex.text(s, A.tipp); rueck.appendChild(s); }
      stand();
    }
    function zeige2() {
      teil2.hidden = false;
      const f1 = document.createElement("p"); f1.className = "frage"; f1.textContent = A.frageWas || "Was ist in dieser Zeile falsch?"; teil2.appendChild(f1);
      E.text = Tastatur.feld(teil2, { mehrzeilig: true, zeilen: 2, platzhalter: "Erkläre den Fehler in eigenen Worten", tastatur: A.tastatur || C.tastatur });
      if (A.richtig != null) {
        const f2 = document.createElement("p"); f2.className = "frage"; f2.textContent = A.frageRichtig || "Wie muss die Zeile richtig lauten?"; teil2.appendChild(f2);
        const fr = document.createElement("div"); teil2.appendChild(fr);
        E.frage = baueAufgabe(fr, { frage: "", antwort: A.richtig, form: A.form, runden: A.runden, tipp: A.tipp, weg: A.erklaerung, wegNach: A.wegNach ?? 2, tastatur: A.tastatur || C.tastatur, lob: "Richtig verbessert." }, "verbessert", stand);
      } else if (A.erklaerung) {
        const b = knopf("Erklärung zeigen", () => { Tex.text(w, A.erklaerung); w.hidden = false; b.hidden = true; E.erklaert = true; stand(); }); b.className = "klein-knopf"; teil2.appendChild(b);
        const w = document.createElement("div"); w.className = "weg"; w.hidden = true; teil2.appendChild(w);
      }
    }
    return E;
  });
  function stand() { $("stand").innerHTML = "<b>" + liste.filter(E => E.gefunden).length + " von " + liste.length + " Fehlern gefunden</b>"; }
  $("kopieren").addEventListener("click", e => {
    const zz = ["Meine Fehlersuche: " + (C.titel || "")];
    liste.forEach((E, i) => {
      let s = (liste.length > 1 ? (i + 1) + ") " : "") + (E.gefunden ? "Fehler in Zeile " + E.getippt[E.getippt.length - 1] + " gefunden" + (E.versuche > 1 ? " (vorher getippt: " + E.getippt.slice(0, -1).join(", ") + ")" : "") : E.versuche ? "noch nicht gefunden (getippt: " + E.getippt.join(", ") + ")" : "nicht bearbeitet");
      if (E.text && E.text.wert()) s += "\n   Erklärung: „" + E.text.wert().replace(/\s*\n\s*/g, " / ") + "“";
      if (E.frage && E.frage.versuche) s += "\n   Verbessert: " + (E.frage.richtig ? "richtig" : "noch nicht richtig") + ", zuletzt " + E.frage.eingabe + (E.frage.weg ? " (Lösungsweg angesehen)" : "");
      zz.push(s);
    });
    kopiere(zz.join("\n"), e.currentTarget);
  });
  stand();
}
