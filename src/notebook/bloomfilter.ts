// Creates a new bloom filter with *m* bits and *k* hashing functions.
export class BloomFilter {
  m: number;
  k: number;
  buckets: Uint32Array;
  _locations: Uint32Array;

  constructor(m: number, k: number) {
    this.m = m;
    this.k = k;
    const n = Math.ceil(this.m / 32);
    this.buckets = new Uint32Array(new ArrayBuffer(32 * n));
    const kbytes =
      1 <<
      Math.ceil(
        Math.log(Math.ceil(Math.log(this.m) / Math.LN2 / 8)) / Math.LN2
      );
    this._locations = new Uint32Array(new ArrayBuffer(kbytes * this.k));
  }

  // See http://willwhim.wordpress.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
  locations(v: string) {
    let k = this.k,
      m = this.m,
      r = this._locations,
      a = fnv_1a(v),
      b = (a >>> 16) & 0xffff, //b = fnv_1a_b(a),
      i = -1,
      x = (a &= 0xffff) % m;
    while (++i < k) {
      x = (a + i * b) % m;
      r[i] = x < 0 ? (x + m) % m : x;
      x = (x + b) % m;
    }
    return r;
  }

  add(v: string) {
    const l = this.locations(v);
    let i = -1,
      k = this.k,
      buckets = this.buckets;
    while (++i < k) {
      buckets[Math.floor(l[i] / 32)] |= 1 << l[i] % 32;
    }
  }
  test(v: string) {
    const l = this.locations(v);
    let i = -1,
      k = this.k,
      b,
      buckets = this.buckets;
    while (++i < k) {
      b = l[i];
      if ((buckets[Math.floor(b / 32)] & (1 << b % 32)) === 0) {
        return false;
      }
    }
    return true;
  }
}

// Fowler/Noll/Vo hashing.
export function fnv_1a(v: string) {
  const n = v.length;
  let a = 0x811c9dc5;
  let c: number,
    d: number,
    i = -1;
  while (++i < n) {
    c = v.charCodeAt(i);
    if ((d = c & 0xff000000)) {
      a ^= d >> 24;
      a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      a &= 0xffffffff;
    }
    if ((d = c & 0xff0000)) {
      a ^= d >> 16;
      a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      a &= 0xffffffff;
    }
    if ((d = c & 0xff00)) {
      a ^= d >> 8;
      a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      a &= 0xffffffff;
    }
    a ^= c & 0xff;
    a = addMod32(a, (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24));
    a &= 0xffffffff;
  }
  // From http://home.comcast.net/~bretm/hash/6.html
  a += a << 13;
  a ^= a >> 7;
  a += a << 3;
  a ^= a >> 17;
  a += a << 5;
  return a;
}

// Addition modulo 32-bits.
function addMod32(a: number, b: number) {
  const r = a + (b - 0xffffffff - 1);
  if (r > 0) {
    return r;
  }
  return a + b;
}

// One additional iteration of FNV, given a hash.
export function fnv_1a_b(a: number) {
  a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
  a += a << 13;
  a ^= a >> 7;
  a += a << 3;
  a ^= a >> 17;
  a += a << 5;
  return a & 0xffffffff;
}
