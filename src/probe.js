/* Probearbeit: Probe-Klassenarbeit oder Probetest mit Teil A/B, Punkten, Uhr, Startauswahl und Auswertung.
   Ergebnisfelder werden nach der Abgabe automatisch geprüft, Texte und Zeichnungen bewertet Betty im Chat. */
function probearbeit(C, H) {
  const { seite, $, beiGroesse, rundPruefen } = H;
  seite(C, `<div id="pa"></div>`);
  const wurzel = $("pa"), BU = "ABCDEFGH";
  const neu = (tag, klasse, eltern, html) => { const e = document.createElement(tag); if (klasse) e.className = klasse; if (html != null) Tex.text(e, html); if (eltern) eltern.appendChild(e); return e; };
  const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  const P1 = p => (p === 1 ? "1 Punkt" : z(p, 1) + " Punkte"), PK = p => z(p, 1) + " P";

  // Teile und Aufgaben vereinheitlichen
  const TEILE = (C.teile || [{ id: "", aufgaben: C.aufgaben || [], minuten: C.minuten, taschenrechner: C.taschenrechner, hilfsmittel: C.hilfsmittel }]).map((T, i) => {
    const id = T.id ?? (C.teile ? BU[i] : "");
    return Object.assign({}, T, { id, titel: T.titel || (id ? "Teil " + id : "Aufgaben"), taschenrechner: !!(T.taschenrechner ?? C.taschenrechner),
      hilfsmittel: T.hilfsmittel || (T.taschenrechner ?? C.taschenrechner ? "Taschenrechner erlaubt" : "ohne Hilfsmittel"), aufgaben: T.aufgaben || [] });
  });
  const unterteile = A => (A.teile || [A]).map(t => {
    const felder = t.felder || (t.antwort != null ? [{ vor: t.vor, nach: t.nach, antwort: t.antwort, runden: t.runden, toleranz: t.toleranz, form: t.form, exakt: t.exakt, fehler: t.fehler, punkte: t.feldpunkte, platzhalter: t.platzhalter, tastatur: t.tastatur }] : []);
    return Object.assign({}, t, { felder, teile: undefined, auswahl: !!t.optionen });
  });
  const hatAuswahl = TEILE.some(T => T.aufgaben.some(A => unterteile(A).some(t => t.auswahl)));
  const O = Object.assign({ teile: TEILE.map(T => T.id).join(""), auswahl: true, uhr: true, loesungen: true, tipps: true, waehlbar: true }, C.optionen || {});
  const darf = k => O.waehlbar === true ? k !== "taschenrechner" : Array.isArray(O.waehlbar) && O.waehlbar.includes(k);
  let wahl = { teile: O.teile, auswahl: O.auswahl && hatAuswahl, uhr: O.uhr, loesungen: O.loesungen, rechner: null };
  let plan = [], jetzt = -1, tick = null, figuren = [];

  // Punkte einer Teilaufgabe aufteilen: Felder mit eigenen Punkten, sonst bei reinen Ergebnisaufgaben gleichmäßig
  function punkteVerteilen(t) {
    const p = t.punkte || 0;
    if (t.auswahl) { t.auto = p; t.offenP = 0; return; }
    const eigene = t.felder.some(f => f.punkte != null), nurFelder = t.felder.length && !t.begruendung && !t.papier;
    t.felder.forEach(f => { f.p = eigene ? (f.punkte || 0) : nurFelder ? p / t.felder.length : 0; });
    t.auto = t.felder.filter(f => f.antwort != null).reduce((s, f) => s + f.p, 0); t.offenP = Math.max(0, p - t.auto);
  }

  function startseite() {
    wurzel.textContent = "";
    const k = neu("div", "karte start", wurzel);
    const gewaehlt = () => TEILE.filter(T => wahl.teile.includes(T.id) || !T.id);
    const info = neu("div", "", k), zeichneInfo = () => {
      info.textContent = "";
      const ts = gewaehlt(); let min = 0, pkt = 0;
      const tab = neu("table", "teile", info), kopf = neu("tr", "", tab);
      ["", "Zeit", "Hilfsmittel", "Punkte"].forEach(h => neu("th", "", kopf).textContent = h);
      ts.forEach(T => {
        const p = T.aufgaben.reduce((s, A) => s + unterteile(A).filter(t => wahl.auswahl || !t.auswahl).reduce((u, t) => u + (t.punkte || 0), 0), 0);
        min += T.minuten || 0; pkt += p;
        const tr = neu("tr", "", tab); neu("td", "", tr).textContent = T.titel; neu("td", "", tr).textContent = T.minuten ? T.minuten + " min" : "–";
        neu("td", "", tr).textContent = hmText(T);
        neu("td", "", tr).textContent = z(p, 1);
      });
      neu("p", "summe", info).textContent = (min ? min + " Minuten · " : "") + P1(pkt);
    };
    const opt = neu("div", "wahl", k);
    if (TEILE.length > 1 && darf("teile")) {
      neu("p", "frage", opt).textContent = "Was willst du bearbeiten?";
      const ids = TEILE.map(T => T.id), moegl = [ids.join("")].concat(ids);
      moegl.forEach(m => { const l = neu("label", "", opt), r = neu("input", "", l); Object.assign(r, { type: "radio", name: "teile", checked: m === wahl.teile });
        neu("span", "", l).textContent = m.length > 1 ? "Alle Teile (" + m.split("").map(i => "Teil " + i).join(" und ") + ")" : "Nur Teil " + m;
        r.addEventListener("change", () => { wahl.teile = m; zeichneInfo(); }); });
    }
    const schalter = (name, text, wert, setze) => { const l = neu("label", "schalter", opt), c = neu("input", "", l); Object.assign(c, { type: "checkbox", checked: wert }); neu("span", "", l).textContent = text; c.addEventListener("change", () => { setze(c.checked); zeichneInfo(); }); };
    if (hatAuswahl && darf("auswahl")) schalter("auswahl", "Auswahlaufgaben (eine Antwort ist richtig) mit bearbeiten", wahl.auswahl, v => wahl.auswahl = v);
    if (TEILE.some(T => T.minuten) && darf("uhr")) schalter("uhr", "Mit Zeitvorgabe (die Uhr läuft rückwärts)", wahl.uhr, v => wahl.uhr = v);
    if (darf("loesungen")) schalter("loesungen", "Nach der Abgabe die Lösungen zeigen", wahl.loesungen, v => wahl.loesungen = v);
    if (darf("taschenrechner")) schalter("rechner", "Taschenrechner ist in allen Teilen erlaubt", !!wahl.rechner, v => wahl.rechner = v || null);
    zeichneInfo();
    neu("p", "klein", k, C.hinweis || "Rechne und zeichne auf Papier. Trage Ergebnisse in die Felder ein. Zeichnungen und Rechenwege kannst du am Ende als Foto in den Chat schicken.");
    neu("div", "knoepfe", k).appendChild(knopf("Start", starte, "haupt"));
  }
  const rechnerFuer = T => wahl.rechner ? true : T.taschenrechner;
  const hmText = T => rechnerFuer(T) && !T.taschenrechner ? "Taschenrechner erlaubt" : T.hilfsmittel;

  function starte() {
    plan = TEILE.filter(T => wahl.teile.includes(T.id) || !T.id).map(T => ({ T, sek: 0, abgegeben: false, aufgaben: [] }));
    wurzel.textContent = ""; figuren = [];
    const bar = neu("div", "uhr", wurzel); bar.id = "uhr";
    let nr = 0;
    plan.forEach((L, li) => {
      const sek = neu("section", "teil", wurzel); sek.hidden = true; L.el = sek;
      const kopf = neu("div", "teilkopf", sek); neu("h2", "", kopf).textContent = L.T.titel;
      neu("p", "klein", kopf).textContent = hmText(L.T) + (L.T.minuten ? " · " + L.T.minuten + " min" : "");
      if (L.T.text) neu("div", "frage", kopf, L.T.text);
      L.T.aufgaben.forEach(A => {
        const ts = unterteile(A).filter(t => wahl.auswahl || !t.auswahl); if (!ts.length) return;
        nr++; const ak = neu("div", "karte aufgabe-pa", sek), summe = ts.reduce((s, t) => s + (t.punkte || 0), 0);
        const kz = neu("div", "nr", ak); kz.textContent = "Aufgabe " + nr + (A.titel ? " · " : ""); if (A.titel) kz.appendChild(document.createTextNode(A.titel));
        const pz = neu("span", "pkt", kz); pz.textContent = P1(summe);
        if (A.text && A.teile) neu("div", "frage", ak, A.text);
        if (A.zeichne && A.ansicht) { const s = document.createElementNS(NS, "svg"); s.setAttribute("class", "fig"); s.setAttribute("role", "img"); s.setAttribute("aria-label", A.bild || "Abbildung zur Aufgabe"); ak.appendChild(s);
          rundPruefen({ ansicht: A.ansicht }, [g2 => A.zeichne(g2, P)]); figuren.push(() => { leinwand(s, A.ansicht); A.zeichne(g, P); }); }
        const eintrag = { nr, A, ts: [] };
        ts.forEach((t, ti) => {
          punkteVerteilen(t); const marke = nr + (ts.length > 1 ? "abcdefghij"[ti] : "");
          const tb = neu("div", "ta", ak), kopfT = neu("div", "ta-kopf", tb);
          if (ts.length > 1) neu("b", "", kopfT).textContent = "abcdefghij"[ti] + ")";
          neu("span", "ta-text", kopfT, A.teile ? t.text : (t.text || A.text));
          if (t.punkte) neu("span", "pkt", kopfT).textContent = PK(t.punkte);
          const S = { t, marke, felder: [], text: null, wahl: null, tipp: false, el: tb };
          if (t.auswahl) {
            const w = neu("div", "optionen", tb); S.wahl = w;
            t.optionen.forEach((o, i) => { const l = neu("label", "", w), r = neu("input", "", l), s = neu("span", "", l); Object.assign(r, { type: "radio", name: "w" + marke, value: i }); s.appendChild(document.createTextNode(BU[i] + ")  ")); const s2 = neu("span", "", s, o); });
          }
          t.felder.forEach((f, fi) => {
            const zeile = neu("div", "feldzeile", tb); if (f.vor) neu("span", "vor", zeile, f.vor);
            const fx = Tastatur.feld(zeile, { platzhalter: f.platzhalter || "Ergebnis", tastatur: f.tastatur || t.tastatur || A.tastatur || L.T.tastatur, vorschau: "auto" });
            if (f.nach) neu("span", "nach", zeile, f.nach);
            const erg = neu("div", "erg", tb); erg.hidden = true;
            S.felder.push({ f, fx, erg });
          });
          if (t.begruendung) S.text = Tastatur.feld(tb, { mehrzeilig: true, zeilen: t.zeilen || 3, platzhalter: typeof t.begruendung === "string" ? t.begruendung : "Deine Antwort, Begründung oder Beschreibung", tastatur: t.tastatur || A.tastatur || L.T.tastatur });
          if (t.papier) neu("p", "papier", tb).textContent = typeof t.papier === "string" ? t.papier : "Auf Papier zeichnen oder rechnen. Am Ende kannst du ein Foto in den Chat schicken.";
          if (t.tipp && O.tipps !== false) { const tk = neu("div", "tipp", tb, t.tipp); tk.hidden = true; const b = knopf("Tipp", () => { tk.hidden = false; S.tipp = true; b.hidden = true; }); b.className = "klein-knopf"; tb.appendChild(b); S.tippKnopf = b; }
          const ausw = neu("div", "auswertung", tb); ausw.hidden = true; S.ausw = ausw;
          eintrag.ts.push(S);
        });
        L.aufgaben.push(eintrag);
      });
      const ende = neu("div", "knoepfe abgabe", sek), b = knopf(L.T.titel + " abgeben", () => {
        if (b.dataset.sicher !== "1") { b.dataset.sicher = "1"; b.textContent = "Wirklich abgeben? Dann nochmal tippen."; setTimeout(() => { b.dataset.sicher = ""; b.textContent = L.T.titel + " abgeben"; }, 4000); return; }
        abgeben(li);
      }, "haupt"); ende.appendChild(b);
    });
    beiGroesse(() => figuren.forEach(f => f()));
    zeigeTeil(0);
  }

  function zeigeTeil(i) {
    jetzt = i; plan.forEach((L, j) => L.el.hidden = j !== i);
    figuren.forEach(f => f()); clearInterval(tick);
    const L = plan[i], start = Date.now() - L.sek * 1000, bar = $("uhr");
    const male = () => {
      L.sek = (Date.now() - start) / 1000; const rest = (L.T.minuten || 0) * 60 - L.sek, mitUhr = wahl.uhr && L.T.minuten;
      bar.className = "uhr" + (mitUhr && rest < 0 ? " vorbei" : mitUhr && rest < 300 ? " knapp" : "");
      bar.textContent = L.T.titel + " · " + (mitUhr ? (rest >= 0 ? "noch " + mmss(rest) : "Zeit um, " + mmss(-rest) + " drüber") : mmss(L.sek) + " bearbeitet");
    };
    male(); tick = setInterval(male, 1000); window.scrollTo(0, 0);
  }

  function pruefe(f, roh, rechner) {
    if (!roh) return { s: "leer" };
    if (f.antwort == null) return { s: "offen" };
    const o = { runden: f.runden, toleranz: f.toleranz, form: f.form };
    if (Term.gleich(roh, String(f.antwort), o)) return { s: "richtig" };
    if (Term.gleich(roh, String(f.antwort), Object.assign({ links: true }, o))) return { s: "richtig", hinweis: "klammer" };
    const bekannt = (f.fehler || []).find(x => Term.gleich(roh, String(x.antwort), {}));
    if (f.runden == null && !f.form && Term.gleich(roh, String(f.antwort), { runden: 2 })) return rechner && !f.exakt ? { s: "richtig", hinweis: "gerundet" } : { s: "gerundet", text: "Nur gerundet. Hier ist der exakte Wert verlangt." };
    return { s: "falsch", text: bekannt && bekannt.text };
  }

  function abgeben(i) {
    const L = plan[i]; L.abgegeben = true; clearInterval(tick);
    L.aufgaben.forEach(E => E.ts.forEach(S => { S.felder.forEach(F => F.fx.sperre(true)); if (S.text) S.text.sperre(true); if (S.wahl) S.wahl.querySelectorAll("input").forEach(r => r.disabled = true); if (S.tippKnopf) S.tippKnopf.hidden = true; }));
    L.el.querySelector(".abgabe").hidden = true;
    if (i + 1 < plan.length) return zeigeTeil(i + 1);
    auswerten();
  }

  function auswerten() {
    const bar = $("uhr"); bar.className = "uhr fertig"; bar.textContent = "Abgegeben";
    let auto = 0, autoMax = 0, offen = 0; const papier = [], tipps = [], leer = [];
    plan.forEach(L => {
      L.el.hidden = false; const rechner = rechnerFuer(L.T);
      L.aufgaben.forEach(E => E.ts.forEach(S => {
        const t = S.t; let p = 0, max = 0;
        S.felder.forEach(F => {
          const roh = F.fx.wert(), r = pruefe(F.f, roh, rechner); F.r = r; F.roh = roh;
          if (F.f.antwort != null) { max += F.f.p; if (r.s === "richtig") p += F.f.p; }
          F.erg.hidden = false; F.erg.className = "erg " + r.s;
          F.erg.textContent = { richtig: "✓ richtig" + (r.hinweis === "gerundet" ? " (gerundet)" : r.hinweis === "klammer" ? ". Setz beim Bruch Klammern: so wie du es getippt hast, steht alles hinter / im Nenner." : ""), falsch: "✗ falsch", gerundet: "≈ " + r.text, leer: "– nicht bearbeitet", offen: "Bewertet Betty" }[r.s] + (r.s === "falsch" && r.text ? ". " : "");
          if (r.s === "falsch" && r.text) { const s = neu("span", "", F.erg, r.text); }
        });
        if (t.auswahl) {
          const r = S.wahl.querySelector("input:checked"); S.gewaehlt = r ? +r.value : null; max = t.punkte || 0;
          if (S.gewaehlt === t.richtig) p = max;
          S.wahl.querySelectorAll("label").forEach((l, i) => { if (wahl.loesungen && i === t.richtig) l.classList.add("richtig"); if (i === S.gewaehlt && i !== t.richtig) l.classList.add("falsch"); });
        }
        S.p = p; S.max = max; auto += p; autoMax += max; offen += t.offenP || 0;
        if (t.papier) papier.push(S.marke); if (S.tipp) tipps.push(S.marke);
        if (!S.felder.some(F => F.roh) && !(S.text && S.text.wert()) && !(t.auswahl && S.gewaehlt != null)) leer.push(S.marke);
        S.ausw.hidden = false; S.ausw.textContent = "";
        const zeile = neu("p", "", S.ausw);
        zeile.textContent = (max ? "Automatisch: " + z(p, 1) + " von " + z(max, 1) + " P" : "") + (t.offenP ? (max ? " · " : "") + "Betty bewertet " + z(t.offenP, 1) + " P" : "");
        if (t.loesung && wahl.loesungen) { const lb = neu("div", "loesung", S.ausw, t.loesung); lb.hidden = true; const b = knopf("Lösung zeigen", () => { lb.hidden = !lb.hidden; b.textContent = lb.hidden ? "Lösung zeigen" : "Lösung ausblenden"; }); b.className = "klein-knopf"; S.ausw.insertBefore(b, lb); }
      }));
    });
    figuren.forEach(f => f());
    const k = document.createElement("div"); k.className = "karte ergebnis"; wurzel.insertBefore(k, bar.nextSibling);
    neu("h2", "", k).textContent = "Deine Abgabe";
    neu("p", "", k).textContent = "Automatisch geprüft: " + z(auto, 1) + " von " + z(autoMax, 1) + " Punkten." + (offen ? " Noch zu bewerten: " + P1(offen) + " (Texte, Begründungen, Zeichnungen)." : "");
    neu("p", "klein", k).textContent = "Kopiere deine Abgabe in den Chat. Betty bewertet dann den Rest auf einmal. Zeichnungen und Rechenwege kannst du als Foto mitschicken." + (wahl.loesungen ? " Unter jeder Aufgabe kannst du die Lösung aufklappen." : "");
    const b = knopf("Abgabe in den Chat kopieren", e => kopiere(abgabeText(auto, autoMax, offen, papier, tipps, leer), e.currentTarget), "haupt");
    neu("div", "knoepfe", k).appendChild(b);
    window.scrollTo(0, 0);
  }

  function abgabeText(auto, autoMax, offen, papier, tipps, leer) {
    const zz = ["Meine Abgabe: " + (C.titel || "Probearbeit")];
    zz.push("Bearbeitet: " + plan.map(L => L.T.titel + " (" + (rechnerFuer(L.T) ? "mit" : "ohne") + " Taschenrechner, " + Math.round(L.sek / 60) + (L.T.minuten ? " von " + L.T.minuten : "") + " min)").join(", ")
      + (hatAuswahl ? "; Auswahlaufgaben: " + (wahl.auswahl ? "ja" : "nein") : ""));
    zz.push("Automatisch geprüft: " + z(auto, 1) + " von " + z(autoMax, 1) + " P. Noch zu bewerten: " + z(offen, 1) + " P.");
    plan.forEach(L => {
      zz.push(""); if (plan.length > 1 || L.T.id) zz.push(L.T.titel);
      L.aufgaben.forEach(E => E.ts.forEach(S => {
        const t = S.t, teile = [];
        S.felder.forEach(F => { const v = F.f.vor ? Tex.einfach(String(F.f.vor).replace(/\$/g, "")).trim() + " " : "", n = F.f.nach ? " " + Tex.einfach(String(F.f.nach).replace(/\$/g, "")).trim() : "";
          teile.push(v + (F.roh ? Term.lesbar(F.roh) : "–") + n + " " + { richtig: "✓", falsch: "✗", gerundet: "≈ (nicht exakt)", leer: "", offen: "" }[F.r.s] + (F.r.hinweis === "klammer" ? " (Klammern beim Bruch fehlen)" : "")); });
        if (t.auswahl) teile.push(S.gewaehlt == null ? "nichts gewählt" : "gewählt: " + BU[S.gewaehlt] + " " + (S.gewaehlt === t.richtig ? "✓" : "✗"));
        if (S.text) teile.push("Text: „" + (S.text.wert().replace(/\s*\n\s*/g, " / ") || "–") + "“");
        if (t.papier) teile.push("Zeichnung/Rechnung auf Papier");
        const pk = (S.max ? " → " + z(S.p, 1) + " von " + z(S.max, 1) + " P" : "") + (t.offenP ? (S.max ? ", " : " → ") + z(t.offenP, 1) + " P offen" : "");
        zz.push(S.marke + " (" + PK(t.punkte || 0) + (t.auswahl ? ", Auswahl" : "") + "): " + teile.join(" | ") + pk);
      }));
    });
    zz.push("");
    if (tipps.length) zz.push("Tipps benutzt: " + tipps.join(", "));
    if (leer.length) zz.push("Nicht bearbeitet: " + leer.join(", "));
    if (papier.length) zz.push("Auf Papier: " + papier.join(", ") + (" (Fotos folgen oder fehlen)"));
    return zz.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  startseite();
}
