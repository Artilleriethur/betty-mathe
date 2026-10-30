/* Betty-Mathe-Baukasten 1.0.0: Lernseiten, Mathe-Tastatur und Zeichnungen für den Mathe-Tutor Betty */
(() => {
const BETTY_CSS = ":root{--ink:#1d2330;--muted:#5d6472;--line:#d9dce3;--grid:#eceef2;--axis:#2f3542;--panel:#f5f6f8;--f1:#1f5fbf;--f2:#d9730d;--f3:#13857a;--hilf:#7d8491;--gut:#13857a;--schlecht:#b3261e;color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:16px/1.5 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif}main{max-width:860px;margin:0 auto;padding:14px 16px 24px}h1{font-size:1.2rem;margin:0 0 4px}.auftrag{margin:0 0 12px;color:var(--muted)}button{font:inherit;padding:8px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);cursor:pointer}button.haupt{background:var(--f1);border-color:var(--f1);color:#fff}button:disabled{opacity:.45;cursor:default}.karte{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:0 0 12px}.knoepfe{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.feld input{width:100%;font:18px/1.4 ui-monospace,Consolas,monospace;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}.feld input:focus{outline:none;border-color:var(--f1)}.vorschau{margin-top:6px;padding:6px 10px;min-height:2.4em;background:var(--panel);border-radius:8px;overflow-x:auto;font-size:1.1rem}.vorschau.unfertig{color:var(--muted)}.vorschau .katex-display{margin:0;text-align:left}.tastatur{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:8px 0 4px;padding:6px;background:var(--panel);border-radius:10px;max-width:460px}.taste{padding:0;min-height:44px;font-size:18px;border-radius:7px;touch-action:manipulation;user-select:none}.taste.steuer{background:#e9ebef;font-size:15px}.rueck{margin-top:8px;padding:8px 10px;border-radius:8px}.rueck.gut{background:#e6f4f1;color:#0b5c53}.rueck.schlecht{background:#fbeceb;color:#8c1d18}.tipp,.weg{margin-top:8px;padding:8px 10px;border-left:3px solid var(--f2);background:#fdf5ec;border-radius:0 8px 8px 0}.weg{border-left-color:var(--f3);background:#eef7f6}.ersatz textarea{width:100%;font:14px/1.4 ui-monospace,Consolas,monospace}.ersatz p{margin:8px 0 4px;color:var(--muted);font-size:.9rem}.klein{font-size:.9rem;color:var(--muted)}.nr{font-size:.8rem;font-weight:600;color:var(--muted);text-transform:none;margin-bottom:2px}h2{font-size:1.05rem;margin:0 0 6px}.frage{margin:0 0 8px}.optionen{display:grid;gap:6px;margin:4px 0}.optionen label{display:flex;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--line);border-radius:8px;cursor:pointer}.optionen input{width:18px;height:18px;accent-color:var(--f1)}.aufgabe{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.layout{display:grid;gap:14px}@media(min-width:760px){.layout{grid-template-columns:minmax(0,1fr) 340px;align-items:start}#figur{position:sticky;top:8px}}#figur{width:100%;display:block;border:1px solid var(--line);border-radius:8px;user-select:none}.tick{font-size:12px}.marke{font-size:14px;font-weight:600}.regler{display:block;margin:10px 0 0;font-weight:600}.regler input{width:100%;height:30px;accent-color:var(--f2)}.nav{justify-content:space-between}.punkte{display:flex;gap:6px;justify-content:center;margin-top:10px}.punkte button{width:14px;height:14px;padding:0;border-radius:50%;border:1.5px solid var(--hilf);background:#fff}.punkte button.fertig{background:var(--hilf)}.punkte button.an{background:var(--f1);border-color:var(--f1)}.layout.ohne{grid-template-columns:1fr}.panel{background:var(--panel);border-radius:8px;padding:10px 12px}.panel label{display:block;font-weight:600;margin:8px 0 0}.panel input[type=range]{width:100%;height:30px;accent-color:var(--f1)}.wert{float:right;font-weight:400;font-variant-numeric:tabular-nums}.term{margin:2px 0;font-size:1.05rem}.term b{font-size:.8rem;vertical-align:1px}.anzeige{margin:10px 0}.anzeige div{display:flex;justify-content:space-between;gap:8px;border-top:1px solid var(--line);padding:4px 0;font-variant-numeric:tabular-nums}.stand{margin:10px 0;font-variant-numeric:tabular-nums}.diagramm{width:100%;display:block;border:1px solid var(--line);border-radius:8px}";
/* Term: Eingaben lesen, als Formel anzeigen und mathematisch vergleichen */
const Term = (() => {
  const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan, ln: Math.log, log: Math.log10, lg: Math.log10, sqrt: Math.sqrt, abs: Math.abs };
  const NAMEN = ["sqrt", "sin", "cos", "tan", "abs", "log", "ln", "lg"];
  function norm(s) {
    return String(s).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[·×⋅*]/g, "*").replace(/[÷:]/g, "/")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/√/g, "sqrt").replace(/pi/gi, "π")
      .replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/°/g, "").replace(/\{|\}/g, "");
  }
  function tokens(s) {
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i], r = s.slice(i);
      let m = r.match(/^\d+([.,]\d+)?|^[.,]\d+/);
      if (m) { t.push({ k: "zahl", s: m[0] }); i += m[0].length; continue; }
      const f = NAMEN.find(n => r.startsWith(n));
      if (f) { t.push({ k: "fn", s: f }); i += f.length; continue; }
      if (/[a-zA-Zπ]/.test(c)) {
        let s2 = c; if (s[i + 1] === "_" && /[\w]/.test(s[i + 2] || "")) { s2 += s[i + 2]; i += 2; }
        else if (/\d/.test(s[i + 1] || "") && /[xy]/.test(c) && /[;=|)]|$/.test(s[i + 2] || "")) { s2 += s[i + 1]; i += 1; }
        t.push({ k: c === "π" || (c === "e" && s2 === "e") ? "konst" : "var", s: s2 }); i += 1; continue;
      }
      if ("+-*/^()".includes(c)) { t.push({ k: c }); i++; continue; }
      throw new Error("Zeichen " + c);
    }
    return t;
  }
  function parse(s) {
    const t = tokens(s); let p = 0;
    const sieh = () => t[p] && t[p].k, nimm = k => { if (sieh() !== k) throw new Error("erwartet " + k); return t[p++]; };
    const startet = () => ["zahl", "var", "konst", "fn", "("].includes(sieh());
    function summe() {
      let a = produkt();
      while (sieh() === "+" || sieh() === "-") { const op = t[p++].k; a = { t: "add", op, a, b: produkt() }; }
      return a;
    }
    function produkt() {
      let a = folge();
      while (sieh() === "*" || sieh() === "/") { const op = t[p++].k; const b = folge(); a = op === "*" ? { t: "mul", op, a, b } : { t: "div", a, b }; }
      return a;
    }
    function folge() {
      let a = vorzeichen();
      while (startet()) a = { t: "mul", op: "", a, b: potenz() };
      return a;
    }
    function vorzeichen() {
      if (sieh() === "-") { p++; return { t: "neg", a: vorzeichen() }; }
      if (sieh() === "+") { p++; return vorzeichen(); }
      return potenz();
    }
    function argument() {
      let a = potenz();
      while (startet() && sieh() !== "fn") a = { t: "mul", op: "", a, b: potenz() };
      return a;
    }
    function potenz() {
      const a = basis();
      if (sieh() === "^") { p++; return { t: "pow", a, b: vorzeichen() }; }
      return a;
    }
    function basis() {
      const k = sieh();
      if (k === "zahl") return { t: "zahl", s: t[p++].s };
      if (k === "var") return { t: "var", s: t[p++].s };
      if (k === "konst") return { t: "konst", s: t[p++].s };
      if (k === "fn") { const f = t[p++].s; return { t: "fn", f, a: sieh() === "(" ? basis() : argument() }; }
      if (k === "(") { p++; const a = summe(); nimm(")"); return { t: "klammer", a }; }
      throw new Error("unvollständig");
    }
    const e = summe(); if (p < t.length) throw new Error("Rest");
    return e;
  }
  function wert(n, v) {
    switch (n.t) {
      case "zahl": return parseFloat(n.s.replace(",", "."));
      case "var": if (!(n.s in v)) throw new Error("unbekannt " + n.s); return v[n.s];
      case "konst": return n.s === "π" ? Math.PI : Math.E;
      case "klammer": return wert(n.a, v);
      case "neg": return -wert(n.a, v);
      case "add": return n.op === "+" ? wert(n.a, v) + wert(n.b, v) : wert(n.a, v) - wert(n.b, v);
      case "mul": return wert(n.a, v) * wert(n.b, v);
      case "div": return wert(n.a, v) / wert(n.b, v);
      case "pow": return Math.pow(wert(n.a, v), wert(n.b, v));
      case "fn": return FN[n.f](wert(n.a, v));
    }
  }
  function variablen(n, m = new Set()) {
    if (n.t === "var") m.add(n.s);
    ["a", "b"].forEach(k => n[k] && typeof n[k] === "object" && variablen(n[k], m));
    return m;
  }
  const ohne = n => n.t === "klammer" ? n.a : n;
  function tex(n) {
    switch (n.t) {
      case "zahl": return n.s.replace(/[.,]/, "{,}");
      case "var": return n.s.length > 1 ? n.s[0] + "_{" + n.s.slice(1) + "}" : n.s;
      case "konst": return n.s === "π" ? "\\pi " : "\\mathrm{e}";
      case "klammer": { const i = tex(n.a); return /\\frac|\^/.test(i) ? "\\left(" + i + "\\right)" : "(" + i + ")"; }
      case "neg": return "-" + (n.a.t === "add" ? "\\left(" + tex(n.a) + "\\right)" : tex(n.a));
      case "add": return tex(n.a) + n.op + tex(n.b);
      case "mul": return (n.a.t === "klammer" && n.a.a.t === "div" ? tex(n.a.a) : tex(n.a)) + (n.op ? "\\cdot " : (n.a.t === "zahl" && n.b.t === "zahl" ? "\\cdot " : "")) + tex(n.b);
      case "div": return "\\frac{" + tex(ohne(n.a)) + "}{" + tex(ohne(n.b)) + "}";
      case "pow": { const b = ["zahl", "var", "konst", "klammer", "fn"].includes(n.a.t) ? tex(n.a) : "\\left(" + tex(n.a) + "\\right)"; return "{" + b + "}^{" + tex(ohne(n.b)) + "}"; }
      case "fn": return n.f === "sqrt" ? "\\sqrt{" + tex(ohne(n.a)) + "}" : n.f === "abs" ? "\\left|" + tex(ohne(n.a)) + "\\right|" : "\\" + (n.f === "lg" ? "lg" : n.f) + " " + tex(n.a);
    }
  }
  // Antwort zerlegen: Liste (;), Punkte (a|b), Gleichungen und Ungleichungen
  function tiefe0(s, zeichen) {
    const teile = []; let d = 0, a = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i]; if (c === "(") d++; else if (c === ")") d--;
      else if (d === 0 && s.startsWith(zeichen, i)) { teile.push(s.slice(a, i)); a = i + zeichen.length; i += zeichen.length - 1; }
    }
    teile.push(s.slice(a)); return teile;
  }
  function zerlege(roh) {
    let s = norm(roh).replace(/^L=/, "");
    return tiefe0(s, ";").filter(x => x !== "").map(stueck => {
      const pm = stueck.match(/^([A-Za-z]\w*)?\((.*)\)$/);
      if (pm && tiefe0(pm[2], "|").length > 1) return { art: "punkt", name: pm[1] || "", teile: tiefe0(pm[2], "|").map(parse) };
      for (const r of ["<=", ">=", "=", "<", ">"]) {
        const u = tiefe0(stueck, r);
        if (u.length === 2 && u[0] && u[1]) return { art: "rel", r, l: u[0], links: parse(u[0]), rechts: parse(u[1]) };
      }
      return { art: "term", term: parse(stueck) };
    });
  }
  function texAntwort(roh, ergaenzen) {
    let s = norm(roh);
    if (ergaenzen) { const auf = (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length; if (auf > 0) s += ")".repeat(auf); }
    const R = { "<=": "\\le ", ">=": "\\ge ", "=": "=", "<": "<", ">": ">" };
    return zerlege(s).map(x => x.art === "punkt" ? x.name + "\\left(" + x.teile.map(tex).join("\\mid ") + "\\right)"
      : x.art === "rel" ? tex(x.links) + R[x.r] + tex(x.rechts) : tex(x.term)).join(";\\ ");
  }
  function gleichWert(a, b, o) {
    const vs = [...new Set([...variablen(a), ...variablen(b)])];
    const tol = (x, y) => Math.abs(x - y) <= (o.runden != null ? 0.5 * 10 ** -o.runden + 1e-9 : (o.toleranz ?? 1e-9) * Math.max(1, Math.abs(y)));
    if (!vs.length) { const x = wert(a, {}), y = wert(b, {}); return isFinite(x) && isFinite(y) && tol(x, y); }
    let ok = 0;
    for (let k = 0; k < 12 && ok < 5; k++) {
      const v = {}; vs.forEach(n => v[n] = 0.3 + Math.random() * 2.4 * (k % 3 === 2 ? -1 : 1));
      let x, y; try { y = wert(b, v); x = wert(a, v); } catch (e) { return false; }
      if (!isFinite(y)) continue;
      if (!isFinite(x) || Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(y))) return false;
      ok++;
    }
    return ok >= 3;
  }
  function vergleiche(a, b, o) {
    if (b.art === "punkt") return a.art === "punkt" && a.teile.length === b.teile.length && a.teile.every((t, i) => gleichWert(t, b.teile[i], o));
    if (b.art === "rel" && /^[A-Za-z]\w*$|^[a-z]\(x\)$/.test(b.l)) b = { art: "term", term: b.rechts };
    if (a.art === "rel" && /^[A-Za-z]\w*$|^[a-z]\(x\)$/.test(a.l) && b.art === "term") a = { art: "term", term: a.rechts };
    if (b.art === "rel") return a.art === "rel" && a.r === b.r && gleichWert(a.links, b.links, o) && gleichWert(a.rechts, b.rechts, o);
    return a.art === "term" && gleichWert(a.term, b.term, o);
  }
  // gleich(eingabe, erwartet, { toleranz, runden, form: ["1/2", "0,5"] })
  function gleich(eingabe, erwartet, o = {}) {
    if (o.form) { const f = x => norm(x).replace(/^[a-zA-Z]\w*=/, "").replace(/\./g, ","); return o.form.some(x => f(x) === f(eingabe)); }
    let A, B; try { A = zerlege(eingabe); B = zerlege(erwartet); } catch (e) { return false; }
    if (A.length !== B.length) return false;
    const frei = A.slice();
    return B.every(b => { const i = frei.findIndex(a => vergleiche(a, b, o)); if (i < 0) return false; frei.splice(i, 1); return true; });
  }
  function lesbar(roh) {
    return norm(roh).replace(/\*/g, "·").replace(/sqrt/g, "√").replace(/\^2(?!\d)/g, "²").replace(/\^3(?!\d)/g, "³").replace(/-/g, "−").replace(/\./g, ",");
  }
  return { norm, parse, gleich, texAntwort, lesbar };
})();
/* Tex: Formeln mit KaTeX setzen, ohne KaTeX lesbarer Text */
const Tex = {
  einfach: t => t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)").replace(/\\left|\\right/g, "").replace(/\\cdot ?/g, "·")
    .replace(/\\pi ?/g, "π").replace(/\\sqrt\{([^{}]*)\}/g, "√($1)").replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³")
    .replace(/\\mid ?/g, "|").replace(/\\le ?/g, "≤").replace(/\\ge ?/g, "≥").replace(/\{,\}/g, ",").replace(/\\mathrm\{e\}/g, "e")
    .replace(/\\(sin|cos|tan|ln|log|lg) ?/g, "$1 ").replace(/\\[a-zA-Z]+ ?/g, "").replace(/\\ /g, " ").replace(/[{}]/g, ""),
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
/* Aufgabe mit Tastatur, Prüfen, Tipp, Lösungsweg; merkt sich das Ergebnis für den Chat */
function knopf(text, tu, klasse) { const b = document.createElement("button"); b.type = "button"; b.textContent = text; if (klasse) b.className = klasse; b.addEventListener("click", tu); return b; }
function kasten(klasse) { const d = document.createElement("div"); d.className = klasse; d.hidden = true; return d; }
function baueAufgabe(box, a, nr, geaendert) {
  const st = { nr, versuche: 0, richtig: false, eingabe: "", weg: false };
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
    let ok, roh;
    if (wahl) {
      const r = wahl.querySelector("input:checked"); if (!r) return melde("Wähle zuerst eine Antwort.");
      ok = +r.value === a.richtig; roh = String(r.value); st.eingabe = a.optionen[+r.value];
    } else {
      roh = feld.wert(); if (!roh) return melde("Tippe zuerst eine Antwort ein.");
      ok = Term.gleich(roh, a.antwort, a); st.eingabe = "$" + feld.tex() + "$";
    }
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
    if (s.weg) t += " (Lösungsweg angesehen)";
    z.push((typeof s.nr === "number" ? s.nr + ") " : s.nr + ": ") + t);
  });
  return z.join("\n");
}
/* Koordinatensystem als SVG. Zeichenhilfen in g: kurve, linie, gerade, senkrechte, punkt, text, pfeil, rechteck, polygon, flaeche, bogen, kreis */
const NS = "http://www.w3.org/2000/svg", P = {};
let svg = null, A = {}, W = 640, H = 420, V = {};
function z(v, nk = 2) {
  if (typeof v !== "number" || !isFinite(v)) return "–";
  let r = Number(v.toFixed(nk)); if (Object.is(r, -0)) r = 0;
  return r.toLocaleString("de-DE", { maximumFractionDigits: nk }).replace("-", "−");
}
function pib(v) {
  const k = v / Math.PI; if (Math.abs(k) < 1e-9) return "0";
  for (const d of [1, 2, 3, 4, 6, 12]) { const n = Math.round(k * d); if (Math.abs(k * d - n) < 1e-6) { const g2 = (a, b) => b ? g2(b, a % b) : a, t = g2(Math.abs(n), d), z1 = n / t, n1 = d / t;
    return (z1 < 0 ? "−" : "") + (Math.abs(z1) === 1 ? "" : Math.abs(z1)) + "π" + (n1 === 1 ? "" : "/" + n1); } }
  return z(v);
}
function pm(v, nk = 2) { if (Math.abs(v) < 1e-9) return ""; return v > 0 ? " + " + z(v, nk) : " − " + z(-v, nk); }
function koef(v, punkt) { return v === 1 ? "" : v === -1 ? "−" : z(v) + (punkt ? "·" : ""); }
function rund(v, s) { const d = (String(s).split(".")[1] || "").length; return Number((Math.round(v / s) * s).toFixed(d)); }
function winkel(A1, B1, C1) { const u = [A1.x - B1.x, A1.y - B1.y], w = [C1.x - B1.x, C1.y - B1.y]; return Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180 / Math.PI; }
const wuerfel = () => 1 + Math.floor(Math.random() * 6), muenze = () => (Math.random() < 0.5 ? 0 : 1);
function el(tag, a, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in a) { const v = a[k]; if (v === undefined) continue; if (typeof v === "string" && v.startsWith("var(")) e.style.setProperty(k, v); else e.setAttribute(k, v); }
  (parent || svg).appendChild(e); return e;
}
const px = x => (x - V.xMin) / (V.xMax - V.xMin) * W, py = y => H - (y - V.yMin) / (V.yMax - V.yMin) * H;
function messen() {
  const xR = A.xMax - A.xMin, yR = A.yMax - A.yMin;
  W = Math.max(260, Math.round(svg.getBoundingClientRect().width || 640));
  V = { xMin: A.xMin, xMax: A.xMax, yMin: A.yMin, yMax: A.yMax };
  if (A.gleicheEinheiten) {
    H = W * yR / xR;
    if (H > 480) { H = 480; const n = W * yR / H, m = (A.xMin + A.xMax) / 2; V.xMin = m - n / 2; V.xMax = m + n / 2; }
    if (H < 220) { H = 220; const n = H * xR / W, m = (A.yMin + A.yMax) / 2; V.yMin = m - n / 2; V.yMax = m + n / 2; }
  } else H = Math.min(460, Math.max(220, W * 0.66));
  H = Math.round(H);
}
function teilung(r, p) { const roh = r / Math.max(2, p / 55), q = 10 ** Math.floor(Math.log10(roh)); for (const k of [1, 2, 5, 10]) if (k * q >= roh) return k * q; }
function piText(k) { const s = k < 0 ? "−" : ""; k = Math.abs(k); return k % 2 === 0 ? s + (k === 2 ? "" : k / 2) + "π" : s + (k === 1 ? "" : k) + "π/2"; }
function spitze(x, y, w, f) { const l = 9, b = 4.5, c = Math.cos(w), s = Math.sin(w); el("polygon", { points: `${x},${y} ${x - l * c - b * s},${y - l * s + b * c} ${x - l * c + b * s},${y - l * s - b * c}`, fill: f }); }
function achsen() {
  let sx = teilung(V.xMax - V.xMin, W), sy = teilung(V.yMax - V.yMin, H);
  if (A.xPi) sx = W / (V.xMax - V.xMin) * Math.PI / 2 >= 45 ? Math.PI / 2 : Math.PI; else if (A.gleicheEinheiten) sx = sy = Math.max(sx, sy);
  const xs = [], ys = [];
  const sk = A.skalaX || [-Infinity, Infinity];
  for (let i = Math.ceil(V.xMin / sx); i * sx <= V.xMax + 1e-9; i++) if (i * sx >= sk[0] - 1e-9 && i * sx <= sk[1] + 1e-9) xs.push(i);
  for (let i = Math.ceil(V.yMin / sy); i * sy <= V.yMax + 1e-9; i++) ys.push(i);
  if (A.gitter !== false) { const gg = el("g", { stroke: "var(--grid)" }); xs.forEach(i => el("line", { x1: px(i * sx), x2: px(i * sx), y1: 0, y2: H }, gg)); ys.forEach(i => el("line", { x1: 0, x2: W, y1: py(i * sy), y2: py(i * sy) }, gg)); }
  if (A.achsen === false) return;
  const ax = Math.min(Math.max(py(0), 0), H), ay = Math.min(Math.max(px(0), 0), W);
  el("line", { x1: 0, x2: W - 2, y1: ax, y2: ax, stroke: "var(--axis)", "stroke-width": 1.4 }); el("line", { x1: ay, x2: ay, y1: H, y2: 2, stroke: "var(--axis)", "stroke-width": 1.4 });
  spitze(W - 1, ax, 0, "var(--axis)"); spitze(ay, 1, -Math.PI / 2, "var(--axis)");
  const t = el("g", { class: "tick", fill: "var(--muted)" });
  xs.forEach(i => { if (!i) return; const X = px(i * sx); if (X < 10 || X > W - 18) return; el("line", { x1: X, x2: X, y1: ax - 4, y2: ax + 4, stroke: "var(--axis)" }, t);
    el("text", { x: X, y: ax + 17 > H - 3 ? ax - 8 : ax + 17, "text-anchor": "middle" }, t).textContent = A.xPi ? piText(sx === Math.PI ? 2 * i : i) : z(i * sx, 3); });
  ys.forEach(i => { if (!i) return; const Y = py(i * sy); if (Y < 14 || Y > H - 8) return; el("line", { x1: ay - 4, x2: ay + 4, y1: Y, y2: Y, stroke: "var(--axis)" }, t);
    const l = ay > 34; el("text", { x: l ? ay - 7 : ay + 7, y: Y + 4, "text-anchor": l ? "end" : "start" }, t).textContent = z(i * sy, 3); });
  if (py(0) > 0 && py(0) < H && px(0) > 0 && px(0) < W) el("text", { x: ay - 6, y: ax + 16, "text-anchor": "end" }, t).textContent = "0";
  el("text", { x: W - 12, y: ax - 9, class: "marke", fill: "var(--axis)" }).textContent = "x"; el("text", { x: ay + 9, y: 15, class: "marke", fill: "var(--axis)" }).textContent = "y";
}
function leinwand(ziel, ansicht) {
  svg = ziel; A = ansicht; messen(); svg.textContent = ""; svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.style.height = H + "px";
  const cp = el("clipPath", { id: "clip" }, el("defs", {})); el("rect", { x: 0, y: 0, width: W, height: H }, cp); achsen();
}
const g = {
  get px() { return px; }, get py() { return py; },
  kurve(f, o = {}) {
    const n = Math.round(W * 1.5), sp = V.yMax - V.yMin, von = o.von ?? V.xMin, bis = o.bis ?? V.xMax; let d = "", an = false, alt = 0;
    for (let i = 0; i <= n; i++) { const x = von + (bis - von) * i / n; let y; try { y = f(x, P); } catch (e) { y = NaN; }
      if (typeof y !== "number" || !isFinite(y)) { an = false; continue; } if (an && Math.abs(y - alt) > sp) an = false;
      d += (an ? "L" : "M") + px(x).toFixed(1) + " " + py(Math.max(V.yMin - sp, Math.min(V.yMax + sp, y))).toFixed(1); an = true; alt = y; }
    return el("path", { d, fill: "none", stroke: o.farbe || "var(--f1)", "stroke-width": o.breite || 2.5, "stroke-linejoin": "round", "stroke-dasharray": o.gestrichelt ? "7 5" : undefined, "clip-path": "url(#clip)" });
  },
  linie(x1, y1, x2, y2, o = {}) { return el("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), stroke: o.farbe || "var(--hilf)", "stroke-width": o.breite || 2, "stroke-dasharray": o.gestrichelt ? "6 5" : undefined, "clip-path": "url(#clip)" }); },
  gerade(x0, y0, m, o) { return g.linie(V.xMin, y0 + m * (V.xMin - x0), V.xMax, y0 + m * (V.xMax - x0), o); },
  senkrechte(x0, o) { return g.linie(x0, V.yMin, x0, V.yMax, o); },
  punkt(x, y, o = {}) { if (!isFinite(x) || !isFinite(y)) return; el("circle", { cx: px(x), cy: py(y), r: o.r || 5, fill: o.farbe || "var(--ink)", stroke: "#fff", "stroke-width": 1.5 }); if (o.text) g.text(x, y, o.text, { dx: o.dx ?? 9, dy: o.dy ?? -9, farbe: o.farbe }); },
  text(x, y, s, o = {}) { const t = el("text", { x: px(x) + (o.dx || 0), y: py(y) + (o.dy || 0), class: "marke", fill: o.farbe || "var(--ink)", "text-anchor": o.anker || "start" }); t.textContent = s; return t; },
  pfeil(x1, y1, x2, y2, o = {}) { const f = o.farbe || "var(--ink)"; el("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), stroke: f, "stroke-width": o.breite || 2.5 }); spitze(px(x2), py(y2), Math.atan2(py(y2) - py(y1), px(x2) - px(x1)), f); },
  rechteck(x1, y1, x2, y2, o = {}) { return el("rect", { x: Math.min(px(x1), px(x2)), y: Math.min(py(y1), py(y2)), width: Math.abs(px(x2) - px(x1)), height: Math.abs(py(y2) - py(y1)), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 1 : undefined, "clip-path": "url(#clip)" }); },
  polygon(pts, o = {}) { return el("polygon", { points: pts.map(q => px(q[0]).toFixed(1) + "," + py(q[1]).toFixed(1)).join(" "), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 2 : undefined, "clip-path": "url(#clip)" }); },
  flaeche(f, a, b, o = {}) { const p = [[a, 0]]; for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; p.push([x, f(x, P)]); } p.push([b, 0]); return g.polygon(p, o); },
  bogen(mx, my, r, w1, w2, o = {}) { const p = []; for (let i = 0; i <= 90; i++) { const w = w1 + (w2 - w1) * i / 90; p.push(px(mx + r * Math.cos(w)).toFixed(1) + " " + py(my + r * Math.sin(w)).toFixed(1)); }
    return el("path", { d: "M" + p.join("L") + (o.fuellen ? `L${px(mx).toFixed(1)} ${py(my).toFixed(1)}Z` : ""), fill: o.fuellen || "none", "fill-opacity": o.fuellen ? 0.2 : undefined, stroke: o.farbe || "var(--f1)", "stroke-width": o.breite || 2.5, "stroke-dasharray": o.gestrichelt ? "6 5" : undefined }); },
  kreis(mx, my, r, o = {}) { return g.bogen(mx, my, r, 0, 2 * Math.PI, o); },
};
/* Seiten: Betty.funktionen, Betty.lernschritte, Betty.uebung, Betty.tastatur, Betty.zufall */
const Betty = (() => {
  const $ = id => document.getElementById(id);
  function seite(cfg, html) {
    if (!document.getElementById("betty-stil")) { const s = document.createElement("style"); s.id = "betty-stil"; s.textContent = BETTY_CSS; document.head.appendChild(s); }
    document.title = cfg.titel || "Mathe";
    const m = document.createElement("main"); m.innerHTML = `<h1 id="titel"></h1><div class="auftrag" id="auftrag"></div>` + html; document.body.appendChild(m);
    $("titel").textContent = cfg.titel || ""; Tex.text($("auftrag"), cfg.auftrag || "");
  }
  function regler(box, r, neu, klasse) {
    if (!(r.name in P)) P[r.name] = r.start;
    const l = document.createElement("label"); l.className = klasse || "regler"; l.innerHTML = `${r.anzeige || r.name} = <b></b>`;
    const inp = document.createElement("input"); Object.assign(inp, { type: "range", min: r.min, max: r.max, step: r.schritt, value: P[r.name] });
    const w = () => l.querySelector("b").textContent = r.pi ? pib(P[r.name]) : z(P[r.name], 3);
    inp.addEventListener("input", () => { P[r.name] = rund(+inp.value, r.schritt); w(); neu(); }); w(); l.appendChild(inp); box.appendChild(l); return inp;
  }
  function beiGroesse(f) { let w = 0; addEventListener("resize", () => { cancelAnimationFrame(w); w = requestAnimationFrame(f); }); }

  function funktionen(C) {
    seite(C, `<div class="layout"><svg id="figur" role="img" aria-label="Interaktive Zeichnung"></svg><div class="panel"><div id="terme"></div><div id="regler"></div><div class="anzeige" id="anzeige" aria-live="polite"></div><p class="klein" id="hinweis" hidden>Punkte mit weißem Ring kannst du mit Maus oder Finger ziehen.</p><button type="button" id="reset">Zurücksetzen</button></div></div>`);
    const fig = $("figur"); let griffe = [], aktiv = null; C.parameter = C.parameter || []; C.funktionen = C.funktionen || [];
    function griff(x, y, text, farbe, setze) {
      if (!isFinite(x) || !isFinite(y)) return;
      el("circle", { cx: px(x), cy: py(y), r: 8, fill: farbe, stroke: "#fff", "stroke-width": 3 }); el("circle", { cx: px(x), cy: py(y), r: 11, fill: "none", stroke: farbe, "stroke-width": 1 });
      if (text) el("text", { x: px(x) + 13, y: py(y) - 11, class: "marke", fill: farbe }).textContent = text;
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
      C.parameter.forEach(q => { $("w_" + q.name).textContent = q.pi ? pib(P[q.name]) : z(P[q.name], 3); });
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
    $("reset").addEventListener("click", () => { start(); zeichne(); }); beiGroesse(zeichne); start(); zeichne();
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
      c.querySelector("h2").textContent = s.titel || ""; Tex.text(c.querySelector(".text"), s.text);
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
    beiGroesse(zeichne); zeige(0);
  }

  function uebung(C) {
    seite(C, `<div id="aufgaben"></div><div class="karte"><p id="stand"></p><p class="klein">Wenn du fertig bist oder nicht weiterkommst: Kopiere deine Ergebnisse und füge sie im Chat ein. Dann bekommst du zu allen Aufgaben auf einmal Rückmeldung.</p><button type="button" class="haupt" id="kopieren">Ergebnisse in den Chat kopieren</button></div>`);
    const st = C.aufgaben.map((a, i) => { const b = document.createElement("div"); b.className = "karte"; b.innerHTML = `<div class="nr">Aufgabe ${i + 1}</div>`; $("aufgaben").appendChild(b); return baueAufgabe(b, a, i + 1, stand); });
    function stand() { $("stand").innerHTML = "<b>" + st.filter(s => s.richtig).length + " von " + st.length + " richtig</b>"; }
    stand(); $("kopieren").addEventListener("click", e => kopiere(ergebnisText(C.titel, st), e.currentTarget));
  }

  function tastatur(C) {
    seite(C, `<div id="felder"></div><div class="knoepfe"><button type="button" class="haupt" id="kopieren">In den Chat kopieren</button><button type="button" id="leeren">Leeren</button></div><p class="klein">□/□ macht einen Bruch, xⁿ eine Hochzahl, √ eine Wurzel. Mit ◀ und ▶ kommst du aus einer Klammer heraus. Unter dem Feld siehst du, wie die Formel aussieht.</p>`);
    const fs = (C.felder || [{ name: "Antwort" }]).map(f => { const b = document.createElement("div"); b.className = "karte";
      if (C.felder && (C.felder.length > 1 || f.frage)) { const l = document.createElement("div"); l.className = "frage"; Tex.text(l, f.frage || f.name + ":"); b.appendChild(l); }
      $("felder").appendChild(b); return { name: f.name, feld: Tastatur.feld(b, { platzhalter: f.platzhalter }) }; });
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
  return { funktionen, lernschritte, uebung, tastatur, zufall, version: "1.0.0" };
})();
Object.assign(window, { Betty, Term, Tex, z, pm, pib, koef, rund, winkel, wuerfel, muenze });
})();
