/* Umformen: Gleichungen Zeile für Zeile lösen. Jede Zeile wird sofort mit der vorherigen verglichen (gleichwertig?),
   am Ende mit Probe. Kein Hin und Her im Chat nötig. */
function umformenSeite(C, H) {
  const { seite, $ } = H;
  seite(C, `<div id="gl"></div><div class="karte"><p class="klein">Schreib in jede Zeile die nächste Gleichung und rechts daneben, was du gemacht hast (z. B. | −2x). Mit Enter wird die Zeile geprüft.</p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
  const liste = (C.aufgaben || [{ start: C.start, ziel: C.ziel, tipp: C.tipp }]).map((A, ai, alle) => {
    const k = document.createElement("div"); k.className = "karte umformen"; $("gl").appendChild(k);
    k.innerHTML = `<div class="nr">${alle.length > 1 ? "Gleichung " + (ai + 1) : "Gleichung"}</div>`;
    if (A.frage) { const f = document.createElement("div"); f.className = "frage"; Tex.text(f, A.frage); k.appendChild(f); }
    const s = document.createElement("div"); s.className = "startzeile"; Tex.formel(Term.texAntwort(A.start), s); k.appendChild(s);
    const zeilenBox = document.createElement("div"); zeilenBox.className = "zeilen"; k.appendChild(zeilenBox);
    const ende = document.createElement("div"); ende.className = "rueck"; ende.hidden = true; k.appendChild(ende);
    const tippK = document.createElement("div"); tippK.className = "tipp"; tippK.hidden = true; k.appendChild(tippK);
    const E = { A, zeilen: [], fertig: false, fehler: 0 };
    const variable = (String(A.ziel || "").match(/^\s*([a-zA-Zα-ω])\s*=/) || [])[1] || (Term.norm(A.start).match(/[a-zA-Z]/) || ["x"])[0];
    function neueZeile() {
      const z = { el: document.createElement("div") }; z.el.className = "zeile-um"; zeilenBox.appendChild(z.el);
      const links = document.createElement("div"); links.className = "gleichung"; z.el.appendChild(links);
      z.feld = Tastatur.feld(links, { platzhalter: "nächste Zeile", tastatur: A.tastatur || C.tastatur, beiEnter: () => pruefe(z), vorschau: "auto" });
      const rechts = document.createElement("div"); rechts.className = "befehl"; z.el.appendChild(rechts);
      z.befehl = Tastatur.feld(rechts, { platzhalter: "| Umformung", tastatur: A.tastatur || C.tastatur, beiEnter: () => pruefe(z), vorschau: false });
      z.marke = document.createElement("div"); z.marke.className = "erg"; z.el.appendChild(z.marke);
      E.zeilen.push(z); z.feld.input.focus(); return z;
    }
    function pruefe(z) {
      const roh = z.feld.wert(); if (!roh || E.fertig) return;
      const i = E.zeilen.indexOf(z), vorher = i > 0 ? E.zeilen[i - 1].feld.wert() : A.start;
      const ok = Term.aequivalent(roh, vorher) || Term.aequivalent(roh, A.start);
      z.ok = ok; z.marke.className = "erg " + (ok ? "richtig" : "falsch");
      const fertig = ok && new RegExp("^\\s*" + variable + "\\s*=\\s*[^a-zA-Z=]+$|^\\s*[^a-zA-Z=]+\\s*=\\s*" + variable + "\\s*$").test(Term.norm(roh).replace(/π|e(?![a-z])/g, "1"));
      if (!ok) { E.fehler++; z.marke.textContent = "✗ Diese Zeile ist nicht gleichwertig zur Zeile davor. Prüf den Schritt."; if (E.fehler >= 2 && A.tipp) { Tex.text(tippK, A.tipp); tippK.hidden = false; } return; }
      z.marke.textContent = "✓ gleichwertig";
      if (fertig) {
        E.fertig = true; E.zeilen.forEach(q => { q.feld.sperre(true); q.befehl.sperre(true); });
        let probe = ""; try { const wertx = Term.zahl(Term.norm(roh).split("=").find(t => !t.includes(variable))); const s2 = Term.seiten(A.start, { [variable]: wertx }); if (s2) probe = " Probe: links " + z2(s2[0]) + ", rechts " + z2(s2[1]) + (Math.abs(s2[0] - s2[1]) < 1e-9 ? " ✓" : ""); } catch (e) {}
        ende.hidden = false; ende.className = "rueck gut"; ende.textContent = "Fertig." + probe; return;
      }
      if (i === E.zeilen.length - 1) neueZeile();
    }
    const z2 = v => z(v, 4);
    neueZeile();
    return E;
  });
  $("kopieren").addEventListener("click", e => {
    const zz = ["Meine Umformungen: " + (C.titel || "")];
    liste.forEach((E, i) => {
      zz.push((liste.length > 1 ? (i + 1) + ") " : "") + Term.lesbar(E.A.start));
      E.zeilen.filter(q => q.feld.wert()).forEach(q => zz.push("   " + Term.lesbar(q.feld.wert()) + (q.befehl.wert() ? "   " + q.befehl.wert() : "") + (q.ok ? " ✓" : q.ok === false ? " ✗" : "")));
      zz.push("   " + (E.fertig ? "fertig" : "noch nicht fertig") + (E.fehler ? ", " + E.fehler + " Fehlversuche" : ""));
    });
    kopiere(zz.join("\n"), e.currentTarget);
  });
}
