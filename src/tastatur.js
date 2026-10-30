/* Tex: Formeln mit KaTeX setzen, ohne KaTeX lesbarer Text */
const Tex = {
  einfach: t => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b, i, s) => { const r = [a, b].map(x => /^(\w+|\\[a-zA-Z]+)$/.test(x) ? x : "(" + x + ")").join("/"); return /[\w(\\]/.test(s[i + m.length] || "") ? "(" + r + ")" : r; }).replace(/\\left|\\right/g, "").replace(/\\cdot ?/g, "·")
    .replace(/\\pi ?/g, "π").replace(/\\sqrt\{([^{}]*)\}/g, "√($1)").replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³")
    .replace(/\\mid ?/g, "|").replace(/\\leq?(?![a-z])/g, "≤").replace(/\\geq?(?![a-z])/g, "≥").replace(/\\neq?(?![a-z])/g, "≠").replace(/\\approx/g, "≈")
    .replace(/\\(var)?(alpha|beta|gamma|delta|epsilon|phi|theta|lambda|mu|sigma|omega|Delta|Omega)(?![a-zA-Z])/g, (m, v, n) => "αβγδεφθλμσωΔΩ"["alpha beta gamma delta epsilon phi theta lambda mu sigma omega Delta Omega".split(" ").indexOf(n)])
    .replace(/\\infty ?/g, "∞").replace(/\^\{?\\circ\}?/g, "°").replace(/\\circ ?/g, "°").replace(/\\times/g, "×").replace(/\\Rightarrow/g, "⇒").replace(/\\to(?![a-z])/g, "→").replace(/\\[,;:!]/g, " ").replace(/\{,\}/g, ",").replace(/\\mathrm\{e\}/g, "e")
    .replace(/\\(sin|cos|tan|ln|log|lg) ?(?=\()/g, "$1").replace(/\\(sin|cos|tan|ln|log|lg|lim) ?/g, "$1 ").replace(/\\[a-zA-Z]+ ?/g, "").replace(/\\ /g, " ").replace(/[{}]/g, ""),
  formel(tex, el, gross) {
    if (window.katex) { try { katex.render(tex, el, { throwOnError: false, displayMode: !!gross }); return; } catch (e) {} }
    el.textContent = Tex.einfach(tex);
  },
  text(el, s) {
    el.textContent = "";
    String(s || "").split(/(\$\$[^$]+\$\$|\$[^$]+\$)/).forEach(t => {
      if (!t) return;
      if (t[0] !== "$") { el.insertAdjacentHTML("beforeend", t); return; }
      const gross = t.startsWith("$$"), e = document.createElement(gross ? "div" : "span"), roh = t.slice(gross ? 2 : 1, gross ? -2 : -1);
      let tex = roh;
      if (!roh.includes("\\")) { try { tex = (/^\s*\+/.test(roh) ? "+" : "") + Term.texAntwort(roh); } catch (x) {
        tex = roh.replace(/(^|[^a-zA-Z\\])(sin|cos|tan|ln|lg|log|lim)(?![a-zA-Z])/g, "$1\\$2 ").replace(/·/g, "\\cdot ").replace(/°/g, "^{\\circ}");
        const m = roh.match(/^(.*?)\s*(=|≈|<|>|≤|≥)\s*$/); if (m) { try { tex = Term.texAntwort(m[1]) + { "=": "=", "≈": "\\approx", "<": "<", ">": ">", "≤": "\\le", "≥": "\\ge" }[m[2]]; } catch (y) {} } } }
      Tex.formel(tex, e, gross); el.appendChild(e);
    });
  },
};

