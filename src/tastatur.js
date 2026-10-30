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
      let tex = roh; if (!roh.includes("\\")) { try { tex = Term.texAntwort(roh); } catch (x) {} }
      Tex.formel(tex, e, gross); el.appendChild(e);
    });
  },
};

/* Mathe-Tastatur: eine Tastatur, die unter dem gerade aktiven Eingabefeld erscheint */
const Tastatur = (() => {
  const tippen = matchMedia("(pointer: coarse)").matches;
  const E = [
    [["7"], ["8"], ["9"], ["("], [")"], ["⌫", "weg"],
    ["4"], ["5"], ["6"], ["·"], [":"], ["□/□", "()/()", 1],
    ["1"], ["2"], ["3"], ["+"], ["−"], ["x²", "^2"],
    ["0"], [","], ["π"], ["x"], ["="], ["xⁿ", "^()", 2],
    ["◀", "links"], ["▶", "rechts"], ["√", "√()", 2], ["|"], [";"], ["f(x) abc", "ebene"]],
    [["sin", "sin()", 4], ["cos", "cos()", 4], ["tan", "tan()", 4], ["ln", "ln()", 3], ["log", "log()", 4], ["e"],
    ["a"], ["b"], ["c"], ["d"], ["y"], ["t"],
    ["<"], [">"], ["≤"], ["≥"], ["n"], ["k"],
    ["◀", "links"], ["▶", "rechts"], ["⌫", "weg"], ["|"], [";"], ["123", "ebene"]],
  ];
  let aktiv = null, ebene = 0;
  const box = document.createElement("div"); box.className = "tastatur"; box.setAttribute("aria-label", "Mathe-Tastatur");
  function baue() {
    box.textContent = "";
    E[ebene].forEach(([z, a, c]) => {
      const k = document.createElement("button"); k.type = "button"; k.textContent = z; k.className = "taste" + (a && !a.includes("(") && !a.startsWith("^") ? " steuer" : "");
      k.addEventListener("pointerdown", e => e.preventDefault()); k.addEventListener("mousedown", e => e.preventDefault());
      k.addEventListener("click", () => druecke(z, a, c)); box.appendChild(k);
    });
  }
  function druecke(z, a, c) {
    if (a === "ebene") { ebene = 1 - ebene; baue(); return; }
    if (!aktiv) return;
    const f = aktiv.input, s = f.selectionStart ?? f.value.length, e = f.selectionEnd ?? s, v = f.value;
    let pos = s;
    if (a === "links") pos = v.slice(s - 3, s) === ")/(" ? s - 3 : Math.max(0, s - 1);
    else if (a === "rechts") pos = v.slice(e, e + 3) === ")/(" ? e + 3 : Math.min(v.length, e + 1);
    else if (a === "weg") {
      if (s !== e) { f.value = v.slice(0, s) + v.slice(e); pos = s; }
      else if (s > 0) { const paar = v[s - 1] === "(" && v[s] === ")"; f.value = v.slice(0, s - 1) + v.slice(s + (paar ? 1 : 0)); pos = s - 1; }
    } else { const t = a || z; f.value = v.slice(0, s) + t + v.slice(e); pos = s + (c ?? t.length); }
    f.setSelectionRange(pos, pos); if (!tippen) f.focus();
    f.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function feld(eltern, o = {}) {
    const w = document.createElement("div"); w.className = "feld";
    const input = document.createElement("input");
    Object.assign(input, { type: "text", autocomplete: "off", spellcheck: false, placeholder: o.platzhalter || "Antwort eingeben" });
    input.setAttribute("autocapitalize", "off"); if (tippen) input.setAttribute("inputmode", "none");
    const vor = document.createElement("div"); vor.className = "vorschau"; vor.hidden = true;
    w.append(input, vor); eltern.appendChild(w);
    const obj = { input, wert: () => input.value.trim(), tex: () => { try { return Term.texAntwort(input.value, true); } catch (e) { return Term.lesbar(input.value); } } };
    input.addEventListener("focus", () => { aktiv = obj; w.after(box); box.hidden = false; });
    input.addEventListener("input", () => {
      vor.hidden = !input.value.trim(); vor.classList.remove("unfertig");
      try { Tex.formel(Term.texAntwort(input.value, true), vor, true); } catch (e) { vor.textContent = Term.lesbar(input.value); vor.classList.add("unfertig"); }
      if (o.beiEingabe) o.beiEingabe();
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && o.beiEnter) { e.preventDefault(); o.beiEnter(); } });
    return obj;
  }
  baue(); box.hidden = true;
  return { feld };
})();

/* In die Zwischenablage kopieren, mit Ersatzweg, falls die Vorschau das nicht erlaubt */
async function kopiere(text, knopf) {
  let ok = false;
  try { if (navigator.clipboard) { await navigator.clipboard.writeText(text); ok = true; } } catch (e) {}
  if (!ok) {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
  }
  let ers = knopf.nextElementSibling; if (ers && ers.classList.contains("ersatz")) ers.remove();
  if (ok) { const alt = knopf.textContent; knopf.textContent = "Kopiert. Jetzt im Chat einfügen."; setTimeout(() => knopf.textContent = alt, 3000); return; }
  ers = document.createElement("div"); ers.className = "ersatz";
  ers.innerHTML = "<p>Kopieren ging hier nicht automatisch. Markiere den Text und kopiere ihn (Strg + C oder lange drücken):</p>";
  const ta = document.createElement("textarea"); ta.value = text; ta.rows = Math.min(8, text.split("\n").length + 1); ta.readOnly = true;
  ers.appendChild(ta); knopf.after(ers); ta.focus(); ta.select();
}
