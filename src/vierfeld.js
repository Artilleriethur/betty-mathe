/* Vierfeldertafel mit gekoppeltem Baum: Zelle antippen markiert den Pfad und umgekehrt, Baum umdrehbar
   (bedingte Wahrscheinlichkeiten in beide Richtungen), Lücken in Tafel und Baum. Werte als Anzahlen oder Wahrscheinlichkeiten. */
function vierfeldSeite(C, H) {
  const { seite, $, beiGroesse } = H;
  seite(C, `<div class="karte"><div class="vf-wrap"><table class="vierfeld" id="vf"></table></div><p class="klein" id="vfhin"></p></div>
    <div class="karte"><div class="knoepfe" style="margin:0 0 6px"><button type="button" id="umdrehen"></button></div><svg id="baum" class="baum" role="img" aria-label="Baumdiagramm"></svg><div id="rechnung" aria-live="polite"></div></div>
    <div id="luecken"></div><div id="aufgaben"></div><div class="karte"><p id="stand"></p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
  const ka = (C.kurz && C.kurz.a) || ["A", "Ā"], kb = (C.kurz && C.kurz.b) || ["B", "B̄"], la = C.a || ka, lb = C.b || kb;
  const anzahl = !!C.anzahl, Q = C.anzahl || C.p, form = C.darstellung || (anzahl ? "bruch" : "dezimal");
  const durch = (a, b) => Bruch.kurz({ z: a.z * b.n, n: a.n * b.z, dez: a.dez || b.dez });
  const v = [0, 1].map(i => [0, 1].map(j => Bruch.lies(Q[i][j])));
  const zs = i => Bruch.plus(v[i][0], v[i][1]), ss = j => Bruch.plus(v[0][j], v[1][j]), ges = Bruch.plus(zs(0), zs(1));
  const p = x => anzahl ? durch(x, ges) : x;                      // Wahrscheinlichkeit einer Zelle/Summe
  const fmt = b => form === "prozent" ? z(Bruch.wert(b) * 100, 2) + "%" : form === "dezimal" || b.dez ? z(Bruch.wert(b), 4) : Bruch.text(Bruch.kurz(b));
  const tafelText = b => anzahl ? z(Bruch.wert(b), 2) : fmt(b);
  const texName = s => /̄$/.test(s) ? "\\overline{" + s.slice(0, -1) + "}" : s;
  const OFFEN = new Set(C.offen || []), BOFFEN = new Set(C.baumOffen || []);
  let erst = C.start === "b" ? "b" : "a"; const mk = new Set(), luecken = [];
  // Tafel
  const T = $("vf"), kopf = T.insertRow();
  kopf.insertCell().className = "ecke";
  [0, 1].forEach(j => { const c = document.createElement("th"); c.innerHTML = `<b></b><small></small>`; c.querySelector("b").textContent = kb[j]; c.querySelector("small").textContent = lb[j] !== kb[j] ? lb[j] : ""; kopf.appendChild(c); });
  const sh = document.createElement("th"); sh.textContent = "Summe"; kopf.appendChild(sh);
  const zellen = {};
  function feld(td, key, wert) {
    if (!OFFEN.has(key)) { td.textContent = tafelText(wert); return; }
    const [r1, c1] = key.split(""), nm = r1 === "s" ? (c1 === "s" ? "gesamt" : kb[+c1 - 1]) : c1 === "s" ? ka[+r1 - 1] : ka[+r1 - 1] + "∩" + kb[+c1 - 1];
    const L = { key, wert, wo: "tafel", name: nm }; td.classList.add("luecke");
    L.feld = Tastatur.feld(td, { platzhalter: "?", tastatur: C.tastatur || "stochastik", vorschau: false, beiEnter: pruefe, tastaturNach: $("vf").parentNode }); luecken.push(L);
  }
  [0, 1].forEach(i => {
    const r = T.insertRow(), h = document.createElement("th"); h.innerHTML = `<b></b><small></small>`; h.querySelector("b").textContent = ka[i]; h.querySelector("small").textContent = la[i] !== ka[i] ? la[i] : ""; r.appendChild(h);
    [0, 1].forEach(j => { const td = r.insertCell(); td.className = "innen"; zellen[i + "" + j] = td; feld(td, (i + 1) + "" + (j + 1), v[i][j]); td.addEventListener("click", e => { if (e.target.closest(".feld")) return; schalte(i, j); }); });
    feld(r.insertCell(), (i + 1) + "s", zs(i));
  });
  const rs = T.insertRow(), sth = document.createElement("th"); sth.textContent = "Summe"; rs.appendChild(sth);
  [0, 1].forEach(j => feld(rs.insertCell(), "s" + (j + 1), ss(j))); feld(rs.insertCell(), "ss", ges);
  $("vfhin").textContent = "Tippe ein inneres Feld der Tafel oder einen Pfad im Baum an. Beide gehören zusammen.";
  // Baum
  const pfadKey = (i, j) => erst === "a" ? ka[i] + "-" + kb[j] : kb[j] + "-" + ka[i];
  function baumDaten() {
    const st = erst === "a" ? [C.stufeA || "1. Stufe", C.stufeB || "2. Stufe"] : [C.stufeB || "1. Stufe", C.stufeA || "2. Stufe"];
    const kinder = [0, 1].map(x => {
      const erste = erst === "a" ? p(zs(x)) : p(ss(x)), n1 = erst === "a" ? ka[x] : kb[x];
      return { name: n1, p: fmt(erste), offen: BOFFEN.has(n1), kinder: [0, 1].map(y => {
        const [i, j] = erst === "a" ? [x, y] : [y, x], n2 = erst === "a" ? kb[y] : ka[y], bed = durch(v[i][j], erst === "a" ? zs(i) : ss(j));
        return { name: n2, p: fmt(bed), offen: BOFFEN.has(n1 + "-" + n2) }; }) };
    });
    return { stufen: st, kinder };
  }
  let B = baumDaten(), erg = { blaetter: [] };
  function baumLuecken() {
    luecken.filter(L => L.wo === "baum").forEach(L => { L.box.remove(); }); for (let k = luecken.length - 1; k >= 0; k--) if (luecken[k].wo === "baum") luecken.splice(k, 1);
    const box = $("luecken"); box.textContent = "";
    (function suche(k, pfad) { (k.kinder || []).forEach(c => { const p2 = pfad.concat([c]); if (c.offen) luecken.push({ wo: "baum", k: c, pfad: p2, wert: Bruch.lies(c.p), name: p2.map(q => q.name).join("→") }); suche(c, p2); }); })(B, []);
    const lb2 = luecken.filter(L => L.wo === "baum"); if (!lb2.length) return;
    const kk = document.createElement("div"); kk.className = "karte"; box.appendChild(kk);
    const t = document.createElement("p"); t.className = "frage"; t.textContent = "Ergänze die Äste mit ? im Baum."; kk.appendChild(t);
    lb2.forEach(L => { const z2 = document.createElement("div"); z2.className = "feldzeile"; kk.appendChild(z2); L.box = z2; const s = document.createElement("span"); s.className = "vor"; s.textContent = L.name + ":"; z2.appendChild(s);
      L.feld = Tastatur.feld(z2, { platzhalter: "?", tastatur: C.tastatur || "stochastik", vorschau: "auto", beiEnter: pruefe }); });
  }
  const zeichne = () => { erg = baumZeichnen($("baum"), B, { markiert: mk, produkte: C.produkte !== false, beiKlick: (key) => { const t = erg.blaetter.find(q => erg.schl(q) === key); const n = t.map(q => q.name); const i = ka.indexOf(erst === "a" ? n[0] : n[1]), j = kb.indexOf(erst === "a" ? n[1] : n[0]); schalte(i, j); } }); };
  function schalte(i, j) { const key = pfadKey(i, j); mk.has(key) ? mk.delete(key) : mk.add(key); zellen[i + "" + j].classList.toggle("an", mk.has(key)); zeichne(); rechne(); }
  function rechne() {
    const box = $("rechnung"); box.textContent = "";
    [0, 1].forEach(i => [0, 1].forEach(j => {
      if (!mk.has(pfadKey(i, j))) return;
      const A1 = texName(ka[i]), B1 = texName(kb[j]), [x, y] = erst === "a" ? [A1, B1] : [B1, A1];
      const erste = erst === "a" ? p(zs(i)) : p(ss(j)), bed = durch(v[i][j], erst === "a" ? zs(i) : ss(j)), schnitt = p(v[i][j]);
      const tx = b => form === "prozent" ? z(Bruch.wert(b) * 100, 2).replace(",", "{,}") + "\\,\\%" : form === "dezimal" || b.dez ? z(Bruch.wert(b), 4).replace(",", "{,}") : Bruch.tex(Bruch.kurz(b));
      const d1 = document.createElement("div"); d1.className = "zeile"; box.appendChild(d1);
      Tex.formel(`P(${x}\\cap ${y}) = P(${x})\\cdot P_{${x}}(${y}) = ${tx(erste)}\\cdot ${tx(bed)} = ${tx(schnitt)}`, d1);
      const d2 = document.createElement("div"); d2.className = "zeile"; box.appendChild(d2);
      const nenner = erst === "a" ? zs(i) : ss(j), mitte = anzahl ? `\\frac{${z(Bruch.wert(v[i][j]), 2)}}{${z(Bruch.wert(nenner), 2)}}` : `\\frac{${tx(schnitt)}}{${tx(erste)}}`;
      const kb2 = Bruch.kurz(bed), ende = form === "bruch" && !bed.dez ? (anzahl && (kb2.z !== Bruch.wert(v[i][j]) || kb2.n !== Bruch.wert(nenner)) ? " = " + Bruch.tex(kb2) : "") : " = " + tx(bed);
      Tex.formel(`P_{${x}}(${y}) = \\frac{P(${x}\\cap ${y})}{P(${x})} = ${mitte}${ende}` + (Bruch.wert(kb2) * 1000 % 1 > 1e-9 ? `\\approx ${z(Bruch.wert(bed), 3).replace(",", "{,}")}` : ""), d2);
    }));
  }
  const um = $("umdrehen"), umText = () => um.textContent = "Baum umdrehen: erst " + (erst === "a" ? kb[0] + "/" + kb[1] : ka[0] + "/" + ka[1]);
  um.addEventListener("click", () => {
    const alt = [...mk]; mk.clear(); erst = erst === "a" ? "b" : "a";
    alt.forEach(k => { const n = k.split("-"); mk.add(n[1] + "-" + n[0]); });
    B = baumDaten(); baumLuecken(); umText(); zeichne(); rechne(); stand();
  });
  function pruefe() {
    luecken.forEach(L => {
      const roh = L.feld.wert(); if (!roh || L.ok) return; L.versuche = (L.versuche || 0) + 1;
      const soll = anzahl && L.wo === "tafel" ? z(Bruch.wert(L.wert), 6).replace(/\./g, "") : (L.wert.dez ? z(Bruch.wert(L.wert), 6).replace(/\./g, "") : L.wert.z + "/" + L.wert.n);
      L.ok = Term.gleich(roh, soll, {}) || Term.gleich(roh, soll, { runden: 3 });
      L.feld.input.classList.toggle("richtig", L.ok); L.feld.input.classList.toggle("falsch", !L.ok);
      if (L.ok) { L.feld.sperre(true); if (L.k) L.k.geloest = true; }
    });
    zeichne(); rechne(); stand();
  }
  if (OFFEN.size || BOFFEN.size) { const kn = document.createElement("div"); kn.className = "knoepfe"; kn.appendChild(knopf("Lücken prüfen", pruefe, "haupt")); $("vf").closest(".karte").appendChild(kn); }
  const st = (C.fragen || []).map((a, i) => { const b = document.createElement("div"); b.className = "karte"; b.innerHTML = `<div class="nr">Frage ${i + 1}</div>`; $("aufgaben").appendChild(b); return baueAufgabe(b, a, i + 1, stand); });
  function stand() { const n = luecken.length, ok = luecken.filter(L => L.ok).length; $("stand").innerHTML = [n ? "<b>Lücken: " + ok + " von " + n + "</b>" : "", st.length ? "<b>Fragen: " + st.filter(s => s.richtig).length + " von " + st.length + " richtig</b>" : ""].filter(Boolean).join(" · ") || "Tippe Felder oder Pfade an. Fragen kannst du in den Chat schreiben."; }
  $("kopieren").addEventListener("click", e => {
    const zz = [ergebnisText(C.titel || "Vierfeldertafel", st)];
    if (luecken.length) zz.push("Lücken: " + luecken.map(L => L.name + " = " + (L.feld.wert() ? Term.lesbar(L.feld.wert()) : "–") + (L.ok ? " ✓" : L.versuche ? " ✗" : "")).join("; "));
    if (mk.size) zz.push("Angetippt: " + [...mk].join(", "));
    kopiere(zz.join("\n"), e.currentTarget);
  });
  umText(); baumLuecken(); beiGroesse(zeichne); zeichne(); rechne(); stand();
}
