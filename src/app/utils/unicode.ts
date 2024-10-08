export function isUnicodeCodePoint(n: number) {
  return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff);
}

/**
 * Convert an array of Unicode code points to a Unicode string.
 *
 * Any invalid code point is replaced with a REPLACEMENT CHARACTER (U+FFFD).
 */
export function toUnicode(arr: number[]) {
  return String.fromCodePoint(...arr.map(n => isUnicodeCodePoint(n) ? n : 0xfffd));
}

export function toUnicodeChar(n: number) {
  return String.fromCodePoint(isUnicodeCodePoint(n) ? n : 0xfffd);
}

const ESCAPE: { [k: string]: number } = {
  "\\": "\\".charCodeAt(0),
  "'": "'".charCodeAt(0),
  '"': '"'.charCodeAt(0),
  b: "\b".charCodeAt(0),
  f: "\f".charCodeAt(0),
  n: "\n".charCodeAt(0),
  r: "\r".charCodeAt(0),
  t: "\t".charCodeAt(0),
};

export function parseCharLiteral(s: string): number {
  if (/^'[^\x00-\x1f'\\]'$/u.test(s)) {
    return s.codePointAt(1)!;
  } else if (/^'\\[\\'"bfnrt]'$/u.test(s)) {
    return ESCAPE[s.charAt(2)!];
  }
  throw Error(`invalid char literal: ${s}`);
}

export function parseStringLiteral(s: string) {
  if (s.charAt(0) !== '"') {
    throw Error("String literal must start with a double quote");
  }
  const numbers: number[] = [];
  let idx = 1;
  while (true) {
    const char = s.charAt(idx);
    const charCode = char.charCodeAt(0);
    if (char === "\\") {
      idx += 1;
      const nextChar = s.charAt(idx);
      const escaped = ESCAPE[nextChar];
      if (escaped == null) {
        throw Error(`Invalid escape sequence: \\${nextChar}`);
      }
      numbers.push(escaped);
    } else if (charCode < 0x20) {
      throw Error("Invalid control character");
    } else if (Number.isNaN(charCode)) {
      throw Error("Unexpected end of string");
    } else if (char === '"') {
      console.log({numbers});
      return numbers;
    } else {
      numbers.push(charCode);
    }
    idx += 1;
  }
}
