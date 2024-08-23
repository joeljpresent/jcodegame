export function isInt32(n: number): boolean {
  return (n | 0) === n;
}

export function parseInt32(s: string): number {
  if (!/^-?(\d+|0x[0-9a-f]+)$/i.test(s)) {
    throw Error(`could not parse int32: ${s}`);
  }
  const n = Number.parseInt(s);
  if (!isInt32(n)) {
    throw Error(`invalid int32: ${n}`);
  }
  return n | 0;
}
