/* Aufgabe mit Tastatur, Prüfen, Tipp, Lösungsweg; merkt sich das Ergebnis für den Chat */
function knopf(text, tu, klasse) { const b = document.createElement("button"); b.type = "button"; b.textContent = text; if (klasse) b.className = klasse; b.addEventListener("click", tu); return b; }
function kasten(klasse) { const d = document.createElement("div"); d.className = klasse; d.hidden = true; return d; }
function baueAufgabe(box, a, nr, geaendert) {
  const st = { nr, versuche: 0, richtig: false, eingabe: "", weg: false, frueher: [] };
  const q = document.createElement("div"); q.className = "frage"; Tex.text(q, a.frage); box.appendChild(q);
  let feld = null, wahl = null;
  if (a.optionen) {
    wahl = document.createElement("div"); wahl.className = "optionen";
    a.optionen.forEach((o, i) => {
      const l = document.createElement("label"), r = document.createElement("input"), s = document.createElement("span");
      Object.assign(r, { type: "radio", name: "wahl" + nr, value: i }); Tex.text(s, o); l.append(r, s); wahl.appendChild(l);
    });
    box.appendChild(wahl);
  } else feld = Tastatur.feld(box, { beiEnter: pruefe, platzhalter: a.platzhalter });
  const reihe = document.createElement("div"); reihe.className = "knoepfe";
  const bTipp = knopf("Tipp", () => zeige(tipp, a.tipp)), bWeg = knopf("Lösungsweg", () => { st.weg = true; zeige(weg, a.weg); geaendert(); });
  bTipp.hidden = !a.tipp; bWeg.hidden = true;
  reihe.append(knopf("Prüfen", pruefe, "haupt"), bTipp, bWeg); box.appendChild(reihe);
  const rueck = kasten("rueck"), tipp = kasten("tipp"), weg = kasten("weg"); box.append(rueck, tipp, weg);
  function zeige(k, s) { if (s) { Tex.text(k, s); k.hidden = false; } }
  function melde(s, ok) { rueck.hidden = false; rueck.className = "rueck" + (ok === true ? " gut" : ok === false ? " schlecht" : ""); Tex.text(rueck, s); }
  function pruefe() {
    let ok, roh; const vorher = st.eingabe;
    if (wahl) {
      const r = wahl.querySelector("input:checked"); if (!r) return melde("Wähle zuerst eine Antwort.");
      ok = +r.value === a.richtig; roh = String(r.value); st.eingabe = a.optionen[+r.value];
    } else {
      roh = feld.wert(); if (!roh) return melde("Tippe zuerst eine Antwort ein.");
      ok = Term.gleich(roh, a.antwort, a); st.eingabe = "$" + feld.tex() + "$";
    }
    if (st.versuche && vorher && !st.richtig) st.frueher.push(vorher);
    st.versuche++; st.richtig = ok;
    const bekannt = !ok && (a.fehler || []).find(f => wahl ? String(f.antwort) === roh : Term.gleich(roh, String(f.antwort), {}));
    melde(ok ? (a.lob || "Richtig.") : bekannt ? bekannt.text : st.versuche === 1 && a.tipp ? "Noch nicht. Schau dir den Tipp an." : "Noch nicht richtig." + (a.weg ? " Du kannst dir jetzt den Lösungsweg ansehen." : ""), ok);
    if (!ok && st.versuche === 1) zeige(tipp, a.tipp);
    if ((ok || st.versuche >= 2) && a.weg) bWeg.hidden = false;
    geaendert();
  }
  return st;
}
function ergebnisText(titel, liste) {
  const z = ["Meine Ergebnisse: " + titel];
  liste.forEach(s => {
    let t = !s.versuche ? "nicht bearbeitet" : s.richtig ? "richtig" + (s.versuche > 1 ? " im " + s.versuche + ". Versuch" : "") + ": " + s.eingabe
      : "noch nicht richtig (" + s.versuche + (s.versuche > 1 ? " Versuche" : " Versuch") + "), zuletzt: " + s.eingabe;
    if (s.frueher.length) t += " (vorher: " + s.frueher.join(", ") + ")";
    if (s.weg) t += " (Lösungsweg angesehen)";
    z.push((typeof s.nr === "number" ? s.nr + ") " : s.nr + ": ") + t);
  });
  return z.join("\n");
}
