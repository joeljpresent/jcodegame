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
