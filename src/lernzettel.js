/* Lernzettel zum Drucken: Abschnitte mit Merksatz, Formel, Beispiel, kleinem Graphen, typischem Fehler und Ich-kann-Liste.
   Am Bildschirm einspaltig oder zweispaltig, gedruckt auf A4 zweispaltig. */
function lernzettelSeite(C, H) {
  const { seite, $, beiGroesse } = H;
  seite(C, `<div class="nicht-drucken lz-leiste"><button type="button" class="haupt" id="drucken">Drucken</button><span class="klein" id="druckhinweis"></span></div><div class="lz-raster" id="lz"></div><p class="klein lz-fuss" id="lzfuss"></p>`);
  document.body.classList.add("lernzettel");
  const figuren = [], imRahmen = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  (C.abschnitte || []).forEach(A => {
    const k = document.createElement("section"); k.className = "karte lz-karte"; $("lz").appendChild(k);
    const h = document.createElement("h2"); h.textContent = A.titel || ""; k.appendChild(h);
    if (A.merke) { const m = document.createElement("div"); m.className = "merke"; Tex.text(m, A.merke); k.appendChild(m); }
    (Array.isArray(A.formel) ? A.formel : A.formel ? [A.formel] : []).forEach(f => { const d = document.createElement("div"); d.className = "lz-formel"; Tex.text(d, /\$/.test(f) ? f : "$$" + f + "$$"); k.appendChild(d); });
    if (A.zeichne || A.f) {
      const s = document.createElementNS(NS, "svg"); s.setAttribute("class", "mini lz-bild"); s.setAttribute("role", "img"); s.setAttribute("aria-label", A.bild || "Skizze"); k.appendChild(s);
      const An = Object.assign({ xMin: -4, xMax: 4, yMin: -3, yMax: 5, hoehe: 140 }, A.ansicht || {});
      figuren.push(() => { leinwand(s, An); if (A.f) g.kurve(A.f); if (A.zeichne) A.zeichne(g, P); });
    }
    if (A.beispiel) { const b = document.createElement("div"); b.className = "lz-beispiel"; Tex.text(b, "<b>Beispiel:</b> " + A.beispiel); k.appendChild(b); }
    if (A.fehler) { const f = document.createElement("div"); f.className = "lz-fehler"; Tex.text(f, "<b>Achtung:</b> " + A.fehler); k.appendChild(f); }
    if (A.kannIch && A.kannIch.length) {
      const u = document.createElement("ul"); u.className = "kannich"; k.appendChild(u);
      A.kannIch.forEach(t => { const li = document.createElement("li"); const b = document.createElement("button"); b.type = "button"; b.className = "haken"; b.setAttribute("aria-pressed", "false"); b.textContent = "☐";
        b.addEventListener("click", () => { const an = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", an); b.textContent = an ? "☑" : "☐"; });
        const s = document.createElement("span"); Tex.text(s, "Ich kann " + t.replace(/^ich kann\s*/i, "")); li.append(b, s); u.appendChild(li); });
    }
  });
  if (C.fuss) Tex.text($("lzfuss"), C.fuss);
  $("druckhinweis").textContent = imRahmen ? "In der Chat-Vorschau ist Drucken gesperrt. Lade den Codeblock herunter, öffne die Datei im Browser und drucke dort (Strg + P oder Teilen → Drucken)." : "Tipp: Im Druckdialog „Hintergrundgrafiken“ einschalten.";
  $("drucken").addEventListener("click", () => { if (imRahmen) { $("druckhinweis").classList.add("betont"); return; } window.print(); });
  if (imRahmen) $("drucken").textContent = "Drucken?";
  const male = () => figuren.forEach(f => f());
  addEventListener("beforeprint", male); beiGroesse(male); male();
}
