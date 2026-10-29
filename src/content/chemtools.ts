// Hilfsfunktionen für Reaktionsgleichungen: Formeln zerlegen und Atombilanz prüfen.

const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-' };

/** Zerlegt eine Formel wie „Ca(OH)₂“ oder „Fe³⁺“ in Atomzahlen und Ladung. Elektronen: „e⁻“. */
export function parseFormula(f: string): { atoms: Record<string, number>; charge: number } {
  let charge = 0;
  let body = f.trim();
  const m = body.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/);
  if (m) {
    const n = m[1] ? Number([...m[1]].map((c) => SUP[c]).join('')) : 1;
    charge = m[2] === '⁺' ? n : -n;
    body = body.slice(0, body.length - m[0].length);
  }
  if (body === 'e') return { atoms: {}, charge };
  body = [...body].map((c) => SUB[c] ?? c).join('');
  const stack: Record<string, number>[] = [{}];
  let i = 0;
  const readNum = () => { let s = ''; while (i < body.length && /\d/.test(body[i])) s += body[i++]; return s ? Number(s) : 1; };
  while (i < body.length) {
    const c = body[i];
    if (c === '(') { stack.push({}); i++; }
    else if (c === ')') {
      i++;
      const k = readNum();
      const top = stack.pop()!;
      const into = stack[stack.length - 1];
      for (const [el, n] of Object.entries(top)) into[el] = (into[el] ?? 0) + n * k;
    } else if (/[A-Z]/.test(c)) {
      let el = c; i++;
      while (i < body.length && /[a-z]/.test(body[i])) el += body[i++];
      const k = readNum();
      const into = stack[stack.length - 1];
      into[el] = (into[el] ?? 0) + k;
    } else throw new Error(`Unerwartetes Zeichen „${c}“ in ${f}`);
  }
  return { atoms: stack[0], charge };
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Prüft Koeffizienten: Atombilanz je Element, Ladungsbilanz, kleinste ganze Zahlen. */
export function checkBalance(reactants: string[], products: string[], coeff: number[]) {
  const side = (list: string[], off: number) => {
    const atoms: Record<string, number> = {};
    let charge = 0;
    list.forEach((f, j) => {
      const p = parseFormula(f);
      const k = coeff[off + j] ?? 0;
      for (const [el, n] of Object.entries(p.atoms)) atoms[el] = (atoms[el] ?? 0) + n * k;
      charge += p.charge * k;
    });
    return { atoms, charge };
  };
  const L = side(reactants, 0);
  const R = side(products, reactants.length);
  const elements = [...new Set([...Object.keys(L.atoms), ...Object.keys(R.atoms)])];
  const rows = elements.map((el) => ({ el, left: L.atoms[el] ?? 0, right: R.atoms[el] ?? 0 }));
  const valid = coeff.length === reactants.length + products.length && coeff.every((c) => Number.isInteger(c) && c > 0);
  const atomsOk = rows.every((r) => r.left === r.right);
  const chargeOk = L.charge === R.charge;
  const minimal = valid && coeff.reduce((a, b) => gcd(a, b)) === 1;
  return { valid, rows, chargeLeft: L.charge, chargeRight: R.charge, atomsOk, chargeOk, minimal, balanced: valid && atomsOk && chargeOk };
}