/* Mathe-Tastatur, konfigurierbar pro Seite, Aufgabe oder Feld.
   Aufbau wie ein Taschenrechner: links ein Block mit 8 Tasten, der je nach Ebene wechselt (Variablen, Funktionen,
   Zeichen, Griechisch oder eigene Ebenen), daneben fest Ziffern, Operatoren, Strukturen (Bruch, Potenz, Wurzel)
   und Aktionen (⌫ ◀ ▶ ↵). So bleibt der Ziffernblock immer an derselben Stelle.
   Konfiguration (alles optional): { vorlage, variablen, konstanten, extra, funktionen, zeichen, griechisch,
   operatoren, strukturen, ebenen, start }. Tasten sind Kurznamen ("sin", "^2", "/", "√", "abs", "e^", "≤" …),
   beliebiger Text ("t", "α", "cm", "f()") oder { zeige, text, cursor, titel }. */
const Tastatur = (() => {
  const tippen = matchMedia("(pointer: coarse)").matches;
  const NAMEN = {
    "/": ["□/□", "()/()", 1, "Bruch"], "^2": ["x²", "^2"], "^3": ["x³", "^3"], "^": ["xⁿ", "^()", 2, "Hochzahl"],
    "^-1": ["x⁻¹", "^(-1)"], "√": ["√", "√()", 2, "Wurzel"], "∛": ["∛", "∛()", 2, "dritte Wurzel"],
    "abs": ["|□|", "abs()", 4, "Betrag"], "e^": ["eˣ", "e^()", 3], "10^": ["10ˣ", "10^()", 4],
    sin: ["sin", "sin()", 4], cos: ["cos", "cos()", 4], tan: ["tan", "tan()", 4], ln: ["ln", "ln()", 3], lg: ["lg", "lg()", 3], log: ["log", "log()", 4],
    "-": ["−", "-"], "−": ["−", "-"], "*": ["·", "·"], "<=": ["≤", "≤"], ">=": ["≥", "≥"], "!=": ["≠", "≠"], "~": ["≈", "≈"],
  };
  const VORLAGEN = {
    standard: { variablen: ["x", "y", "a", "b", "t", "k"], konstanten: ["π", "e"], extra: [], funktionen: ["sin", "cos", "tan", "ln", "e^", "abs"],
      zeichen: ["<", ">", "≤", "≥", "≈", "°"], griechisch: ["α", "β", "γ", "δ", "φ", "ε", "λ", "ω"],
      operatoren: ["(", ")", "+", "−", "·", ":", "=", "|"], strukturen: ["/", "^2", "^", "√"], ebenen: ["123", "f(x)", "≤ °", "αβ"] },
    algebra: { variablen: ["x", "y", "z", "a", "b", "c"], konstanten: ["π", "%"], zeichen: ["<", ">", "≤", "≥", "≠", "≈"], ebenen: ["123", "≤ °"] },
    funktionen: { variablen: ["x", "y", "m", "n", "a", "b"], konstanten: ["π", "e"], zeichen: ["<", ">", "≤", "≥", "≠", "∞"] },
    trigonometrie: { variablen: ["x", "t", "k", "a", "b", "d"], konstanten: ["π", "°"], funktionen: ["sin", "cos", "tan", "abs", "^-1", "√"],
      zeichen: ["≤", "≥", "≈", "∈", "ℤ", "ℝ"], ebenen: ["123", "f(x)", "≤ °", "αβ"] },
    analysis: { variablen: ["x", "t", "a", "k", "h", "n"], konstanten: ["π", "e"], funktionen: ["sin", "cos", "ln", "e^", "abs", "lg"],
      zeichen: ["<", ">", "≤", "≥", "∞", "≈"], strukturen: ["/", "^2", "^", "√"] },
    stochastik: { variablen: ["n", "k", "p", "q", "X", "x"], konstanten: ["%", "!"], zeichen: ["<", ">", "≤", "≥", "≈", "P()"], ebenen: ["123", "≤ °"] },
    geometrie: { variablen: ["a", "b", "c", "h", "r", "s"], konstanten: ["π", "°"], strukturen: ["/", "^2", "√", "^"], ebenen: ["123", "αβ", "f(x)"] },
    vektoren: { variablen: ["x", "y", "z", "r", "s", "t"], konstanten: ["λ", "μ"], strukturen: ["/", "^2", "√", "^"], ebenen: ["123", "αβ"] },
  };
  const AKTION = { "⌫": "weg", "◀": "links", "▶": "rechts", "↵": "enter" };
  function taste(s) {
    if (s == null || s === "") return null;
    if (typeof s === "object") return { zeige: s.zeige ?? s.text, text: s.text ?? s.zeige, cursor: s.cursor, titel: s.titel };
    s = String(s); if (AKTION[s]) return { zeige: s, aktion: AKTION[s] };
    const n = NAMEN[s]; if (n) return { zeige: n[0], text: n[1], cursor: n[2], titel: n[3] };
    if (/\(\)$/.test(s) && s.length > 2) return { zeige: s.slice(0, -2) + "(□)", text: s, cursor: s.length - 1 };
    return { zeige: s, text: s };
  }
  let seitenVorgabe = {};
  function aufloesen(c) {
    const o = x => typeof x === "string" ? { vorlage: x } : (x || {});
    const s = o(seitenVorgabe), f = o(c);
    // Eine eigene Vorlage am Feld ersetzt die Seitenvorgabe, sonst ergänzt das Feld die Seitenvorgabe
    return f.vorlage ? Object.assign({}, VORLAGEN.standard, VORLAGEN[f.vorlage] || {}, f) : Object.assign({}, VORLAGEN.standard, VORLAGEN[s.vorlage] || {}, s, f);
  }
  function ebenen(k) {
    const v = [...k.variablen, ...k.konstanten, ...(k.extra || [])], liste = [];
    const fuell = (name, tasten) => { for (let i = 0; i < tasten.length || i === 0; i += 8) liste.push({ name: i ? (name === "123" ? "mehr" : name + " …") : name, tasten: tasten.slice(i, i + 8) }); };
    (k.ebenen || ["123"]).forEach(e => {
      if (typeof e === "object") return fuell(e.name, e.tasten || []);
      if (e === "123") fuell("123", v);
      else if (e === "f(x)") fuell("f(x)", [...k.funktionen.slice(0, 6), ...k.variablen.slice(0, 2)]);
      else if (e === "≤ °") fuell("≤ °", [...k.zeichen.slice(0, 6), ...k.variablen.slice(0, 2)]);
      else if (e === "αβ") fuell("αβ", k.griechisch === true ? VORLAGEN.standard.griechisch : k.griechisch || []);
    });
    return liste;
  }
  let aktiv = null, cfgAktiv = null, liste = [], ebene = 0, offen = true;
  const box = document.createElement("div"); box.className = "tastatur"; box.setAttribute("aria-label", "Mathe-Tastatur");
  box.addEventListener("pointerdown", e => { if (e.target.closest("button")) e.preventDefault(); });
  function knopf(t, klasse) {
    const k = document.createElement("button"); k.type = "button"; k.className = "taste " + klasse;
    if (!t) { k.disabled = true; k.classList.add("leer"); k.setAttribute("aria-hidden", "true"); return k; }
    k.textContent = t.zeige; if (t.titel) k.title = t.titel; if ([...String(t.zeige)].length > 3) k.classList.add("lang");
    k.addEventListener("mousedown", e => e.preventDefault()); k.addEventListener("click", () => druecke(t)); return k;
  }
  function baue() {
    box.textContent = "";
    const kopf = document.createElement("div"); kopf.className = "reiter";
    if (offen) liste.forEach((e, i) => { const b = document.createElement("button"); b.type = "button"; b.textContent = e.name; b.setAttribute("aria-pressed", i === ebene);
      b.addEventListener("mousedown", x => x.preventDefault()); b.addEventListener("click", () => { ebene = i; baue(); }); kopf.appendChild(b); });
    const um = document.createElement("button"); um.type = "button"; um.className = "umschalten";
    um.textContent = offen ? (tippen ? "ABC" : "Tasten aus") : "Mathe-Tasten"; um.title = offen ? "Normale Tastatur benutzen" : "Mathe-Tastatur zeigen";
    um.addEventListener("mousedown", x => x.preventDefault()); um.addEventListener("click", () => schalte(!offen)); kopf.appendChild(um); box.appendChild(kopf);
    if (!offen) return;
    const k = cfgAktiv, koerper = document.createElement("div"); koerper.className = "koerper";
    const links = document.createElement("div"); links.className = "links";
    const L = (liste[ebene] || { tasten: [] }).tasten; for (let i = 0; i < 8; i++) links.appendChild(knopf(taste(L[i]), "lk"));
    const haupt = document.createElement("div"); haupt.className = "rechts";
    const N = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", ";"], O = k.operatoren, S = k.strukturen, A = ["⌫", "◀", "▶", "↵"];
    for (let r = 0; r < 4; r++) {
      N.slice(3 * r, 3 * r + 3).forEach(z => haupt.appendChild(knopf(taste(z), "zf")));
      [O[2 * r], O[2 * r + 1]].forEach(z => haupt.appendChild(knopf(taste(z), "op")));
      haupt.appendChild(knopf(taste(S[r]), "st")); haupt.appendChild(knopf(taste(A[r]), "ak"));
    }
    koerper.append(links, haupt); box.appendChild(koerper);
  }
  function schalte(an) {
    offen = an; if (aktiv) aktiv.offen = an;
    if (aktiv && tippen) { const a = aktiv; a.input.inputMode = an ? "none" : "text"; a.input.blur(); setTimeout(() => a.input.focus({ preventScroll: true }), 30); }
    baue();
  }
  function druecke(t) {
    if (!aktiv) return;
    const f = aktiv.input, s = f.selectionStart ?? f.value.length, e = f.selectionEnd ?? s, v = f.value;
    let pos = s;
    if (t.aktion === "enter") { if (aktiv.mehrzeilig) { f.value = v.slice(0, s) + "\n" + v.slice(e); pos = s + 1; } else if (aktiv.o.beiEnter) { aktiv.o.beiEnter(); return; } else { f.blur(); box.hidden = true; return; } }
    else if (t.aktion === "links") pos = v.slice(s - 3, s) === ")/(" ? s - 3 : Math.max(0, s - 1);
    else if (t.aktion === "rechts") pos = v.slice(e, e + 3) === ")/(" ? e + 3 : Math.min(v.length, e + 1);
    else if (t.aktion === "weg") {
      if (s !== e) { f.value = v.slice(0, s) + v.slice(e); pos = s; }
      else if (s > 0) { const paar = v[s - 1] === "(" && v[s] === ")"; f.value = v.slice(0, s - 1) + v.slice(s + (paar ? 1 : 0)); pos = s - 1; }
    } else { const x = t.text; f.value = v.slice(0, s) + x + v.slice(e); pos = s + (t.cursor ?? x.length); }
    f.setSelectionRange(pos, pos); if (!tippen) f.focus({ preventScroll: true });
    f.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function zeigeBei(obj, w) {
    const neu = JSON.stringify(obj.k) !== JSON.stringify(cfgAktiv);
    aktiv = obj; if (neu) { cfgAktiv = obj.k; liste = ebenen(obj.k); ebene = Math.max(0, liste.findIndex(e => e.name === obj.k.start)); }
    offen = obj.offen;
    if (tippen) obj.input.inputMode = offen ? "none" : "text";
    (obj.o.tastaturNach || w).after(box); box.hidden = false; baue();
  }
  // feld(eltern, { platzhalter, beiEnter, beiEingabe, tastatur, mehrzeilig, vorschau })
  function feld(eltern, o = {}) {
    const w = document.createElement("div"); w.className = "feld" + (o.mehrzeilig ? " text" : "");
    const input = document.createElement(o.mehrzeilig ? "textarea" : "input");
    if (o.mehrzeilig) input.rows = o.zeilen || 3; else input.type = "text";
    Object.assign(input, { autocomplete: "off", spellcheck: !!o.mehrzeilig, placeholder: o.platzhalter || (o.mehrzeilig ? "Antwort in Worten, Formeln mit der Mathe-Tastatur" : "Antwort eingeben") });
    input.setAttribute("autocapitalize", "off"); if (tippen && !o.mehrzeilig) input.setAttribute("inputmode", "none");
    const vor = document.createElement("div"); vor.className = "vorschau"; vor.hidden = true;
    w.append(input, vor); eltern.appendChild(w);
    const obj = { input, o, mehrzeilig: !!o.mehrzeilig, k: aufloesen(o.tastatur), wert: () => input.value.trim(),
      tex: () => { try { return Term.texAntwort(input.value, true); } catch (e) { return Term.lesbar(input.value); } },
      offen: o.mehrzeilig ? !!o.tastenOffen : true, lesbar: () => o.mehrzeilig ? input.value.trim() : Term.lesbar(input.value.trim()),
      sperre: an => { input.readOnly = an; w.classList.toggle("gesperrt", an); if (an && aktiv === obj) { box.hidden = true; aktiv = null; } } };
    input.addEventListener("focus", () => { if (!input.readOnly) zeigeBei(obj, w); });
    input.addEventListener("input", () => {
      if (o.mehrzeilig || o.vorschau === false) { if (o.beiEingabe) o.beiEingabe(); return; }
      vor.hidden = !input.value.trim() || (o.vorschau === "auto" && !/[\/^√(|]|sqrt|abs|cbrt|!=|<=|>=/.test(input.value)); vor.classList.remove("unfertig");
      try { Tex.formel(Term.texAntwort(input.value, true), vor, true); } catch (e) { vor.textContent = Term.lesbar(input.value); vor.classList.add("unfertig"); }
      if (o.beiEingabe) o.beiEingabe();
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && !o.mehrzeilig && o.beiEnter) { e.preventDefault(); o.beiEnter(); } });
    return obj;
  }
  box.hidden = true;
  return { feld, vorgabe: c => { seitenVorgabe = c || {}; }, vorlagen: VORLAGEN, taste, aufloesen };
})();

/* In die Zwischenablage kopieren, mit Ersatzweg, falls die Vorschau das nicht erlaubt */
async function kopiere(text, knopf) {
  let ok = false;
  try { if (navigator.clipboard) { await navigator.clipboard.writeText(text); ok = true; } } catch (e) {}
  if (!ok) {
    const ta = document.createElement("textarea"), r = knopf.getBoundingClientRect(); ta.value = text; ta.readOnly = true;
    ta.style.cssText = `position:absolute;left:-9999px;top:${Math.round(window.scrollY + r.top)}px;width:1px;height:1px;opacity:0`;
    document.body.appendChild(ta); ta.focus({ preventScroll: true }); ta.select();
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove(); knopf.focus({ preventScroll: true });
  }
  let ers = knopf.nextElementSibling; if (ers && ers.classList.contains("ersatz")) ers.remove();
  if (ok) { const alt = knopf.textContent; knopf.textContent = "Kopiert. Jetzt im Chat einfügen."; setTimeout(() => knopf.textContent = alt, 3000); return; }
  ers = document.createElement("div"); ers.className = "ersatz";
  ers.innerHTML = "<p>Kopieren ging hier nicht automatisch. Markiere den Text und kopiere ihn (Strg + C oder lange drücken):</p>";
  const ta = document.createElement("textarea"); ta.value = text; ta.rows = Math.min(8, text.split("\n").length + 1); ta.readOnly = true;
  ers.appendChild(ta); knopf.after(ers); ta.focus({ preventScroll: true }); ta.select();
}
