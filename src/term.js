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
