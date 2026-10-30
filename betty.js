/* Betty-Mathe-Baukasten 1.1.0: Lernseiten, Mathe-Tastatur und Zeichnungen für den Mathe-Tutor Betty */
(() => {
const BETTY_CSS = ":root{--ink:#1d2330;--muted:#5d6472;--line:#d9dce3;--grid:#eceef2;--axis:#2f3542;--panel:#f5f6f8;--f1:#1f5fbf;--f2:#d9730d;--f3:#13857a;--hilf:#7d8491;--gut:#13857a;--schlecht:#b3261e;color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:16px/1.5 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif}main{max-width:860px;margin:0 auto;padding:14px 16px 24px}h1{font-size:1.2rem;margin:0 0 4px}.auftrag{margin:0 0 12px;color:var(--muted)}button{font:inherit;padding:8px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);cursor:pointer}button.haupt{background:var(--f1);border-color:var(--f1);color:#fff}button:disabled{opacity:.45;cursor:default}.karte{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:0 0 12px}.knoepfe{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.feld input{width:100%;font:18px/1.4 ui-monospace,Consolas,monospace;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}.feld input:focus{outline:none;border-color:var(--f1)}.vorschau{margin-top:6px;padding:6px 10px;min-height:2.4em;background:var(--panel);border-radius:8px;overflow-x:auto;font-size:1.1rem}.vorschau.unfertig{color:var(--muted)}.vorschau .katex-display{margin:0;text-align:left}.tastatur{margin:8px 0 4px;padding:6px;background:var(--panel);border-radius:10px;max-width:560px;touch-action:manipulation;overscroll-behavior:contain;user-select:none}.tastatur .reiter{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}.tastatur .reiter button{padding:4px 10px;font-size:14px;border-radius:6px;background:#fff;min-height:32px}.tastatur .reiter button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}.tastatur .reiter .umschalten{margin-left:auto;background:#e9ebef}.tastatur .koerper{display:flex;gap:8px}.tastatur .links{flex:2;display:grid;grid-template-columns:repeat(2,1fr);gap:4px}.tastatur .rechts{flex:7;display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.taste{padding:0 2px;min-width:0;min-height:42px;font-size:18px;border-radius:7px;touch-action:manipulation;user-select:none;white-space:nowrap;overflow:hidden}.taste.lang{font-size:14px}.taste.lk{background:#fff}.taste.zf{background:#fff;font-weight:500}.taste.op{background:#f0f2f5}.taste.st{background:#e8eef9;color:#163f80}.taste.ak{background:#e3e6eb;font-size:16px}.taste.leer{visibility:hidden}@media (max-width:520px){.tastatur .koerper{flex-direction:column;gap:4px}.tastatur .links{grid-template-columns:repeat(4,1fr)}.taste{min-height:40px}}.feld.text textarea{width:100%;box-sizing:border-box;font:16px/1.45 system-ui,sans-serif;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;resize:vertical;color:var(--ink)}.feld.text textarea:focus{outline:none;border-color:var(--f1)}.feld.gesperrt input,.feld.gesperrt textarea{background:var(--panel);color:var(--ink)}.rueck{margin-top:8px;padding:8px 10px;border-radius:8px}.rueck.gut{background:#e6f4f1;color:#0b5c53}.rueck.schlecht{background:#fbeceb;color:#8c1d18}.tipp,.weg{margin-top:8px;padding:8px 10px;border-left:3px solid var(--f2);background:#fdf5ec;border-radius:0 8px 8px 0}.weg{border-left-color:var(--f3);background:#eef7f6}.ersatz textarea{width:100%;font:14px/1.4 ui-monospace,Consolas,monospace}.ersatz p{margin:8px 0 4px;color:var(--muted);font-size:.9rem}.klein{font-size:.9rem;color:var(--muted)}.nr{font-size:.8rem;font-weight:600;color:var(--muted);text-transform:none;margin-bottom:2px}h2{font-size:1.05rem;margin:0 0 6px}.frage{margin:0 0 8px}.optionen{display:grid;gap:6px;margin:4px 0}.optionen label{display:flex;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--line);border-radius:8px;cursor:pointer}.optionen input{width:18px;height:18px;accent-color:var(--f1)}.aufgabe{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.layout{display:grid;gap:14px}@media(min-width:760px){.layout{grid-template-columns:minmax(0,1fr) 340px;align-items:start}#figur{position:sticky;top:8px}}#figur{width:100%;display:block;border:1px solid var(--line);border-radius:8px;user-select:none}.tick{font-size:12px}.marke{font-size:14px;font-weight:600}.regler{display:block;margin:10px 0 0;font-weight:600}.regler input{width:100%;height:30px;accent-color:var(--f2)}.nav{justify-content:space-between}.punkte{display:flex;gap:6px;justify-content:center;margin-top:10px}.punkte button{width:14px;height:14px;padding:0;border-radius:50%;border:1.5px solid var(--hilf);background:#fff}.punkte button.fertig{background:var(--hilf)}.punkte button.an{background:var(--f1);border-color:var(--f1)}.layout.ohne{grid-template-columns:1fr}.panel{background:var(--panel);border-radius:8px;padding:10px 12px}.panel label{display:block;font-weight:600;margin:8px 0 0}.panel input[type=range]{width:100%;height:30px;accent-color:var(--f1)}.wert{float:right;font-weight:400;font-variant-numeric:tabular-nums}.term{margin:2px 0;font-size:1.05rem}.term b{font-size:.8rem;vertical-align:1px}.anzeige{margin:10px 0}.anzeige div{display:flex;justify-content:space-between;gap:8px;border-top:1px solid var(--line);padding:4px 0;font-variant-numeric:tabular-nums}.stand{margin:10px 0;font-variant-numeric:tabular-nums}.diagramm{width:100%;display:block;border:1px solid var(--line);border-radius:8px}.uhr{position:sticky;top:0;z-index:5;margin:0 -2px 12px;padding:8px 12px;border-radius:8px;background:var(--ink);color:#fff;font-weight:600;font-variant-numeric:tabular-nums}.uhr.knapp{background:#9a5b00}.uhr.vorbei{background:var(--schlecht)}.uhr.fertig{background:var(--gut)}.start table.teile{border-collapse:collapse;width:100%;margin:4px 0 8px;font-size:.95rem}.start th,.start td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line)}.start th{color:var(--muted);font-weight:600;font-size:.85rem}.start td:last-child,.start th:last-child{text-align:right}.start td:nth-child(-n+2){white-space:nowrap}.summe{font-weight:600;margin:4px 0 10px}.wahl{display:grid;gap:6px;margin:8px 0}.wahl .frage{margin:4px 0 0;font-weight:600}.wahl label{display:flex;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--line);border-radius:8px;cursor:pointer}.wahl input{width:18px;height:18px;accent-color:var(--f1);flex:none}.teilkopf h2{margin:4px 0 0}.teilkopf p{margin:2px 0 10px}.aufgabe-pa .nr{display:flex;justify-content:space-between;gap:8px;font-size:.85rem}.pkt{color:var(--muted);font-weight:600;white-space:nowrap;margin-left:auto}.ta{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.ta:first-of-type{border-top:0}.ta-kopf{display:flex;gap:8px;align-items:baseline}.ta-text{flex:1}.feldzeile{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:8px}.feldzeile .feld{flex:1 1 180px;min-width:0}.feldzeile .vor,.feldzeile .nach{white-space:nowrap}.feldzeile .tastatur{flex-basis:100%}.feldzeile .vorschau{font-size:1rem;min-height:0;padding:4px 10px}.taste.st{font-size:15px}.fig{width:100%;display:block;border:1px solid var(--line);border-radius:8px;margin:8px 0}.papier{margin:8px 0 0;font-size:.9rem;color:var(--muted)}.papier::before{content:\"✎ \"}.klein-knopf{padding:4px 10px;font-size:.9rem;margin-top:8px}.erg{margin:4px 0 0;font-size:.95rem;font-weight:600}.erg.richtig{color:var(--gut)}.erg.falsch{color:var(--schlecht)}.erg.gerundet{color:#9a5b00}.erg.leer,.erg.offen{color:var(--muted)}.erg span{font-weight:400}.optionen label.richtig{border-color:var(--gut);background:#eef7f6}.optionen label.falsch{border-color:var(--schlecht);background:#fbeceb}.auswertung{margin-top:8px;font-size:.9rem;color:var(--muted)}.auswertung p{margin:4px 0}.loesung{margin-top:6px;padding:8px 10px;border-left:3px solid var(--f3);background:#eef7f6;border-radius:0 8px 8px 0;color:var(--ink);font-size:1rem}.ergebnis{border-color:var(--f1);border-width:2px}.ergebnis h2{margin:0 0 6px}";
/* Term: Eingaben lesen, als Formel anzeigen und mathematisch vergleichen */
const Term = (() => {
  const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan, ln: Math.log, log: Math.log10, lg: Math.log10, sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs };
  const NAMEN = ["sqrt", "cbrt", "sin", "cos", "tan", "abs", "log", "ln", "lg"];
  const GR = "αβγδεζηθικλμνξορστυφχψωΓΔΘΛΞΣΦΨΩ", GRT = "alpha beta gamma delta varepsilon zeta eta theta iota kappa lambda mu nu xi omicron rho sigma tau upsilon varphi chi psi omega Gamma Delta Theta Lambda Xi Sigma Phi Psi Omega".split(" ");
  const fak = n => { if (n < 0 || n > 170 || Math.abs(n - Math.round(n)) > 1e-9) return NaN; let r = 1; for (let i = 2; i <= Math.round(n); i++) r *= i; return r; };
  function norm(s) {
    return String(s).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[·×⋅*]/g, "*").replace(/[÷:]/g, "/")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁻¹/g, "^(-1)").replace(/∛/g, "cbrt").replace(/√/g, "sqrt").replace(/pi/gi, "π")
      .replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/≠/g, "!=").replace(/[≈]/g, "~").replace(/\{|\}/g, "");
  }
  function tokens(s) {
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i], r = s.slice(i);
      let m = r.match(/^\d+([.,]\d+)?|^[.,]\d+/);
      if (m) { t.push({ k: "zahl", s: m[0] }); i += m[0].length; continue; }
      const f = NAMEN.find(n => r.startsWith(n));
      if (f) { t.push({ k: "fn", s: f }); i += f.length; continue; }
      if (/[a-zA-Zπ∞]/.test(c) || GR.includes(c)) {
        let s2 = c; if (s[i + 1] === "_" && /[\w]/.test(s[i + 2] || "")) { s2 += s[i + 2]; i += 2; }
        else if (/\d/.test(s[i + 1] || "") && /[xy]/.test(c) && /[;=|)]|$/.test(s[i + 2] || "")) { s2 += s[i + 1]; i += 1; }
        t.push({ k: c === "π" || c === "∞" || (c === "e" && s2 === "e") ? "konst" : "var", s: s2 }); i += 1; continue;
      }
      if ("+-*/^()%°".includes(c) || (c === "!" && s[i + 1] !== "=")) { t.push({ k: c }); i++; continue; }
      throw new Error("Zeichen " + c);
    }
    return t;
  }
  let LR = false; // zweite Lesart: a/bc als (a/b)·c, nur für eine nachsichtige Auswertung
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
      for (;;) {
        // (a)/(b)(c): ein Nenner in Klammern endet an der Klammer, danach wird weiter multipliziert
        if (sieh() === "*" || sieh() === "/") { const op = t[p++].k; const b = op === "/" && (sieh() === "(" || LR) ? potenz() : folge(); a = op === "*" ? { t: "mul", op, a, b } : { t: "div", a, b }; continue; }
        if (startet()) { a = { t: "mul", op: "", a, b: folge() }; continue; }
        return a;
      }
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
      let a = basis();
      while (sieh() === "!" || sieh() === "%" || sieh() === "°") { const k = t[p++].k; a = { t: k === "!" ? "fak" : k === "%" ? "proz" : "grad", a }; }
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
      case "konst": return n.s === "π" ? Math.PI : n.s === "∞" ? Infinity : Math.E;
      case "fak": return fak(wert(n.a, v));
      case "proz": return wert(n.a, v) / 100;
      case "grad": return wert(n.a, v);
      case "klammer": return wert(n.a, v);
      case "neg": return -wert(n.a, v);
      case "add": return n.op === "+" ? wert(n.a, v) + wert(n.b, v) : wert(n.a, v) - wert(n.b, v);
      case "mul": return wert(n.a, v) * wert(n.b, v);
      case "div": return wert(n.a, v) / wert(n.b, v);
      case "pow": return Math.pow(wert(n.a, v), wert(n.b, v));
      case "fn": { const g = ohne(n.a); return FN[n.f](g.t === "grad" && "sin cos tan".includes(n.f) ? wert(g.a, v) * Math.PI / 180 : wert(n.a, v)); }
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
      case "var": { const g = i => GR.includes(i) ? "\\" + GRT[GR.indexOf(i)] + " " : i; return n.s.length > 1 ? g(n.s[0]) + "_{" + n.s.slice(1) + "}" : g(n.s); }
      case "konst": return n.s === "π" ? "\\pi " : n.s === "∞" ? "\\infty " : "\\mathrm{e}";
      case "fak": return (["zahl", "var", "klammer"].includes(n.a.t) ? tex(n.a) : "\\left(" + tex(n.a) + "\\right)") + "!";
      case "proz": return tex(n.a) + "\\,\\%";
      case "grad": return tex(n.a) + "^{\\circ}";
      case "klammer": { const i = tex(n.a); return /\\frac|\^/.test(i) ? "\\left(" + i + "\\right)" : "(" + i + ")"; }
      case "neg": return "-" + (n.a.t === "add" ? "\\left(" + tex(n.a) + "\\right)" : tex(n.a));
      case "add": return tex(n.a) + n.op + tex(n.b);
      case "mul": return (n.a.t === "klammer" && n.a.a.t === "div" ? tex(n.a.a) : tex(n.a)) + (n.op ? "\\cdot " : (n.a.t === "zahl" && n.b.t === "zahl" ? "\\cdot " : "")) + tex(n.b);
      case "div": { const z1 = ohne(n.a); return z1.t === "neg" ? "-\\frac{" + tex(ohne(z1.a)) + "}{" + tex(ohne(n.b)) + "}" : "\\frac{" + tex(z1) + "}{" + tex(ohne(n.b)) + "}"; }
      case "pow": { const b = ["zahl", "var", "konst", "klammer", "fn"].includes(n.a.t) ? tex(n.a) : "\\left(" + tex(n.a) + "\\right)"; return "{" + b + "}^{" + tex(ohne(n.b)) + "}"; }
      case "fn": return n.f === "sqrt" ? "\\sqrt{" + tex(ohne(n.a)) + "}" : n.f === "cbrt" ? "\\sqrt[3]{" + tex(ohne(n.a)) + "}" : n.f === "abs" ? "\\left|" + tex(ohne(n.a)) + "\\right|" : "\\" + (n.f === "lg" ? "lg" : n.f) + " " + tex(n.a);
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
      for (const r of ["<=", ">=", "!=", "=", "~", "<", ">"]) {
        const u = tiefe0(stueck, r);
        if (u.length === 2 && u[0] && u[1]) return { art: "rel", r, l: u[0], links: parse(u[0]), rechts: parse(u[1]) };
      }
      return { art: "term", term: parse(stueck) };
    });
  }
  function texAntwort(roh, ergaenzen) {
    let s = norm(roh);
    if (ergaenzen) { const auf = (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length; if (auf > 0) s += ")".repeat(auf); }
    const R = { "<=": "\\le ", ">=": "\\ge ", "!=": "\\neq ", "~": "\\approx ", "=": "=", "<": "<", ">": ">" };
    return zerlege(s).map(x => x.art === "punkt" ? x.name + "\\left(" + x.teile.map(tex).join("\\mid ") + "\\right)"
      : x.art === "rel" ? tex(x.links) + R[x.r] + tex(x.rechts) : tex(x.term)).join(";\\ ");
  }
  function gleichWert(a, b, o) {
    const vs = [...new Set([...variablen(a), ...variablen(b)])];
    const tol = (x, y) => Math.abs(x - y) <= (o.runden != null ? 0.5 * 10 ** -o.runden + 1e-9 : (o.toleranz ?? 1e-9) * Math.max(1, Math.abs(y)));
    if (!vs.length) { const x = wert(a, {}), y = wert(b, {}); return (isFinite(x) && isFinite(y) && tol(x, y)) || (Math.abs(x) === Infinity && x === y); }
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
  // Gleichungen sind gleichwertig, wenn (links − rechts) bis auf einen festen Faktor übereinstimmt; bei Ungleichungen
  // dreht ein negativer Faktor das Zeichen um
  const DREH = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "!=": "!=", "~": "~" };
  function relGleich(a, b, o) {
    if (a.r === b.r && gleichWert(a.links, b.links, o) && gleichWert(a.rechts, b.rechts, o)) return true;
    const da = { t: "add", op: "-", a: a.links, b: a.rechts }, db = { t: "add", op: "-", a: b.links, b: b.rechts };
    const vs = [...new Set([...variablen(da), ...variablen(db)])]; let k = null, n = 0;
    for (let i = 0; i < 14 && n < 6; i++) {
      const v = {}; vs.forEach(x => v[x] = 0.3 + Math.random() * 2.4 * (i % 3 === 2 ? -1 : 1));
      let x, y; try { x = wert(da, v); y = wert(db, v); } catch (e) { return false; }
      if (!isFinite(x) || !isFinite(y)) continue;
      if (Math.abs(y) < 1e-9) { if (Math.abs(x) > 1e-7) return false; continue; }
      const q = x / y; if (k === null) k = q; else if (Math.abs(q - k) > 1e-7 * Math.max(1, Math.abs(k))) return false; n++;
    }
    if (k === null || n < 3 || Math.abs(k) < 1e-12) return false;
    return k > 0 ? a.r === b.r : a.r === DREH[b.r];
  }
  function vergleiche(a, b, o) {
    if (b.art === "punkt") return a.art === "punkt" && a.teile.length === b.teile.length && a.teile.every((t, i) => gleichWert(t, b.teile[i], o));
    const allein = x => x.art === "rel" && (x.r === "=" || x.r === "~") && /^[A-Za-zα-ω]\w*$|^[a-z]\([a-z]\)$/.test(x.l);
    if (allein(b)) b = { art: "term", term: b.rechts };
    if (allein(a) && b.art === "term") a = { art: "term", term: a.rechts };
    if (b.art === "rel") return a.art === "rel" && relGleich(a, b, o);
    return a.art === "term" && gleichWert(a.term, b.term, o);
  }
  // gleich(eingabe, erwartet, { toleranz, runden, form: ["1/2", "0,5"] })
  function gleich(eingabe, erwartet, o = {}) {
    if (o.form) { const f = x => norm(x).replace(/^[a-zA-Z]\w*=/, "").replace(/\./g, ","); return o.form.some(x => f(x) === f(eingabe)); }
    let A, B; try { B = zerlege(erwartet); LR = !!o.links; A = zerlege(eingabe); } catch (e) { return false; } finally { LR = false; }
    if (A.length !== B.length) return false;
    const frei = A.slice();
    return B.every(b => { const i = frei.findIndex(a => vergleiche(a, b, o)); if (i < 0) return false; frei.splice(i, 1); return true; });
  }
  function lesbar(roh) {
    return norm(roh).replace(/!=/g, "≠").replace(/~/g, "≈").replace(/<=/g, "≤").replace(/>=/g, "≥").replace(/\*/g, "·").replace(/cbrt/g, "∛").replace(/sqrt/g, "√").replace(/\^2(?!\d)/g, "²").replace(/\^3(?!\d)/g, "³").replace(/-/g, "−").replace(/\./g, ",");
  }
  return { norm, parse, gleich, texAntwort, lesbar };
})();
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
      if (!roh.includes("\\")) { try { tex = Term.texAntwort(roh); } catch (x) {
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
    w.after(box); box.hidden = false; baue();
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
/* Aufgabe mit Tastatur, Prüfen, Tipp, Lösungsweg; merkt sich das Ergebnis für den Chat */
function knopf(text, tu, klasse) { const b = document.createElement("button"); b.type = "button"; b.textContent = text; if (klasse) b.className = klasse; b.addEventListener("click", tu); return b; }
function kasten(klasse) { const d = document.createElement("div"); d.className = klasse; d.hidden = true; return d; }
function baueAufgabe(box, a, nr, geaendert) {
  const st = { nr, versuche: 0, richtig: false, offen: false, eingabe: "", weg: false, frueher: [] };
  const q = document.createElement("div"); q.className = "frage"; Tex.text(q, a.frage); box.appendChild(q);
  let feld = null, wahl = null;
  if (a.optionen) {
    wahl = document.createElement("div"); wahl.className = "optionen";
    a.optionen.forEach((o, i) => {
      const l = document.createElement("label"), r = document.createElement("input"), s = document.createElement("span");
      Object.assign(r, { type: "radio", name: "wahl" + nr, value: i }); Tex.text(s, o); l.append(r, s); wahl.appendChild(l);
    });
    box.appendChild(wahl);
  } else feld = Tastatur.feld(box, { beiEnter: pruefe, platzhalter: a.platzhalter, tastatur: a.tastatur });
  const reihe = document.createElement("div"); reihe.className = "knoepfe";
  const bTipp = knopf("Tipp", () => zeige(tipp, a.tipp)), bWeg = knopf("Lösungsweg", () => { st.weg = true; zeige(weg, a.weg); geaendert(); });
  bTipp.hidden = !a.tipp; bWeg.hidden = true;
  reihe.append(knopf("Prüfen", pruefe, "haupt"), bTipp, bWeg); box.appendChild(reihe);
  const rueck = kasten("rueck"), tipp = kasten("tipp"), weg = kasten("weg"); box.append(rueck, tipp, weg);
  function zeige(k, s) { if (s) { Tex.text(k, s); k.hidden = false; } }
  function melde(s, ok) { rueck.hidden = false; rueck.className = "rueck" + (ok === true ? " gut" : ok === false ? " schlecht" : ""); Tex.text(rueck, s); }
  function pruefe() {
    let ok, roh; const vorher = st.eingabe, nach = a.wegNach ?? 3;
    if (wahl) {
      const r = wahl.querySelector("input:checked"); if (!r) return melde("Wähle zuerst eine Antwort.");
      ok = +r.value === a.richtig; roh = String(r.value); st.eingabe = a.optionen[+r.value];
    } else {
      roh = feld.wert(); if (!roh) return melde("Tippe zuerst eine Antwort ein.");
      st.eingabe = "$" + feld.tex() + "$";
      if (a.antwort == null) { // ohne Lösungsschlüssel: nicht bewerten, Betty prüft im Chat
        st.offen = true; st.versuche = 1; melde(a.notiert || "Notiert. Kopier am Ende deine Ergebnisse in den Chat, dann prüfe ich das."); if (a.weg) bWeg.hidden = false; geaendert(); return;
      }
      ok = Term.gleich(roh, a.antwort, a);
    }
    if (st.versuche && vorher && !st.richtig) st.frueher.push(vorher);
    st.versuche++; st.richtig = ok;
    const bekannt = !ok && (a.fehler || []).find(f => wahl ? String(f.antwort) === roh : Term.gleich(roh, String(f.antwort), {}));
    const wegFrei = !ok && a.weg && st.versuche >= nach;
    const jetztFrei = wegFrei && st.versuche === nach;
    melde(ok ? (a.lob || "Richtig.") : (bekannt ? bekannt.text : st.versuche === 1 && a.tipp ? "Noch nicht. Schau dir den Tipp an." : jetztFrei ? "Noch nicht richtig." : "Noch nicht richtig. Versuch es noch einmal.")
      + (jetztFrei ? " Den Lösungsweg kannst du jetzt aufdecken." : ""), ok);
    if (!ok && st.versuche === 1) zeige(tipp, a.tipp);
    if ((ok || st.versuche >= nach) && a.weg) bWeg.hidden = false;
    geaendert();
  }
  return st;
}
function ergebnisText(titel, liste) {
  const z = ["Meine Ergebnisse: " + titel];
  liste.forEach(s => {
    let t = !s.versuche ? "nicht bearbeitet" : s.offen ? "eingegeben (bitte prüfen): " + s.eingabe : s.richtig ? "richtig" + (s.versuche > 1 ? " im " + s.versuche + ". Versuch" : "") + ": " + s.eingabe
      : "noch nicht richtig (" + s.versuche + (s.versuche > 1 ? " Versuche" : " Versuch") + "), zuletzt: " + s.eingabe;
    if (s.frueher.length) t += " (vorher: " + s.frueher.join(", ") + ")";
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
const TIEF = "₀₁₂₃₄₅₆₇₈₉";
function marke(s) {
  return String(s ?? "").replace(/\$([^$]+)\$/g, (m, f) => {
    f = f.replace(/_\{?(\d+)\}?/g, (m2, d) => [...d].map(c => TIEF[c]).join(""));
    if (f.includes("\\")) return Tex.einfach(f);
    return f.replace(/<=/g, "≤").replace(/>=/g, "≥").replace(/\*/g, "·").replace(/sqrt/g, "√").replace(/(^|[^a-zA-Z])pi(?![a-zA-Z])/g, "$1π")
      .replace(/\^2(?!\d)/g, "²").replace(/\^3(?!\d)/g, "³").replace(/(\d)\.(\d)/g, "$1,$2").replace(/-/g, "−");
  });
}
const px = x => (x - V.xMin) / (V.xMax - V.xMin) * W, py = y => H - (y - V.yMin) / (V.yMax - V.yMin) * H;
function messen() {
  const xR = A.xMax - A.xMin, yR = A.yMax - A.yMin;
  W = Math.max(260, Math.round(svg.getBoundingClientRect().width || 640));
  V = { xMin: A.xMin, xMax: A.xMax, yMin: A.yMin, yMax: A.yMax };
  const HM = Math.round(Math.min(480, Math.max(240, (window.innerHeight || 800) * 0.55)));
  if (A.gleicheEinheiten) {
    H = W * yR / xR;
    if (H > HM) { H = HM; const n = W * yR / H, m = (A.xMin + A.xMax) / 2; V.xMin = m - n / 2; V.xMax = m + n / 2; }
    if (H < 220) { H = 220; const n = H * xR / W, m = (A.yMin + A.yMax) / 2; V.yMin = m - n / 2; V.yMax = m + n / 2; }
  } else H = Math.min(HM, Math.max(220, W * 0.66));
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
  text(x, y, s, o = {}) { s = marke(s); const t = el("text", { x: px(x) + (o.dx || 0), y: py(y) + (o.dy || 0), class: "marke", fill: o.farbe || "var(--ink)", "text-anchor": o.anker || "start" }); t.textContent = s; return t; },
  pfeil(x1, y1, x2, y2, o = {}) { const f = o.farbe || "var(--ink)"; el("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), stroke: f, "stroke-width": o.breite || 2.5 }); spitze(px(x2), py(y2), Math.atan2(py(y2) - py(y1), px(x2) - px(x1)), f); },
  rechteck(x1, y1, x2, y2, o = {}) { return el("rect", { x: Math.min(px(x1), px(x2)), y: Math.min(py(y1), py(y2)), width: Math.abs(px(x2) - px(x1)), height: Math.abs(py(y2) - py(y1)), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 1 : undefined, "clip-path": "url(#clip)" }); },
  polygon(pts, o = {}) { return el("polygon", { points: pts.map(q => px(q[0]).toFixed(1) + "," + py(q[1]).toFixed(1)).join(" "), fill: o.farbe || "var(--f1)", "fill-opacity": o.deckkraft ?? 0.2, stroke: o.rand, "stroke-width": o.rand ? 2 : undefined, "clip-path": "url(#clip)" }); },
  flaeche(f, a, b, o = {}) { const p = [[a, 0]]; for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; p.push([x, f(x, P)]); } p.push([b, 0]); return g.polygon(p, o); },
  bogen(mx, my, r, w1, w2, o = {}) { const p = []; for (let i = 0; i <= 90; i++) { const w = w1 + (w2 - w1) * i / 90; p.push(px(mx + r * Math.cos(w)).toFixed(1) + " " + py(my + r * Math.sin(w)).toFixed(1)); }
    return el("path", { d: "M" + p.join("L") + (o.fuellen ? `L${px(mx).toFixed(1)} ${py(my).toFixed(1)}Z` : ""), fill: o.fuellen || "none", "fill-opacity": o.fuellen ? 0.2 : undefined, stroke: o.farbe || "var(--f1)", "stroke-width": o.breite || 2.5, "stroke-dasharray": o.gestrichelt ? "6 5" : undefined }); },
  kreis(mx, my, r, o = {}) { return g.bogen(mx, my, r, 0, 2 * Math.PI, o); },
};
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
  return { funktionen, lernschritte, uebung, tastatur, zufall, probearbeit: C => probearbeit(C, { seite, $, beiGroesse, rundPruefen }), version: "1.1.0" };
})();
Object.assign(window, { Betty, Term, Tex, z, pm, pib, koef, rund, winkel, wuerfel, muenze });
})();
