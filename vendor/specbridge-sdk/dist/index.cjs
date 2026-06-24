"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AnnotList: () => AnnotList,
  AnnotPanel: () => AnnotPanel,
  AnnotPin: () => AnnotPin,
  AnnotationToolbar: () => AnnotationToolbar,
  AuthorModal: () => AuthorModal,
  COLORS: () => COLORS,
  DEFAULT_LABELS: () => DEFAULT_LABELS,
  FALLBACK_LABEL_COLOR: () => FALLBACK_LABEL_COLOR,
  LABEL_COLOR_PRESETS: () => LABEL_COLOR_PRESETS,
  LabelManagerModal: () => LabelManagerModal,
  SDK_VERSION: () => SDK_VERSION,
  STORAGE_KEYS: () => STORAGE_KEYS,
  SettingsPopover: () => SettingsPopover,
  SpecBridgeAnnotation: () => SpecBridgeAnnotation,
  httpAdapter: () => httpAdapter,
  localStorageAdapter: () => localStorageAdapter,
  useAnnotations: () => useAnnotations,
  useAuthor: () => useAuthor,
  useLabels: () => useLabels,
  useSettings: () => useSettings,
  whoami: () => whoami
});
module.exports = __toCommonJS(src_exports);

// src/SpecBridgeAnnotation.tsx
var import_react16 = require("react");

// node_modules/.pnpm/fflate@0.8.3/node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var wbits = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
};
var wbits16 = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t = [];
  for (var i = 0; i < d.length; ++i) {
    if (d[i])
      t.push({ s: i, f: d[i] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym)
      maxSym = t2[i].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i < s; ++i) {
      var i2_1 = t2[i].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i;
    }
    for (; i >= 0 && dt; --i) {
      var i2_3 = t2[i].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
};
var lc = function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
};
var clen = function(cf, cl) {
  var l = 0;
  for (var i = 0; i < cl.length; ++i)
    l += cf[i] * cl[i];
  return l;
};
var wfblk = function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i = 0; i < s; ++i)
    out[o + i + 4] = dat[i];
  return (o + 4 + s) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i = 0; i < lclt.length; ++i)
    ++lcfreq[lclt[i] & 31];
  for (var i = 0; i < lcdt.length; ++i)
    ++lcfreq[lcdt[i] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i = 0; i < nlcc; ++i)
      wbits(out, p + 3 * i, lct[clim[i]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i] >> 5 & 127), p += clct[i] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i = 0; i < li; ++i) {
    var sym = syms[i];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i2) {
      return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i + 2 < s; ++i) {
      var hv = hsh(i);
      var imod = i & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i) {
        var rem = s - i;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }
    for (i = Math.max(i, wi); i < s; ++i) {
      syms[li++] = dat[i];
      ++lf[dat[i]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i, st.w = wi;
    }
  } else {
    for (var i = st.w || 0; i < s + lst; i += 65535) {
      var e = i + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i = 0; i < 256; ++i) {
    var c = i, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i] = c;
  }
  return t;
})();
var crc = function() {
  var c = -1;
  return {
    p: function(d) {
      var cr = c;
      for (var i = 0; i < d.length; ++i)
        cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;
      c = cr;
    },
    d: function() {
      return ~c;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
};
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
var fltn = function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i = 0; i < str.length; ++i)
      ar_1[i] = str.charCodeAt(i);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
};
var wzh = function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
};
var wzf = function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}

// src/analytics.ts
var GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
var MEASUREMENT_ID = "G-64Z1HHSLK0";
var API_SECRET = "tb0d3RSUTpaHJxHi1eo79w";
var CID_KEY = "sb_ga_cid";
var _serviceId;
function setServiceId(id) {
  _serviceId = id;
}
function getClientId() {
  try {
    let cid = localStorage.getItem(CID_KEY);
    if (!cid) {
      cid = `${Math.random().toString(36).slice(2, 10)}.${Date.now()}`;
      localStorage.setItem(CID_KEY, cid);
    }
    return cid;
  } catch {
    return `anon.${Date.now()}`;
  }
}
function trackEvent(name, params = {}) {
  try {
    const enriched = _serviceId ? { service_id: _serviceId, ...params } : params;
    const g = window.gtag;
    if (typeof g === "function") {
      g("event", name, enriched);
      return;
    }
    fetch(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
      method: "POST",
      body: JSON.stringify({
        client_id: getClientId(),
        events: [{ name, params: enriched }]
      }),
      keepalive: true
    }).catch(() => {
    });
  } catch {
  }
}

// src/constants.ts
var STORAGE_KEYS = {
  annotations: "cs_annot_v4",
  author: "cs_annot_author",
  labels: "cs_annot_labels_v3",
  lastLabel: "cs_annot_last_label_v1",
  defaultLabel: "cs_annot_author_default_label",
  sessions: "cs_annot_sessions_v1",
  currentSession: "cs_annot_current_session"
};
var COLORS = {
  pri: "#3B82F6",
  priL: "#EFF6FF",
  priD: "#2563EB",
  side: "#111827",
  white: "#fff",
  bg: "#f3f4f6",
  brd: "#e5e7eb",
  txt: "#1f2937",
  txS: "#6b7280",
  txL: "#9ca3af",
  red: "#dc2626",
  redL: "#fef2f2",
  green: "#16a34a",
  greenL: "#f0fdf4",
  amber: "#d97706",
  amberL: "#fffbeb",
  indigo: "#3B82F6",
  indigoL: "#EFF6FF",
  slate: "#1e293b"
};
var DEFAULT_LABELS = [
  { id: "lbl-plan", name: "\uAE30\uD68D", color: "#60A5FA" },
  { id: "lbl-design", name: "\uB514\uC790\uC778", color: "#F472B6" },
  { id: "lbl-dev", name: "\uAC1C\uBC1C", color: "#34D399" },
  { id: "lbl-qa", name: "QA", color: "#A78BFA" }
];
var FALLBACK_LABEL_COLOR = "#9ca3af";
var DARK = {
  bg: "#0E0E0E",
  bg2: "#121212",
  bg3: "#202020",
  brd: "rgba(255,255,255,.09)",
  brd2: "rgba(255,255,255,.15)",
  txt: "rgba(255,255,255,.88)",
  txS: "rgba(255,255,255,.5)",
  txL: "rgba(255,255,255,.3)"
};
var FONT_FAMILY = "'Pretendard Variable', Pretendard, system-ui, sans-serif";
var LABEL_COLOR_PRESETS = [
  "#d97706",
  // amber
  "#dc2626",
  // red
  "#2563eb",
  // blue
  "#16a34a",
  // green
  "#7c3aed",
  // violet
  "#db2777",
  // pink
  "#0891b2",
  // cyan
  "#6b7280"
  // gray
];
var SESSION_STATUS_CONFIG = {
  active: { label: "\uC9C4\uD589\uC911", color: "#60a5fa", bg: "rgba(96,165,250,.18)", border: "rgba(96,165,250,.45)" },
  done: { label: "\uAC80\uD1A0\uC644\uB8CC", color: "#4ade80", bg: "rgba(74,222,128,.18)", border: "rgba(74,222,128,.45)" },
  pending: { label: "\uC218\uC815\uB300\uAE30", color: "#fbbf24", bg: "rgba(251,191,36,.18)", border: "rgba(251,191,36,.45)" }
};
var SESSION_VIEWPORT_CONFIG = {
  desktop: { label: "Desktop", icon: "\u{1F5A5}" },
  tablet: { label: "Tablet", icon: "\u{1F4DF}" },
  mobile: { label: "Mobile", icon: "\u{1F4F1}" }
};

// src/icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function IconChat({ size = 12, color = "currentColor", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "path",
        {
          d: "M13.5 2H2.5C1.95 2 1.5 2.45 1.5 3V10C1.5 10.55 1.95 11 2.5 11H5.5L8 14L10.5 11H13.5C14.05 11 14.5 10.55 14.5 10V3C14.5 2.45 14.05 2 13.5 2Z",
          stroke: color,
          strokeWidth: "1.4",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function IconPin({ size = 12, color = "currentColor", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "5", r: "3", stroke: color, strokeWidth: "1.4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 8V13", stroke: color, strokeWidth: "1.4", strokeLinecap: "round" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 13H10.5", stroke: color, strokeWidth: "1.4", strokeLinecap: "round" })
      ]
    }
  );
}
function IconDocument({ size = 12, color = "currentColor", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle", ...style },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "1.5", width: "10", height: "13", rx: "1.5", stroke: color, strokeWidth: "1.4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 5.5H10.5M5.5 8.5H10.5M5.5 11.5H8.5", stroke: color, strokeWidth: "1.4", strokeLinecap: "round" })
      ]
    }
  );
}

// src/AnnotPanel.tsx
var import_react = require("react");

// src/Markdown.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function getMentionColor(name) {
  const palette = ["#D97757", "#B85E3F", "#E8956D", "#C75B39", "#A0522D", "#CF7A5A", "#E8A87C", "#8B4513"];
  let h = 0;
  for (const ch of name) h = h * 31 + ch.charCodeAt(0) & 255;
  return palette[h % palette.length];
}
var COLOR_MAP = {
  red: "#ef4444",
  green: "#34D399",
  blue: "#60A5FA",
  yellow: "#FCD34D",
  orange: "#FB923C",
  purple: "#A78BFA",
  pink: "#F472B6",
  gray: "#9CA3AF"
};
function parseInline(text, theme) {
  const codeStyle = theme === "dark" ? { background: "rgba(255,255,255,.13)", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: "0.88em" } : { background: "rgba(0,0,0,.07)", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: "0.88em" };
  const parts = [];
  let i = 0;
  let buf = "";
  let keyN = 0;
  const flush = () => {
    if (buf) {
      parts.push(buf);
      buf = "";
    }
  };
  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: text.slice(i + 2, end) }, keyN++));
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("em", { children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "_" && text[i + 1] === "_") {
      const end = text.indexOf("__", i + 2);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: text.slice(i + 2, end) }, keyN++));
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "_" && text[i + 1] !== "_") {
      const end = text.indexOf("_", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("em", { children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { style: codeStyle, children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "{") {
      const colon = text.indexOf(":", i + 1);
      const close = text.indexOf("}", i + 1);
      if (colon !== -1 && close !== -1 && colon < close) {
        const colorKey = text.slice(i + 1, colon).trim();
        const colorVal = COLOR_MAP[colorKey] ?? (colorKey.startsWith("#") ? colorKey : null);
        if (colorVal) {
          flush();
          parts.push(
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: colorVal }, children: text.slice(colon + 1, close) }, keyN++)
          );
          i = close + 1;
          continue;
        }
      }
    }
    if (text[i] === "@") {
      const nameMatch = text.slice(i + 1).match(/^[\w가-힣가-힣]+/);
      if (nameMatch) {
        flush();
        const name = nameMatch[0];
        const c = getMentionColor(name);
        parts.push(
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "1px 6px",
            borderRadius: 3,
            fontSize: "0.9em",
            fontWeight: 600,
            background: `${c}22`,
            color: c,
            border: `1px solid ${c}44`,
            whiteSpace: "nowrap"
          }, children: [
            "@",
            name
          ] }, keyN++)
        );
        i += 1 + name.length;
        continue;
      }
    }
    if (text[i] === "[") {
      const cb = text.indexOf("]", i + 1);
      if (cb !== -1 && text[cb + 1] === "(") {
        const cp = text.indexOf(")", cb + 2);
        if (cp !== -1) {
          flush();
          parts.push(
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "a",
              {
                href: text.slice(cb + 2, cp),
                target: "_blank",
                rel: "noopener noreferrer",
                style: { color: "inherit", textDecoration: "underline" },
                children: text.slice(i + 1, cb)
              },
              keyN++
            )
          );
          i = cp + 1;
          continue;
        }
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return parts.length === 1 ? parts[0] : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: parts });
}
function Markdown({ children, theme = "light", style }) {
  const isDark = theme === "dark";
  const t = theme;
  const codeBlockStyle = {
    display: "block",
    background: isDark ? "rgba(0,0,0,.3)" : "#f3f4f6",
    color: isDark ? "#e2e8f0" : "#374151",
    padding: "8px 10px",
    borderRadius: 6,
    fontFamily: "monospace",
    fontSize: "0.85em",
    whiteSpace: "pre",
    overflowX: "auto",
    margin: "4px 0"
  };
  const blockquoteStyle = {
    borderLeft: `3px solid ${isDark ? "rgba(255,255,255,.28)" : "#d1d5db"}`,
    margin: "3px 0",
    paddingLeft: 10,
    color: isDark ? "rgba(255,255,255,.48)" : "#6b7280",
    fontStyle: "italic"
  };
  const hrStyle = {
    border: "none",
    borderTop: `1px solid ${isDark ? "rgba(255,255,255,.18)" : "#e5e7eb"}`,
    margin: "8px 0"
  };
  const lines = children.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: codeBlockStyle, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { children: codeLines.join("\n") }) }, `cb${i}`)
      );
      i++;
      continue;
    }
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", { style: hrStyle }, `hr${i}`));
      i++;
      continue;
    }
    const hm = line.match(/^(#{1,3})\s+(.+)/);
    if (hm) {
      const level = hm[1].length;
      const sizes = [17, 14, 13];
      const marginTops = [8, 6, 4];
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: sizes[level - 1], fontWeight: 700, margin: `${marginTops[level - 1]}px 0 2px`, lineHeight: 1.3 }, children: parseInline(hm[2], t) }, `h${i}`)
      );
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const text = line.replace(/^>\s?/, "");
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: blockquoteStyle, children: parseInline(text, t) }, `bq${i}`));
      i++;
      continue;
    }
    if (/^(\s*)[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\s*)[-*]\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)[-*]\s+(.+)/);
        if (m) items.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { style: { marginBottom: 1 }, children: parseInline(m[2], t) }, `li${i}`));
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { style: { margin: "3px 0", paddingLeft: 18, lineHeight: 1.6, listStyle: "disc" }, children: items }, `ul${i}`)
      );
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const m = lines[i].match(/^\d+\.\s+(.+)/);
        if (m) items.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { style: { marginBottom: 1 }, children: parseInline(m[1], t) }, `li${i}`));
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ol", { style: { margin: "3px 0", paddingLeft: 18, lineHeight: 1.6, listStyle: "decimal" }, children: items }, `ol${i}`)
      );
      continue;
    }
    if (line.trim() === "") {
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: 6 } }, `sp${i}`));
      i++;
      continue;
    }
    elements.push(
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { lineHeight: 1.65 }, children: parseInline(line, t) }, `p${i}`)
    );
    i++;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style, children: elements });
}

// src/AnnotPanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var PANEL_W_SINGLE = 400;
var PANEL_W_DOUBLE = 680;
var LEFT_COL_W = 360;
var PIN_W = 26;
var OFFSET = 14;
var EDGE_MARGIN = 10;
var TOOLBAR_RESERVE = 72;
var fmtTime = (iso) => new Date(iso).toLocaleString("ko-KR", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});
function AnnotPanel({
  pins,
  selectedId,
  anchor,
  labels,
  currentAuthor,
  leftBound = 0,
  rightBound = 0,
  onClose,
  onUpdate,
  onDelete,
  onManageLabels,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onResolve,
  onReopen
}) {
  const pin = pins.find((p) => p.id === selectedId);
  const num = pin?.num ?? 0;
  const [panelMode, setPanelMode] = (0, import_react.useState)("view");
  const [showThreadTooltip, setShowThreadTooltip] = (0, import_react.useState)(false);
  const [showMoreMenu, setShowMoreMenu] = (0, import_react.useState)(false);
  const [note, setNote] = (0, import_react.useState)("");
  const [noteMode, setNoteMode] = (0, import_react.useState)("write");
  const [saved, setSaved] = (0, import_react.useState)(false);
  const [newComment, setNewComment] = (0, import_react.useState)("");
  const [threadOpen, setThreadOpen] = (0, import_react.useState)(false);
  const [mentionQuery, setMentionQuery] = (0, import_react.useState)("");
  const [showMention, setShowMention] = (0, import_react.useState)(false);
  const [mentionStart, setMentionStart] = (0, import_react.useState)(0);
  const [mentionIndex, setMentionIndex] = (0, import_react.useState)(0);
  const [pos, setPos] = (0, import_react.useState)(null);
  const noteRef = (0, import_react.useRef)(null);
  const commentInputRef = (0, import_react.useRef)(null);
  const panelRef = (0, import_react.useRef)(null);
  const commentsEndRef = (0, import_react.useRef)(null);
  const moreMenuRef = (0, import_react.useRef)(null);
  const hasComments = (pin?.comments.length ?? 0) > 0;
  const showThread = threadOpen && panelMode === "view";
  const panelWidth = showThread ? PANEL_W_DOUBLE : PANEL_W_SINGLE;
  (0, import_react.useEffect)(() => {
    if (!pin) return;
    const mode = (pin.note ?? "").length > 0 ? "view" : "edit";
    setPanelMode(mode);
    setNote(pin.note ?? "");
    setSaved(false);
    setNewComment("");
    setThreadOpen((pin?.comments.length ?? 0) > 0);
    setNoteMode("write");
  }, [selectedId]);
  (0, import_react.useEffect)(() => {
    if (panelMode === "edit" && noteMode === "write") {
      const id = window.setTimeout(() => noteRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [panelMode, noteMode]);
  (0, import_react.useEffect)(() => {
    if (threadOpen) {
      const id = window.setTimeout(() => commentInputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [threadOpen]);
  (0, import_react.useEffect)(() => {
    if (showThread) {
      commentsEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [pin?.comments.length, showThread]);
  (0, import_react.useEffect)(() => {
    if (!showMoreMenu) return;
    const onDown = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showMoreMenu]);
  (0, import_react.useEffect)(() => {
    const onKey = (e) => {
      const t = e.target;
      const inInput = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        if (showMoreMenu) {
          setShowMoreMenu(false);
          return;
        }
        if (panelMode === "edit") {
          setNote(pin?.note ?? "");
          setPanelMode("view");
          return;
        }
        if (inInput) return;
        onClose();
        return;
      }
      if (inInput) return;
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        setPanelMode("edit");
        setNoteMode("write");
        return;
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setThreadOpen((v) => !v);
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        if (!pin) return;
        if (pin.status === "resolved") onReopen(pin.id);
        else onResolve(pin.id);
        return;
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (!pin) return;
        if (window.confirm("\uC774 \uC5B4\uB178\uD14C\uC774\uC158\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete(pin.id);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onDelete, onReopen, onResolve, panelMode, pin, showMoreMenu]);
  (0, import_react.useLayoutEffect)(() => {
    const compute = () => {
      const panelH = panelRef.current?.getBoundingClientRect().height ?? 480;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minLeft = Math.max(EDGE_MARGIN, leftBound + EDGE_MARGIN);
      const maxRight = vw - rightBound - EDGE_MARGIN;
      let left = anchor.x + PIN_W + OFFSET;
      let side = "right";
      if (left + panelWidth > maxRight) {
        left = anchor.x - OFFSET - panelWidth;
        side = "left";
      }
      if (left < minLeft) {
        left = minLeft;
        side = "right";
      }
      left = Math.max(minLeft, Math.min(left, maxRight - panelWidth));
      let top = anchor.y - 8;
      const maxTop = vh - TOOLBAR_RESERVE - panelH;
      if (top > maxTop) top = maxTop;
      top = Math.max(EDGE_MARGIN, top);
      setPos({ left, top, side });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [anchor.x, anchor.y, selectedId, leftBound, panelWidth]);
  if (!pin) return null;
  const currentLabel = labels.find((l) => l.id === pin.labelId);
  const headerColor = currentLabel?.color ?? FALLBACK_LABEL_COLOR;
  const isResolved = pin.status === "resolved";
  const noteChanged = note !== (pin.note ?? "");
  const handleSaveNote = () => {
    if (!noteChanged && !(!pin.note && note)) return;
    onUpdate(pin.id, { note });
    setSaved(true);
    setPanelMode("view");
    window.setTimeout(() => setSaved(false), 2e3);
  };
  const handleSelectLabel = (labelId) => {
    onUpdate(pin.id, { labelId });
  };
  const allAuthors = (0, import_react.useMemo)(() => {
    const set = /* @__PURE__ */ new Set();
    for (const p of pins) {
      if (p.author) set.add(p.author);
      for (const c of p.comments) if (c.author) set.add(c.author);
    }
    return Array.from(set);
  }, [pins]);
  const filteredMentions = (0, import_react.useMemo)(() => {
    if (!showMention) return [];
    if (!mentionQuery) return allAuthors;
    const q = mentionQuery.toLowerCase();
    return allAuthors.filter((a) => a.toLowerCase().includes(q));
  }, [showMention, mentionQuery, allAuthors]);
  const handleSelectMention = (author) => {
    const before = newComment.slice(0, mentionStart);
    const after = newComment.slice(mentionStart + 1 + mentionQuery.length);
    const inserted = `${before}@${author} ${after}`;
    setNewComment(inserted);
    setShowMention(false);
    setMentionIndex(0);
    const newCursor = mentionStart + 1 + author.length + 1;
    setTimeout(() => {
      const el = commentInputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };
  const handleCommentChange = (e) => {
    const val = e.target.value;
    setNewComment(val);
    const cursor = e.target.selectionStart ?? val.length;
    const m = val.slice(0, cursor).match(/@([^\s@]*)$/);
    if (m) {
      setMentionQuery(m[1]);
      setMentionStart(cursor - m[0].length);
      setShowMention(true);
      setMentionIndex(0);
    } else {
      setShowMention(false);
    }
  };
  const handleSubmitComment = () => {
    const t = newComment.trim();
    if (!t || !currentAuthor) return;
    onAddComment(pin.id, t);
    setNewComment("");
    setShowMention(false);
  };
  const closeBtnStyle = {
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    color: "rgba(255,255,255,.45)",
    width: 22,
    height: 22,
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };
  const inp = {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${DARK.brd}`,
    borderRadius: 7,
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: DARK.bg3,
    color: DARK.txt
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      ref: panelRef,
      style: {
        position: "fixed",
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        width: panelWidth,
        minHeight: 500,
        maxHeight: `calc(100vh - ${TOOLBAR_RESERVE + EDGE_MARGIN}px)`,
        zIndex: 1e4,
        background: "#1A1A1A",
        borderRadius: 14,
        border: `1px solid ${DARK.brd2}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 18px 48px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.15)",
        animation: "specbridgeAnnotIn .16s ease",
        visibility: pos ? "visible" : "hidden",
        transformOrigin: pos?.side === "left" ? "right top" : "left top"
      },
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("style", { children: `
        @keyframes specbridgeAnnotIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
        .sb-scroll::-webkit-scrollbar{width:4px;height:4px}
        .sb-scroll::-webkit-scrollbar-track{background:transparent}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:10px}
        .sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26)}
        .sb-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
        .sb-md-editor{caret-color:#fff}
        .sb-md-editor h1{font-size:15px;font-weight:700;margin:3px 0;color:rgba(255,255,255,.92);line-height:1.4}
        .sb-md-editor h2{font-size:13px;font-weight:700;margin:2px 0;color:rgba(255,255,255,.85)}
        .sb-md-editor li{display:list-item;list-style:disc;margin-left:18px;padding:1px 0}
        .sb-md-editor p{margin:0;padding:1px 0;min-height:1.2em}
        .sb-md-editor strong{font-weight:700;color:rgba(255,255,255,.9)}
        .sb-md-editor em{font-style:italic;color:rgba(255,255,255,.8)}
        .sb-md-editor code{font-family:monospace;background:rgba(255,255,255,.1);padding:1px 4px;border-radius:3px;font-size:11px;color:#86efac}
        .sb-md-editor:empty::before{content:attr(data-placeholder);color:rgba(255,255,255,.25);pointer-events:none;white-space:pre-line}
      ` }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            style: {
              padding: "12px 14px",
              color: COLORS.white,
              background: "rgba(0,0,0,.18)",
              borderRadius: "14px 14px 0 0",
              borderBottom: `1px solid ${DARK.brd}`,
              flexShrink: 0
            },
            children: panelMode === "view" ? (
              /* 상세보기 헤더: [번호원형] [작성자 · 날짜] [상태] spacer [...] [×] */
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "div",
                  {
                    style: {
                      width: 16,
                      height: 16,
                      borderRadius: 5,
                      background: headerColor,
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: num
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: DARK.txt, whiteSpace: "nowrap", flexShrink: 0 }, children: (() => {
                  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(pin.author);
                  const limit = hasKorean ? 5 : 10;
                  return pin.author.length > limit ? pin.author.slice(0, limit) + "\u2026" : pin.author;
                })() }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL, flexShrink: 0, whiteSpace: "nowrap", paddingTop: 4 }, children: fmtTime(pin.createdAt) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1, minWidth: 0 } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative", flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                      "button",
                      {
                        onClick: () => setThreadOpen((v) => !v),
                        onMouseEnter: () => setShowThreadTooltip(true),
                        onMouseLeave: () => setShowThreadTooltip(false),
                        style: {
                          ...closeBtnStyle,
                          width: hasComments ? "auto" : 22,
                          padding: hasComments ? "0 6px" : 0,
                          gap: 4,
                          background: threadOpen ? "rgba(59,130,246,.22)" : "transparent",
                          color: threadOpen ? "#93C5FD" : "rgba(255,255,255,.45)",
                          borderRadius: 6
                        },
                        title: "\uC2A4\uB808\uB4DC (M)",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M13 1H3C2.45 1 2 1.45 2 2v8c0 .55.45 1 1 1h2.5l2.5 3 2.5-3H13c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z", fill: "currentColor" }) }),
                          hasComments && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, fontWeight: 700, lineHeight: 1 }, children: pin.comments.length })
                        ]
                      }
                    ),
                    showThreadTooltip && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6, background: "rgba(15,23,42,.95)", color: "rgba(255,255,255,.85)", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap", pointerEvents: "none", border: "1px solid rgba(255,255,255,.1)" }, children: "\uC2A4\uB808\uB4DC" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { ref: moreMenuRef, style: { position: "relative", flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: () => setShowMoreMenu((v) => !v),
                        style: { ...closeBtnStyle, fontSize: 16, letterSpacing: 1, background: showMoreMenu ? "rgba(255,255,255,.09)" : "transparent" },
                        title: "\uB354\uBCF4\uAE30",
                        children: "\xB7\xB7\xB7"
                      }
                    ),
                    showMoreMenu && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "absolute", top: "calc(100% + 4px)", right: 0, background: DARK.bg3, border: `1px solid ${DARK.brd2}`, borderRadius: 9, padding: 4, zIndex: 10001, minWidth: 130, boxShadow: "0 8px 28px rgba(0,0,0,.45)" }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: isResolved ? "\u21BA" : "\u2713",
                          label: isResolved ? "\uBBF8\uD574\uACB0\uB85C \uBCC0\uACBD" : "\uD574\uACB0\uD558\uAE30",
                          shortcut: "C",
                          color: isResolved ? "#4ade80" : void 0,
                          onClick: () => {
                            isResolved ? onReopen(pin.id) : onResolve(pin.id);
                            setShowMoreMenu(false);
                          }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: "\u270F",
                          label: "\uC218\uC815\uD558\uAE30",
                          shortcut: "E",
                          onClick: () => {
                            setPanelMode("edit");
                            setNoteMode("write");
                            setShowMoreMenu(false);
                          }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.08)", margin: "3px 6px" } }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: "\u{1F5D1}",
                          label: "\uC0AD\uC81C",
                          shortcut: "D",
                          color: "#f87171",
                          onClick: () => {
                            setShowMoreMenu(false);
                            if (window.confirm("\uC774 \uC5B4\uB178\uD14C\uC774\uC158\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete(pin.id);
                          }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 1, height: 14, background: DARK.brd2, flexShrink: 0, margin: "0 2px" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: onClose, style: closeBtnStyle, title: "\uB2EB\uAE30 (ESC)", children: "\xD7" })
                ] })
              ] })
            ) : (
              /* 수정 헤더: [#N] [작성/수정하기] spacer [작성자·날짜] [×] */
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "div",
                  {
                    style: {
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: headerColor,
                      color: COLORS.white,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: num
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13, fontWeight: 700 }, children: (pin.note ?? "").length > 0 ? "\uC218\uC815\uD558\uAE30" : "\uC791\uC131\uD558\uAE30" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1 } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontSize: 9, color: DARK.txL }, children: [
                  pin.author,
                  " \xB7 ",
                  fmtTime(pin.createdAt)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: onClose, style: closeBtnStyle, children: "\xD7" })
              ] })
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", minHeight: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              style: {
                width: showThread ? LEFT_COL_W : "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                flexShrink: 0
              },
              children: panelMode === "view" ? (
                /* ── 상세보기 ── */
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "16px 18px" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusBadge, { resolved: isResolved, resolvedBy: pin.resolvedBy, resolvedAt: pin.resolvedAt }),
                  (pin.note ?? "").length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Markdown, { theme: "dark", style: { fontSize: 13, color: DARK.txt, lineHeight: 1.75 }, children: pin.note }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { color: DARK.txL, fontSize: 12, textAlign: "center", padding: "28px 0" }, children: [
                    "\uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {}),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: () => {
                          setPanelMode("edit");
                          setNoteMode("write");
                        },
                        style: { marginTop: 10, fontSize: 12, color: COLORS.pri, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },
                        children: "\uB0B4\uC6A9 \uC791\uC131\uD558\uAE30"
                      }
                    )
                  ] })
                ] }) })
              ) : (
                /* ── 작성/수정하기 ── */
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "12px 14px", gap: 10 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }, children: [
                    labels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 11, color: DARK.txL }, children: "\uB4F1\uB85D\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : labels.map((l) => {
                      const selected = pin.labelId === l.id;
                      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                        "button",
                        {
                          onClick: () => handleSelectLabel(selected ? null : l.id),
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 10px",
                            height: 20,
                            borderRadius: 1,
                            border: `1px solid ${selected ? `${l.color}99` : "rgba(255,255,255,.15)"}`,
                            background: selected ? `${l.color}22` : "transparent",
                            color: selected ? l.color : "rgba(255,255,255,.45)",
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all .15s",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            fontFamily: "inherit"
                          },
                          onMouseEnter: (e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = `${l.color}66`;
                              e.currentTarget.style.color = l.color;
                            }
                          },
                          onMouseLeave: (e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                              e.currentTarget.style.color = "rgba(255,255,255,.45)";
                            }
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { width: 5, height: 5, borderRadius: "50%", background: selected ? l.color : "rgba(255,255,255,.3)", flexShrink: 0 } }),
                            l.name
                          ]
                        },
                        l.id
                      );
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1 } }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: onManageLabels,
                        style: {
                          fontSize: 10,
                          padding: "2px 8px",
                          border: `1px solid ${DARK.brd}`,
                          borderRadius: 5,
                          background: DARK.bg3,
                          color: DARK.txS,
                          cursor: "pointer",
                          flexShrink: 0
                        },
                        children: "\uAD00\uB9AC"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, position: "relative", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      MarkdownEditor,
                      {
                        editorRef: noteRef,
                        value: note,
                        onChange: setNote,
                        onCtrlEnter: handleSaveNote,
                        mentionUsers: allAuthors,
                        placeholder: "\uAE30\uB2A5 \uC815\uCC45, \uC694\uAD6C\uC0AC\uD56D, \uC0AC\uC591 \uB4F1\uC744 \uC791\uC131\uD558\uC138\uC694.\n\n**\uAD75\uAC8C**, *\uAE30\uC6B8\uC784*, `\uCF54\uB4DC`\n# \uC81C\uBAA9, - \uBAA9\uB85D, > \uC778\uC6A9",
                        className: "sb-scroll sb-md-editor",
                        style: { ...inp, flex: 1, lineHeight: 1.65, minHeight: 0, paddingBottom: 32, overflowY: "auto", cursor: "text" }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: handleSaveNote,
                        disabled: !noteChanged,
                        style: {
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          padding: "3px 10px",
                          border: "none",
                          borderRadius: 2,
                          background: saved ? COLORS.green : noteChanged ? COLORS.pri : "rgba(255,255,255,.1)",
                          color: saved || noteChanged ? COLORS.white : DARK.txL,
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: noteChanged ? "pointer" : "default",
                          transition: "background .2s"
                        },
                        children: saved ? "\u2713 \uC800\uC7A5\uB428" : "\uC800\uC7A5"
                      }
                    )
                  ] })
                ] }) })
              )
            }
          ),
          showThread && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 1, background: DARK.brd, alignSelf: "stretch", flexShrink: 0 } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: DARK.bg }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { padding: "11px 14px 9px", borderBottom: `1px solid ${DARK.brd}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: DARK.txt }, children: "Comment" }),
                pin.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 10, color: DARK.txL, fontWeight: 500 }, children: pin.comments.length })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2 }, children: [
                pin.comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 11, color: DARK.txL, textAlign: "center", padding: "32px 0", opacity: 0.6 }, children: "\uC2A4\uB808\uB4DC\uB97C \uC2DC\uC791\uD574\uBCF4\uC138\uC694" }) : pin.comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  CommentItem,
                  {
                    comment: c,
                    canEdit: c.author === currentAuthor,
                    onUpdate: (text) => onUpdateComment(pin.id, c.id, text),
                    onDelete: () => onDeleteComment(pin.id, c.id)
                  },
                  c.id
                )),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref: commentsEndRef })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { padding: "8px 10px 10px", flexShrink: 0, borderTop: `1px solid ${DARK.brd}`, background: DARK.bg }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
                showMention && filteredMentions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "div",
                  {
                    className: "sb-scroll",
                    style: {
                      position: "absolute",
                      bottom: "100%",
                      left: 0,
                      right: 0,
                      marginBottom: 4,
                      background: "#242424",
                      border: `1px solid ${DARK.brd2}`,
                      borderRadius: 8,
                      boxShadow: "0 4px 16px rgba(0,0,0,.5)",
                      maxHeight: 160,
                      overflowY: "auto",
                      zIndex: 10002
                    },
                    children: filteredMentions.map((author, idx) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                      "button",
                      {
                        onMouseDown: (e) => {
                          e.preventDefault();
                          handleSelectMention(author);
                        },
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          width: "100%",
                          padding: "7px 10px",
                          background: idx === mentionIndex ? "rgba(255,255,255,.08)" : "transparent",
                          border: "none",
                          color: DARK.txt,
                          fontSize: 12,
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit",
                          boxSizing: "border-box"
                        },
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            background: `${getAvatarColor(author)}22`,
                            color: getAvatarColor(author),
                            border: `1px solid ${getAvatarColor(author)}44`,
                            flexShrink: 0
                          }, children: author[0]?.toUpperCase() }),
                          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: author })
                        ]
                      },
                      author
                    ))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "textarea",
                  {
                    ref: commentInputRef,
                    className: "sb-scroll",
                    value: newComment,
                    onChange: handleCommentChange,
                    onKeyDown: (e) => {
                      if (showMention && filteredMentions.length > 0) {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setMentionIndex((i) => Math.min(i + 1, filteredMentions.length - 1));
                          return;
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setMentionIndex((i) => Math.max(i - 1, 0));
                          return;
                        }
                        if (e.key === "Enter" || e.key === "Tab") {
                          e.preventDefault();
                          handleSelectMention(filteredMentions[mentionIndex]);
                          return;
                        }
                        if (e.key === "Escape") {
                          setShowMention(false);
                          return;
                        }
                      }
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmitComment();
                      if (e.key === "Escape") onClose();
                    },
                    placeholder: currentAuthor ? "\uC2A4\uB808\uB4DC\uC5D0\uC11C \uD68C\uC2E0\u2026" : "\uBA3C\uC800 \uC791\uC131\uC790\uB97C \uB4F1\uB85D\uD558\uC138\uC694",
                    disabled: !currentAuthor,
                    rows: 2,
                    style: {
                      ...inp,
                      width: "100%",
                      resize: "none",
                      lineHeight: 1.6,
                      paddingTop: 6,
                      paddingBottom: 32,
                      borderRadius: 2,
                      boxSizing: "border-box"
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    onClick: handleSubmitComment,
                    disabled: !newComment.trim() || !currentAuthor,
                    style: {
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      padding: "3px 10px",
                      border: "none",
                      borderRadius: 2,
                      background: newComment.trim() && currentAuthor ? COLORS.pri : "rgba(255,255,255,.1)",
                      color: newComment.trim() && currentAuthor ? COLORS.white : DARK.txL,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: newComment.trim() && currentAuthor ? "pointer" : "default",
                      transition: "background .2s"
                    },
                    children: "\uC800\uC7A5"
                  }
                )
              ] }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function MoreMenuItem({
  icon,
  label,
  shortcut,
  color,
  onClick
}) {
  const [hov, setHov] = (0, import_react.useState)(false);
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    width: "100%",
    padding: "6px 10px",
    border: "none",
    borderRadius: 5,
    background: hov ? "rgba(255,255,255,.07)" : "transparent",
    color: color ?? "rgba(255,255,255,.78)",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "left",
    transition: "background .1s",
    fontFamily: "inherit",
    boxSizing: "border-box"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { style: base, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), onClick, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { width: 14, textAlign: "center", fontSize: 13 }, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { flex: 1 }, children: label }),
    shortcut && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.28)", fontFamily: "monospace", marginLeft: 4 }, children: shortcut })
  ] });
}
function StatusBadge({ resolved, resolvedBy, resolvedAt }) {
  if (!resolved) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "3px 10px",
        borderRadius: 2,
        fontSize: 10,
        fontWeight: 700,
        background: "rgba(22,163,74,.18)",
        color: "#86efac",
        border: "1px solid rgba(22,163,74,.35)",
        whiteSpace: "nowrap"
      },
      children: [
        "\u2713 \uD574\uACB0",
        resolvedBy ? ` - ${resolvedBy}` : "",
        resolvedAt ? ` \xB7 ${fmtTime(resolvedAt)}` : ""
      ]
    }
  ) });
}
function htmlTableToMd(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return "";
    const rows = Array.from(table.querySelectorAll("tr"));
    if (!rows.length) return "";
    const toRow = (cells) => "| " + cells.map((c) => (c.textContent ?? "").trim().replace(/\|/g, "\\|")).join(" | ") + " |";
    const headerCells = Array.from(rows[0].querySelectorAll("th,td"));
    const lines = [
      toRow(headerCells),
      "| " + headerCells.map(() => "---").join(" | ") + " |"
    ];
    for (let i = 1; i < rows.length; i++)
      lines.push(toRow(Array.from(rows[i].querySelectorAll("td,th"))));
    return lines.join("\n");
  } catch {
    return "";
  }
}
function mdToEditorHtml(md) {
  if (!md.trim()) return "";
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s) => {
    let h = esc(s);
    h = h.replace(/\{([^}:]+):([^}]*)\}/g, (match, key, text) => {
      const val = key.startsWith("#") ? key : null;
      return val ? `<span style="color:${val}" data-color="${val}">${text}</span>` : match;
    });
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
    h = h.replace(/`(.+?)`/g, "<code>$1</code>");
    h = h.replace(/@([\w가-힣]+)/g, (_, name) => {
      const c = getAvatarColor(name);
      return `<span data-mention="${name}" style="display:inline-flex;align-items:center;padding:1px 5px;border-radius:3px;font-size:.9em;font-weight:600;background:${c}22;color:${c};border:1px solid ${c}44;white-space:nowrap;contenteditable:false;">@${name}</span>`;
    });
    return h;
  };
  return md.split("\n").map((line) => {
    if (/^# /.test(line)) return `<h1>${inline(line.slice(2))}</h1>`;
    if (/^## /.test(line)) return `<h2>${inline(line.slice(3))}</h2>`;
    if (/^- /.test(line)) return `<li>${inline(line.slice(2))}</li>`;
    return `<p>${inline(line) || "<br>"}</p>`;
  }).join("");
}
function domToMd(root) {
  function inlineMd(node) {
    if (node.nodeType === Node.TEXT_NODE)
      return (node.textContent ?? "").replace(/\u200B/g, "");
    if (!(node instanceof HTMLElement)) return "";
    const inner = Array.from(node.childNodes).map(inlineMd).join("");
    switch (node.tagName.toLowerCase()) {
      case "strong":
      case "b":
        return `**${inner}**`;
      case "em":
      case "i":
        return `*${inner}*`;
      case "code":
        return `\`${inner}\``;
      case "br":
        return "";
      case "span": {
        const mention = node.getAttribute("data-mention");
        if (mention) return `@${mention}`;
        const c = node.getAttribute("data-color");
        return c ? `{${c}:${inner}}` : inner;
      }
      default:
        return inner;
    }
  }
  const lines = [];
  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = (child.textContent ?? "").replace(/\u200B/g, "");
      if (t.trim()) lines.push(t);
      continue;
    }
    if (!(child instanceof HTMLElement)) continue;
    const tag = child.tagName.toLowerCase();
    if (tag === "ul" || tag === "ol") {
      for (const li of Array.from(child.children)) lines.push(`- ${inlineMd(li)}`);
    } else if (tag === "li") {
      lines.push(`- ${inlineMd(child)}`);
    } else if (tag === "h1") {
      lines.push(`# ${inlineMd(child)}`);
    } else if (tag === "h2") {
      lines.push(`## ${inlineMd(child)}`);
    } else if (tag === "p" || tag === "div") {
      const t = inlineMd(child);
      lines.push(t);
    } else {
      const t = inlineMd(child);
      if (t) lines.push(t);
    }
  }
  return lines.join("\n");
}
var MD_PALETTE = ["#f87171", "#fb923c", "#fbbf24", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];
function MarkdownEditor({ value, onChange, onCtrlEnter, placeholder, style, className, editorRef, mentionUsers }) {
  const inner = (0, import_react.useRef)(null);
  const ref = editorRef ?? inner;
  const lastMd = (0, import_react.useRef)(null);
  const composing = (0, import_react.useRef)(false);
  const [hovColor, setHovColor] = (0, import_react.useState)(null);
  const [mentionQuery, setMentionQuery] = (0, import_react.useState)("");
  const [showMention, setShowMention] = (0, import_react.useState)(false);
  const [mentionIndex, setMentionIndex] = (0, import_react.useState)(0);
  const mentionAnchor = (0, import_react.useRef)(null);
  const filteredMentions = (0, import_react.useMemo)(() => {
    if (!showMention || !mentionUsers?.length) return [];
    if (!mentionQuery) return mentionUsers;
    const q = mentionQuery.toLowerCase();
    return mentionUsers.filter((a) => a.toLowerCase().includes(q));
  }, [showMention, mentionQuery, mentionUsers]);
  const detectMention = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      setShowMention(false);
      return;
    }
    const range = sel.getRangeAt(0);
    if (range.startContainer.nodeType !== Node.TEXT_NODE) {
      setShowMention(false);
      return;
    }
    const textNode = range.startContainer;
    const textBefore = textNode.textContent.slice(0, range.startOffset);
    const m = textBefore.match(/@([^\s@]*)$/);
    if (m) {
      mentionAnchor.current = { node: textNode, offset: range.startOffset - m[0].length };
      setMentionQuery(m[1]);
      setShowMention(true);
      setMentionIndex(0);
    } else {
      setShowMention(false);
      mentionAnchor.current = null;
    }
  };
  const handleSelectMention = (author) => {
    const anchor = mentionAnchor.current;
    if (!anchor) {
      setShowMention(false);
      return;
    }
    const { node, offset: atOffset } = anchor;
    const endOffset = atOffset + 1 + mentionQuery.length;
    const text = node.textContent ?? "";
    const c = getAvatarColor(author);
    const span = document.createElement("span");
    span.setAttribute("data-mention", author);
    span.setAttribute("contenteditable", "false");
    span.style.cssText = `display:inline-flex;align-items:center;padding:1px 5px;border-radius:3px;font-size:.9em;font-weight:600;background:${c}22;color:${c};border:1px solid ${c}44;white-space:nowrap;`;
    span.textContent = `@${author}`;
    const beforeNode = document.createTextNode(text.slice(0, atOffset));
    const afterNode = document.createTextNode("\xA0" + text.slice(endOffset));
    const parent = node.parentNode;
    parent.insertBefore(beforeNode, node);
    parent.insertBefore(span, node);
    parent.insertBefore(afterNode, node);
    parent.removeChild(node);
    const range = document.createRange();
    range.setStart(afterNode, 1);
    range.collapse(true);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    setShowMention(false);
    setMentionIndex(0);
    mentionAnchor.current = null;
    emit();
    ref.current?.focus();
  };
  (0, import_react.useEffect)(() => {
    const el = ref.current;
    if (!el || lastMd.current === value) return;
    lastMd.current = value;
    el.innerHTML = mdToEditorHtml(value);
  }, [value]);
  const emit = () => {
    const el = ref.current;
    if (!el) return;
    const md = domToMd(el);
    lastMd.current = md;
    onChange(md);
  };
  const getCaretBlock = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return null;
    let node = sel.getRangeAt(0).startContainer;
    while (node && node !== ref.current) {
      if (node instanceof HTMLElement && /^(P|H[1-6]|LI|DIV)$/.test(node.tagName)) return node;
      node = node.parentNode;
    }
    return null;
  };
  const transformBlock = (block, tag) => {
    const el = document.createElement(tag);
    el.innerHTML = "<br>";
    block.replaceWith(el);
    const r = document.createRange();
    r.setStart(el, 0);
    r.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    emit();
  };
  const tryInlineTransform = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return false;
    const range = sel.getRangeAt(0);
    if (!range.collapsed || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
    const textNode = range.startContainer;
    const before = textNode.textContent.slice(0, range.startOffset);
    const after = textNode.textContent.slice(range.startOffset);
    const patterns = [
      [/^(.*)\*\*([^*\n]+)\*\*$/, "strong"],
      [/^(.*[^*]|^)\*([^*\n]+)\*$/, "em"],
      [/^(.*)`([^`\n]+)`$/, "code"]
    ];
    for (const [re, tag] of patterns) {
      const m = before.match(re);
      if (!m) continue;
      const frag = document.createDocumentFragment();
      if (m[1]) frag.appendChild(document.createTextNode(m[1]));
      const el = document.createElement(tag);
      el.textContent = m[2];
      frag.appendChild(el);
      const cursorNode = document.createTextNode("\u200B");
      frag.appendChild(cursorNode);
      if (after) frag.appendChild(document.createTextNode(after));
      textNode.parentNode.replaceChild(frag, textNode);
      const r = document.createRange();
      r.setStart(cursorNode, 1);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      return true;
    }
    return false;
  };
  const applyColor = (color) => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const span = document.createElement("span");
    span.setAttribute("data-color", color);
    span.style.color = color;
    const fragment = range.extractContents();
    fragment.querySelectorAll("[data-color]").forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
    span.appendChild(fragment);
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
    emit();
    ref.current?.focus();
  };
  const clearColor = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const root = ref.current;
    if (range.collapsed) {
      let node = range.startContainer;
      while (node && node !== root) {
        if (node instanceof HTMLElement && node.hasAttribute("data-color")) {
          node.replaceWith(...Array.from(node.childNodes));
          emit();
          return;
        }
        node = node.parentNode;
      }
      return;
    }
    const fragment = range.extractContents();
    fragment.querySelectorAll("[data-color]").forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
    range.insertNode(fragment);
    emit();
    ref.current?.focus();
  };
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onCtrlEnter?.();
      return;
    }
    if (composing.current) return;
    if (showMention && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => Math.min(i + 1, filteredMentions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectMention(filteredMentions[mentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowMention(false);
        return;
      }
    }
    if (e.key === " ") {
      const block = getCaretBlock();
      const text = (block?.textContent ?? "").replace(/\u200B/g, "").trim();
      if (text === "#") {
        e.preventDefault();
        transformBlock(block, "h1");
        return;
      }
      if (text === "##") {
        e.preventDefault();
        transformBlock(block, "h2");
        return;
      }
      if (text === "-" || text === "*") {
        e.preventDefault();
        transformBlock(block, "li");
        return;
      }
      if (tryInlineTransform()) {
        e.preventDefault();
        emit();
        return;
      }
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertParagraph");
      emit();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      const block = getCaretBlock();
      if (block?.tagName.toLowerCase() === "li" && !block.textContent?.replace(/\u200B/g, "").trim()) {
        e.preventDefault();
        transformBlock(block, "p");
      }
    }
  };
  const handlePaste = (e) => {
    const html = e.clipboardData.getData("text/html");
    if (html?.includes("<table")) {
      e.preventDefault();
      const md = htmlTableToMd(html);
      if (md) document.execCommand("insertText", false, md);
      emit();
      return;
    }
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      emit();
    }
  };
  const { overflowY, cursor, paddingBottom, lineHeight, padding: _padding, ...wrapperStyle } = style ?? {};
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", ...wrapperStyle, position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 8px 4px",
      borderBottom: "1px solid rgba(255,255,255,.08)",
      flexShrink: 0
    }, children: [
      MD_PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          title: c,
          onMouseDown: (e) => {
            e.preventDefault();
            applyColor(c);
          },
          onMouseEnter: () => setHovColor(c),
          onMouseLeave: () => setHovColor(null),
          style: {
            width: hovColor === c ? 14 : 11,
            height: hovColor === c ? 14 : 11,
            borderRadius: "50%",
            background: c,
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "width .12s, height .12s"
          }
        },
        c
      )),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          title: "\uC0C9\uC0C1 \uC81C\uAC70",
          onMouseDown: (e) => {
            e.preventDefault();
            clearColor();
          },
          onMouseEnter: () => setHovColor("clear"),
          onMouseLeave: () => setHovColor(null),
          style: {
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "transparent",
            border: `1px solid ${hovColor === "clear" ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)"}`,
            color: hovColor === "clear" ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.3)",
            cursor: "pointer",
            padding: 0,
            fontSize: 9,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color .12s, color .12s"
          },
          children: "\u2715"
        }
      )
    ] }),
    showMention && filteredMentions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: "sb-scroll",
        style: {
          position: "absolute",
          bottom: "100%",
          left: 0,
          right: 0,
          marginBottom: 4,
          background: "#242424",
          border: `1px solid ${DARK.brd2}`,
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,.5)",
          maxHeight: 160,
          overflowY: "auto",
          zIndex: 10003
        },
        children: filteredMentions.map((author, idx) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            onMouseDown: (e) => {
              e.preventDefault();
              handleSelectMention(author);
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "7px 10px",
              background: idx === mentionIndex ? "rgba(255,255,255,.08)" : "transparent",
              border: "none",
              color: DARK.txt,
              fontSize: 12,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
                background: `${getAvatarColor(author)}22`,
                color: getAvatarColor(author),
                border: `1px solid ${getAvatarColor(author)}44`
              }, children: author[0]?.toUpperCase() }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: author })
            ]
          },
          author
        ))
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        className,
        onInput: () => {
          if (!composing.current) {
            emit();
            detectMention();
          }
        },
        onKeyDown: handleKeyDown,
        onPaste: handlePaste,
        onCompositionStart: () => {
          composing.current = true;
        },
        onCompositionEnd: () => {
          composing.current = false;
          emit();
        },
        "data-placeholder": placeholder,
        style: {
          flex: 1,
          padding: "8px 10px",
          paddingBottom,
          overflowY,
          cursor,
          lineHeight,
          outline: "none",
          wordBreak: "break-word"
        }
      }
    )
  ] });
}
function getAvatarColor(name) {
  const palette = ["#D97757", "#B85E3F", "#E8956D", "#C75B39", "#A0522D", "#CF7A5A", "#E8A87C", "#8B4513"];
  let h = 0;
  for (const ch of name) h = h * 31 + ch.charCodeAt(0) & 255;
  return palette[h % palette.length];
}
function CommentItem({ comment, canEdit, onUpdate, onDelete }) {
  const [editing, setEditing] = (0, import_react.useState)(false);
  const [draft, setDraft] = (0, import_react.useState)(comment.text);
  const [hov, setHov] = (0, import_react.useState)(false);
  const commit = () => {
    const t = draft.trim();
    if (t && t !== comment.text) onUpdate(t);
    else setDraft(comment.text);
    setEditing(false);
  };
  const labelColor = getAvatarColor(comment.author);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        padding: "6px 4px",
        borderRadius: 6,
        background: hov ? "rgba(255,255,255,.03)" : "transparent"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 700,
            background: `${labelColor}22`,
            color: labelColor,
            border: `1px solid ${labelColor}44`,
            whiteSpace: "nowrap"
          }, children: comment.author }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL }, children: fmtTime(comment.createdAt) }),
          comment.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL }, children: "(\uC218\uC815\uB428)" }),
          canEdit && !editing && hov && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 3, marginLeft: "auto" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                onClick: () => {
                  setDraft(comment.text);
                  setEditing(true);
                },
                style: { padding: "0 4px", height: 16, border: `1px solid ${DARK.brd}`, borderRadius: 3, background: "transparent", color: DARK.txS, cursor: "pointer", display: "inline-flex", alignItems: "center" },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M11.06 2.06a1.5 1.5 0 0 1 2.12 0l.76.76a1.5 1.5 0 0 1 0 2.12L5.5 13.5 2 14l.5-3.5 8.56-8.44z", fill: "currentColor", fillOpacity: ".85" }) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                onClick: () => {
                  if (window.confirm("\uC774 \uB313\uAE00\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete();
                },
                style: { fontSize: 10, padding: "0 5px", height: 16, border: `1px solid ${DARK.brd}`, borderRadius: 3, background: "transparent", color: "#f87171", cursor: "pointer", lineHeight: 1 },
                children: "\xD7"
              }
            )
          ] })
        ] }),
        editing ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "textarea",
            {
              autoFocus: true,
              className: "sb-scroll",
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              rows: 2,
              style: { width: "100%", padding: "6px 8px", border: `1px solid ${COLORS.pri}`, borderRadius: 6, fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5, boxSizing: "border-box", background: DARK.bg3, color: DARK.txt },
              onKeyDown: (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(comment.text);
                  setEditing(false);
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 4, marginTop: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
              setDraft(comment.text);
              setEditing(false);
            }, style: { fontSize: 10, padding: "3px 8px", border: `1px solid ${DARK.brd}`, borderRadius: 4, background: "transparent", color: DARK.txS, cursor: "pointer" }, children: "\uCDE8\uC18C" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: commit, style: { fontSize: 10, padding: "3px 10px", border: "none", borderRadius: 2, background: COLORS.pri, color: "#fff", cursor: "pointer", fontWeight: 600 }, children: "\uC800\uC7A5" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12, color: DARK.txt, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", padding: "2px 4px 0 4px" }, children: comment.text })
      ]
    }
  );
}

// src/AnnotPin.tsx
var import_react_dom = require("react-dom");
var import_react2 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 6e4) return "\uBC29\uAE08";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}\uBD84 \uC804`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}\uC2DC\uAC04 \uC804`;
  return `${Math.floor(diff / 864e5)}\uC77C \uC804`;
}
function renderInlineMarkdown(text) {
  const lines = text.split("\n");
  const nodes = [];
  lines.forEach((rawLine, lineIdx) => {
    const line = rawLine.replace(/^#{1,6}\s+/, "").replace(/^```.*/, "").replace(/^>\s?/, "").replace(/^[-*+]\s+/, "");
    const inline = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let m;
    let k = 0;
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) inline.push(line.slice(last, m.index));
      if (m[0].startsWith("**")) {
        inline.push(
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { style: { fontWeight: 700, color: "rgba(255,255,255,.8)" }, children: m[2] }, k++)
        );
      } else if (m[0].startsWith("*")) {
        inline.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("em", { children: m[3] }, k++));
      } else {
        inline.push(
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "code",
            {
              style: {
                fontFamily: "monospace",
                background: "rgba(255,255,255,.12)",
                padding: "0 3px",
                borderRadius: 3,
                fontSize: 9
              },
              children: m[4]
            },
            k++
          )
        );
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) inline.push(line.slice(last));
    nodes.push(...inline);
    if (lineIdx < lines.length - 1) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}, `br-${lineIdx}`));
  });
  return nodes;
}
var EXPAND_W = 220;
function AnnotPin({
  pin,
  num,
  label,
  layerId,
  align,
  isSelected,
  isHovered,
  onSelect,
  onMove,
  onHoverEnter,
  onHoverLeave
}) {
  const color = label?.color ?? FALLBACK_LABEL_COLOR;
  const isResolved = pin.status === "resolved";
  const emphasized = isSelected || isHovered;
  const expanded = !isSelected && !!isHovered;
  const hasNote = !!pin.note;
  const hasComments = pin.comments.length > 0;
  const { viewportX, viewportY, expandLeft } = (() => {
    const el = document.getElementById(layerId);
    const r = el?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const rawX = align === "center" ? pin.x + r.width / 2 : align === "right" ? r.width - pin.x : pin.x;
    const vx = r.left + rawX;
    const vy = r.top + pin.y;
    return {
      viewportX: vx,
      viewportY: vy,
      expandLeft: expanded && vx + EXPAND_W > window.innerWidth - 8
    };
  })();
  const EDGE = 8;
  const MIN_UP = 120;
  const expandDown = expanded && viewportY + 28 - EDGE < MIN_UP;
  const maxExpandH = expanded ? expandDown ? Math.min(400, window.innerHeight - viewportY - EDGE) : Math.min(400, viewportY + 28 - EDGE) : 28;
  const [contentReady, setContentReady] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    if (!expanded) {
      setContentReady(false);
      return;
    }
    const raf = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(raf);
  }, [expanded]);
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (!isSelected) {
      e.stopPropagation();
      onSelect();
      return;
    }
    e.stopPropagation();
    const container = document.getElementById(layerId);
    if (!container) return;
    const base = container.getBoundingClientRect();
    let moved = false;
    const pinRawX = align === "center" ? pin.x + base.width / 2 : align === "right" ? base.width - pin.x : pin.x;
    const startX = e.clientX - base.left - pinRawX;
    const startY = e.clientY - base.top - pin.y;
    const onMoveHandler = (ev) => {
      moved = true;
      const newPx = ev.clientX - base.left - startX;
      const newPy = ev.clientY - base.top - startY;
      onMove({
        x: align === "center" ? Math.max(-base.width / 2, Math.min(base.width / 2, newPx - base.width / 2)) : align === "right" ? Math.max(0, Math.min(base.width, base.width - newPx)) : Math.max(0, Math.min(base.width, newPx)),
        y: Math.max(0, Math.min(base.height, newPy))
      });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMoveHandler);
      document.removeEventListener("mouseup", onUp);
      if (!moved) onSelect();
    };
    document.addEventListener("mousemove", onMoveHandler);
    document.addEventListener("mouseup", onUp);
  };
  const portalLeft = expandLeft ? viewportX - (EXPAND_W - 28) : viewportX;
  const portalVertical = expandDown ? { top: viewportY } : { bottom: window.innerHeight - viewportY - 28 };
  const expandedBorderRadius = "16px 16px 16px 4px";
  const Badge = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }, children: num })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        onMouseDown,
        onMouseEnter: () => onHoverEnter(pin.id),
        onMouseLeave: () => onHoverLeave(pin.id),
        style: {
          position: "absolute",
          ...align === "center" ? { left: `calc(50% + ${pin.x}px)` } : align === "right" ? { right: `${pin.x}px` } : { left: `${pin.x}px` },
          top: `${pin.y}px`,
          width: 28,
          height: 28,
          borderRadius: "80px 80px 80px 12px",
          background: "#1A1A1A",
          boxShadow: isSelected ? `0 0 0 2.5px ${isResolved ? "#6b7280" : color}, 0 0 0 4.5px rgba(255,255,255,.8), 0 4px 14px rgba(0,0,0,.38)` : "0 2px 8px rgba(0,0,0,.28)",
          cursor: isSelected ? "grab" : "pointer",
          userSelect: "none",
          opacity: isResolved && !emphasized ? 0.4 : 1,
          filter: isResolved && !emphasized ? "grayscale(1)" : "none",
          zIndex: isSelected ? 9993 : isHovered ? 9992 : 9991,
          fontFamily: FONT_FAMILY,
          pointerEvents: "all",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box"
        },
        children: Badge
      }
    ),
    expanded && typeof document !== "undefined" && (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "div",
        {
          onMouseDown,
          onMouseEnter: () => onHoverEnter(pin.id),
          onMouseLeave: () => onHoverLeave(pin.id),
          style: {
            position: "fixed",
            left: portalLeft,
            ...portalVertical,
            width: EXPAND_W,
            maxHeight: maxExpandH,
            minHeight: 28,
            borderRadius: expandedBorderRadius,
            background: "#1A1A1A",
            boxShadow: "0 6px 18px rgba(0,0,0,.38)",
            cursor: "pointer",
            userSelect: "none",
            opacity: isResolved && !emphasized ? 0.4 : 1,
            filter: isResolved && !emphasized ? "grayscale(1)" : "none",
            zIndex: 9992,
            fontFamily: FONT_FAMILY,
            pointerEvents: "all",
            display: "flex",
            flexDirection: expandLeft ? "row-reverse" : "row",
            alignItems: "flex-start",
            overflow: "hidden",
            padding: "8px",
            boxSizing: "border-box"
          },
          children: [
            Badge,
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "div",
              {
                style: {
                  flex: 1,
                  minWidth: 0,
                  paddingLeft: expandLeft ? 0 : 7,
                  paddingRight: expandLeft ? 7 : 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  opacity: contentReady ? 1 : 0,
                  transform: contentReady ? "none" : `translateX(${expandLeft ? 5 : -5}px)`,
                  transition: "opacity 0.32s ease-out, transform 0.32s ease-out"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, minWidth: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          fontSize: 10,
                          color: "rgba(255,255,255,.75)",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flexShrink: 1,
                          minWidth: 0
                        },
                        children: pin.author || "\u2014"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          fontSize: 9,
                          color: "rgba(255,255,255,.3)",
                          flexShrink: 0,
                          whiteSpace: "nowrap"
                        },
                        children: timeAgo(pin.createdAt)
                      }
                    ),
                    isResolved && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          marginLeft: "auto",
                          flexShrink: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                          padding: "1px 5px",
                          borderRadius: 2,
                          background: "rgba(22,163,74,.22)",
                          border: "1px solid rgba(22,163,74,.4)",
                          color: "#4ade80",
                          fontSize: 8,
                          fontWeight: 700,
                          whiteSpace: "nowrap"
                        },
                        children: "\u2713 \uD574\uACB0"
                      }
                    )
                  ] }),
                  hasNote && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "div",
                    {
                      style: {
                        fontSize: 10,
                        color: "rgba(255,255,255,.5)",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 10,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word"
                      },
                      children: renderInlineMarkdown(pin.note)
                    }
                  ),
                  hasComments && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.08)", margin: "2px 0" } }),
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.45)" }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", style: { color: "#93c5fd" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M13 1H3C2.45 1 2 1.45 2 2v8c0 .55.45 1 1 1h2.5l2.5 3 2.5-3H13c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z", fill: "currentColor" }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.55)" }, children: pin.comments.length })
                    ] })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
}

// src/AnnotationToolbar.tsx
var import_react4 = require("react");

// src/SettingsPopover.tsx
var import_react3 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var IGear = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
] });
var IDownload = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] });
var IZip = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "3", x2: "12", y2: "3" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M9 3h2v2H9zm2 2h2v2h-2zm-2 2h2v2H9z" })
] });
function ExportBtn({ label, icon, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      onClick,
      style: {
        width: "100%",
        padding: "7px 0",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 3,
        background: "transparent",
        color: "rgba(255,255,255,.5)",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all .12s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "rgba(255,255,255,.07)";
        e.currentTarget.style.color = "rgba(255,255,255,.85)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.25)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,.5)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
      },
      children: [
        icon,
        label
      ]
    }
  );
}
function SectionTitle({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 8, fontFamily: FONT_FAMILY }, children });
}
function SettingsPopover({ settings, onChangeSetting, author, labels, defaultLabelId, onSaveAuthor, onExportJson, onExportMarkdown }) {
  const [open, setOpen] = (0, import_react3.useState)(false);
  const [nameInput, setNameInput] = (0, import_react3.useState)(author);
  const [selectedLabelId, setSelectedLabelId] = (0, import_react3.useState)(defaultLabelId);
  const ref = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    if (open) {
      setNameInput(author);
      setSelectedLabelId(defaultLabelId);
    }
  }, [open, author, defaultLabelId]);
  (0, import_react3.useEffect)(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const handleSaveAuthor = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    onSaveAuthor(trimmed, selectedLabelId);
    setOpen(false);
  };
  const hasAuthorChange = nameInput.trim() !== author || selectedLabelId !== defaultLabelId;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { ref, "data-sb-ui": "true", style: { position: "relative", flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        title: author ? `\uC124\uC815 (\uC791\uC131\uC790: ${author})` : "\uC124\uC815 \u2014 \uC791\uC131\uC790 \uBBF8\uB4F1\uB85D",
        "data-guide": "sb-settings",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 26,
          border: `1px solid ${open ? "rgba(255,255,255,.2)" : !author ? "rgba(251,191,36,.4)" : "rgba(255,255,255,.07)"}`,
          borderRadius: 2,
          background: open ? "rgba(255,255,255,.1)" : !author ? "rgba(251,191,36,.1)" : "transparent",
          color: open ? "rgba(255,255,255,.9)" : !author ? "#fbbf24" : "rgba(255,255,255,.45)",
          cursor: "pointer",
          transition: "all .15s",
          flexShrink: 0,
          position: "relative"
        },
        onMouseEnter: (e) => {
          if (!open) {
            e.currentTarget.style.background = "rgba(255,255,255,.07)";
            e.currentTarget.style.color = "rgba(255,255,255,.8)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
          }
        },
        onMouseLeave: (e) => {
          if (!open) {
            e.currentTarget.style.background = !author ? "rgba(251,191,36,.1)" : "transparent";
            e.currentTarget.style.color = !author ? "#fbbf24" : "rgba(255,255,255,.45)";
            e.currentTarget.style.borderColor = !author ? "rgba(251,191,36,.4)" : "rgba(255,255,255,.07)";
          }
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IGear, {}),
          !author && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: {
            position: "absolute",
            top: -4,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ef4444",
            border: "1.5px solid rgba(0,0,0,.8)"
          } })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: {
          position: "absolute",
          bottom: "calc(100% + 8px)",
          right: 0,
          width: 240,
          background: "rgba(10,10,10,.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 6,
          boxShadow: "0 -8px 40px rgba(0,0,0,.55)",
          zIndex: 2e4,
          fontFamily: FONT_FAMILY,
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { padding: "10px 14px 8px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".5px", textTransform: "uppercase" }, children: "\uC124\uC815" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "12px 14px 0" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SectionTitle, { children: "\uC791\uC131\uC790" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "input",
              {
                value: nameInput,
                onChange: (e) => setNameInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleSaveAuthor();
                },
                placeholder: "\uC774\uB984 \uC785\uB825...",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,.06)",
                  border: `1px solid ${!author ? "rgba(251,191,36,.3)" : "rgba(255,255,255,.12)"}`,
                  borderRadius: 3,
                  padding: "6px 9px",
                  color: "#fff",
                  fontSize: 12,
                  fontFamily: FONT_FAMILY,
                  outline: "none",
                  marginBottom: 8
                },
                onFocus: (e) => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,.5)";
                },
                onBlur: (e) => {
                  e.currentTarget.style.borderColor = !author ? "rgba(251,191,36,.3)" : "rgba(255,255,255,.12)";
                }
              }
            ),
            labels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { marginBottom: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 10, color: "rgba(255,255,255,.3)", marginBottom: 5, fontFamily: FONT_FAMILY }, children: "\uAE30\uBCF8 \uB808\uC774\uBE14" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: labels.map((l) => {
                const color = l.color || FALLBACK_LABEL_COLOR;
                const active = selectedLabelId === l.id;
                return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    onClick: () => setSelectedLabelId(active ? null : l.id),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      borderRadius: 3,
                      fontSize: 11,
                      border: `1px solid ${active ? `${color}88` : "rgba(255,255,255,.1)"}`,
                      background: active ? `${color}22` : "transparent",
                      color: active ? color : "rgba(255,255,255,.4)",
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
                      transition: "all .12s"
                    },
                    onMouseEnter: (e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = `${color}55`;
                        e.currentTarget.style.color = color;
                      }
                    },
                    onMouseLeave: (e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
                        e.currentTarget.style.color = "rgba(255,255,255,.4)";
                      }
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 } }),
                      l.name
                    ]
                  },
                  l.id
                );
              }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                onClick: handleSaveAuthor,
                disabled: !nameInput.trim() || !hasAuthorChange,
                style: {
                  width: "100%",
                  padding: "6px 0",
                  border: "none",
                  borderRadius: 3,
                  background: nameInput.trim() && hasAuthorChange ? "rgba(99,102,241,.7)" : "rgba(255,255,255,.07)",
                  color: nameInput.trim() && hasAuthorChange ? "#fff" : "rgba(255,255,255,.25)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: nameInput.trim() && hasAuthorChange ? "pointer" : "not-allowed",
                  fontFamily: FONT_FAMILY,
                  transition: "all .12s",
                  marginBottom: 12
                },
                children: "\uC800\uC7A5"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SectionTitle, { children: "\uD328\uB110 \uD45C\uC2DC \uBC29\uC2DD" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", gap: 5 }, children: [
              { mode: "overlay", label: "\uC624\uBC84\uB808\uC774", desc: "\uC704\uC5D0 \uD45C\uC2DC" },
              { mode: "push", label: "\uBC00\uAE30", desc: "\uCF58\uD150\uCE20 \uC774\uB3D9" }
            ].map(({ mode, label, desc }) => {
              const active = settings.panelMode === mode;
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "button",
                {
                  onClick: () => onChangeSetting("panelMode", mode),
                  style: {
                    flex: 1,
                    padding: "6px 0",
                    border: `1px solid ${active ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)"}`,
                    borderRadius: 3,
                    background: active ? "rgba(59,130,246,.18)" : "transparent",
                    color: active ? "#60a5fa" : "rgba(255,255,255,.45)",
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    transition: "all .12s",
                    textAlign: "center"
                  },
                  onMouseEnter: (e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.25)";
                      e.currentTarget.style.color = "rgba(255,255,255,.75)";
                    }
                  },
                  onMouseLeave: (e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                      e.currentTarget.style.color = "rgba(255,255,255,.45)";
                    }
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { children: label }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 9, color: active ? "rgba(96,165,250,.6)" : "rgba(255,255,255,.2)", marginTop: 2 }, children: desc })
                  ]
                },
                mode
              );
            }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "12px 14px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SectionTitle, { children: "\uD654\uBA74 \uB9C8\uCEE4 \uAE30\uC900" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", gap: 5 }, children: [
              { align: "left", label: "\uC67C\uCABD" },
              { align: "center", label: "\uC911\uC559" },
              { align: "right", label: "\uC624\uB978\uCABD" }
            ].map(({ align, label }) => {
              const active = settings.markerAlign === align;
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: () => onChangeSetting("markerAlign", align),
                  style: {
                    flex: 1,
                    padding: "6px 0",
                    border: `1px solid ${active ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)"}`,
                    borderRadius: 3,
                    background: active ? "rgba(59,130,246,.18)" : "transparent",
                    color: active ? "#60a5fa" : "rgba(255,255,255,.45)",
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    transition: "all .12s",
                    textAlign: "center"
                  },
                  onMouseEnter: (e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.25)";
                      e.currentTarget.style.color = "rgba(255,255,255,.75)";
                    }
                  },
                  onMouseLeave: (e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                      e.currentTarget.style.color = "rgba(255,255,255,.45)";
                    }
                  },
                  children: label
                },
                align
              );
            }) })
          ] }),
          (onExportJson || onExportMarkdown) && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)", margin: "2px 0 10px" } }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 6 }, children: [
              onExportJson && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                ExportBtn,
                {
                  label: "\uC2A4\uD399 \uB0B4\uBCF4\uB0B4\uAE30 (JSON)",
                  icon: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IDownload, {}),
                  onClick: () => {
                    onExportJson();
                    setOpen(false);
                  }
                }
              ),
              onExportMarkdown && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                ExportBtn,
                {
                  label: "\uC2A4\uD399 \uB0B4\uBCF4\uB0B4\uAE30 (MD \xB7 ZIP)",
                  icon: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IZip, {}),
                  onClick: () => {
                    onExportMarkdown();
                    setOpen(false);
                  }
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}

// src/version.ts
var SDK_VERSION = true ? "0.8.12" : "0.8.12";

// src/AnnotationToolbar.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function TBtn({ icon, label, active, activeColor = "#3B82F6", badge, disabled, onClick, title, dataGuide, shortcut }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "button",
    {
      onClick,
      title,
      disabled,
      "data-guide": dataGuide,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: label ? 3 : 0,
        padding: "5px 8px",
        border: `1px solid ${active ? `${activeColor}66` : "rgba(255,255,255,.07)"}`,
        borderRadius: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? `${activeColor}25` : "transparent",
        color: disabled ? "rgba(255,255,255,.2)" : active ? activeColor : "rgba(255,255,255,.7)",
        transition: "all .15s",
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        minWidth: 26,
        height: 26,
        fontFamily: FONT_FAMILY
      },
      onMouseEnter: (e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "rgba(255,255,255,.07)";
          e.currentTarget.style.color = "rgba(255,255,255,1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
        }
      },
      onMouseLeave: (e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,.7)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        }
      },
      children: [
        icon && icon,
        label && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }, children: label }),
        shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: {
          fontSize: 9,
          padding: "1px 4px",
          borderRadius: 2,
          lineHeight: 1.4,
          border: "1px solid rgba(255,255,255,.2)",
          color: "rgba(255,255,255,.35)",
          background: "rgba(255,255,255,.06)",
          fontFamily: "monospace",
          flexShrink: 0,
          marginLeft: 4
        }, children: shortcut }),
        badge != null && badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "span",
          {
            style: {
              minWidth: 14,
              height: 14,
              borderRadius: 3,
              background: "#3b82f6",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              flexShrink: 0
            },
            children: badge
          }
        )
      ]
    }
  );
}
function shortVer(v) {
  const [major = "0", minor = "0", patch = "0"] = v.replace(/^v/, "").split(".");
  return `v${major}.${minor}${patch.padStart(3, "0")}`;
}
function isNewer(a, b) {
  if (!a) return false;
  const parse = (v) => v.replace(/^v/, "").split(".").map(Number);
  const [ma, mi, pa] = parse(a);
  const [mb, mi2, pb] = parse(b);
  if (ma !== mb) return ma > mb;
  if (mi !== mi2) return mi > mi2;
  return pa > pb;
}
function UpdateModal({
  currentVersion,
  latestVersion,
  onClose
}) {
  const [copied, setCopied] = (0, import_react4.useState)(null);
  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd).catch(() => {
    });
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2e3);
  };
  const gitCmd = `pnpm add git+https://github.com/knowsol/specBridge.git#v${latestVersion}`;
  const npmCmd = `npm install git+https://github.com/knowsol/specBridge.git#v${latestVersion}`;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "div",
    {
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2e4,
        fontFamily: FONT_FAMILY
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: "#0f172a",
            border: "1px solid rgba(251,191,36,.3)",
            borderRadius: 4,
            padding: 28,
            width: 460,
            boxShadow: "0 24px 64px rgba(0,0,0,.6)"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }, children: "\u{1F680} \uC0C8 \uBC84\uC804 \uC5C5\uB370\uC774\uD2B8 \uC548\uB0B4" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { fontSize: 12, color: "rgba(255,255,255,.5)" }, children: [
                  "\uD604\uC7AC\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { fontFamily: "monospace", color: "rgba(255,255,255,.75)" }, children: [
                    "v",
                    currentVersion
                  ] }),
                  "\xA0\u2192\xA0\uCD5C\uC2E0\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { fontFamily: "monospace", color: "#34d399", fontWeight: 700 }, children: [
                    "v",
                    latestVersion
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: onClose,
                  style: { background: "transparent", border: "none", color: "rgba(255,255,255,.4)", fontSize: 18, cursor: "pointer", padding: "0 4px" },
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 8 }, children: "\uC544\uB798 \uBA85\uB839\uC5B4\uB85C \uC5C5\uADF8\uB808\uC774\uB4DC \uD6C4 \uC571\uC744 \uC7AC\uBC30\uD3EC\uD558\uC138\uC694:" }),
            [{ label: "pnpm", cmd: gitCmd }, { label: "npm", cmd: npmCmd }].map(({ label, cmd }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { background: "#1e293b", borderRadius: 4, padding: "10px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,.06)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: "#64748b", width: 30, flexShrink: 0, textTransform: "uppercase" }, children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("code", { style: { flex: 1, fontSize: 11, color: "#a5f3fc", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cmd }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: () => copyCmd(cmd),
                  style: { background: copied === cmd ? "#16a34a" : "rgba(255,255,255,.07)", border: "none", borderRadius: 2, color: copied === cmd ? "#fff" : "rgba(255,255,255,.5)", fontSize: 10, padding: "4px 8px", cursor: "pointer", flexShrink: 0, transition: "all .15s" },
                  children: copied === cmd ? "\u2713 \uBCF5\uC0AC\uB428" : "\uBCF5\uC0AC"
                }
              )
            ] }, label)),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: 10, color: "rgba(255,255,255,.25)", marginTop: 12 }, children: "\uC5C5\uADF8\uB808\uC774\uB4DC \uD6C4 SDK\uB97C \uC7AC\uBE4C\uB4DC\uD558\uACE0 \uC571\uC744 \uC7AC\uBC30\uD3EC\uD574\uC57C \uC801\uC6A9\uB429\uB2C8\uB2E4." })
          ]
        }
      )
    }
  );
}
var STATUS_CYCLE = ["active", "done", "pending"];
var IEdit = () => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
] });
var IBookmark = ({ size = 13 }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) });
var IDesktop = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
] });
var ITablet = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
] });
var IMobile = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
] });
var VIEWPORT_ICON = {
  desktop: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IDesktop, {}),
  tablet: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ITablet, {}),
  mobile: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IMobile, {})
};
function SessionPickerItem({
  session,
  isActive,
  progress,
  onClick,
  onDelete,
  onStatusChange,
  onEdit
}) {
  const [hov, setHov] = (0, import_react4.useState)(false);
  const [confirming, setConfirming] = (0, import_react4.useState)(false);
  const [editing, setEditing] = (0, import_react4.useState)(false);
  const [editName, setEditName] = (0, import_react4.useState)("");
  const [editViewport, setEditViewport] = (0, import_react4.useState)(null);
  const startEdit = (e) => {
    e.stopPropagation();
    setEditName(session.name);
    setEditViewport(session.viewport ?? null);
    setConfirming(false);
    setEditing(true);
  };
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditing(false);
  };
  const saveEdit = async (e) => {
    e.stopPropagation();
    const trimmed = editName.trim();
    if (!trimmed || !onEdit) {
      setEditing(false);
      return;
    }
    await onEdit(trimmed, editViewport);
    setEditing(false);
  };
  const status = session.status ?? "active";
  const sc = SESSION_STATUS_CONFIG[status];
  const vp = session.viewport ? SESSION_VIEWPORT_CONFIG[session.viewport] : null;
  const pct = progress && progress.total > 0 ? Math.round(progress.resolved / progress.total * 100) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => {
        if (!editing) {
          setHov(false);
          setConfirming(false);
        }
      },
      style: {
        padding: "8px 12px",
        cursor: "pointer",
        background: isActive ? "rgba(255,255,255,.07)" : hov ? "rgba(255,255,255,.04)" : "transparent",
        transition: "background .12s"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 10, color: isActive ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.18)", flexShrink: 0, width: 12, textAlign: "center" }, children: isActive ? "\u2713" : "" }),
          vp && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { color: "rgba(255,255,255,.45)", flexShrink: 0, display: "flex", alignItems: "center" }, title: vp.label, children: VIEWPORT_ICON[session.viewport ?? ""] ?? null }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { flex: 1, fontSize: 12, color: isActive ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.55)", fontWeight: isActive ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: FONT_FAMILY }, children: session.name }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                if (!onStatusChange) return;
                const idx = STATUS_CYCLE.indexOf(status);
                onStatusChange(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
              },
              title: "\uC0C1\uD0DC \uBCC0\uACBD (\uD074\uB9AD)",
              style: {
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                borderRadius: 2,
                color: sc.color,
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                cursor: "pointer",
                flexShrink: 0,
                fontFamily: FONT_FAMILY,
                transition: "all .12s"
              },
              children: sc.label
            }
          ),
          hov && !confirming && !editing && onEdit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              onClick: startEdit,
              title: "\uD68C\uCC28 \uC218\uC815",
              style: { background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 2, color: "rgba(255,255,255,.3)", fontSize: 9, padding: "2px 5px", cursor: "pointer", flexShrink: 0, fontFamily: FONT_FAMILY, transition: "all .12s", display: "flex", alignItems: "center" },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.3)";
                e.currentTarget.style.color = "rgba(255,255,255,.7)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                e.currentTarget.style.color = "rgba(255,255,255,.3)";
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IEdit, {})
            }
          ),
          hov && !confirming && !editing && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setConfirming(true);
              },
              title: "\uD68C\uCC28 \uC0AD\uC81C",
              style: { background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 2, color: "rgba(255,255,255,.3)", fontSize: 9, padding: "2px 5px", cursor: "pointer", flexShrink: 0, fontFamily: FONT_FAMILY, transition: "all .12s" },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(220,38,38,.15)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,.3)";
                e.currentTarget.style.color = "#f87171";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                e.currentTarget.style.color = "rgba(255,255,255,.3)";
              },
              children: "\uC0AD\uC81C"
            }
          ),
          confirming && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { onClick: (e) => e.stopPropagation(), style: { display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 9, color: "#f87171", fontFamily: FONT_FAMILY, whiteSpace: "nowrap" }, children: "\uC0AD\uC81C\uD560\uAE4C\uC694?" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setConfirming(false);
                },
                style: { background: "transparent", border: "1px solid rgba(255,255,255,.15)", borderRadius: 2, color: "rgba(255,255,255,.45)", fontSize: 9, padding: "2px 6px", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uCDE8\uC18C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                onClick: onDelete,
                style: { background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 2, color: "#f87171", fontSize: 9, fontWeight: 700, padding: "2px 6px", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uD655\uC778"
              }
            )
          ] })
        ] }),
        progress && progress.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { marginTop: 6, paddingLeft: 18 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { flex: 1, height: 3, background: "rgba(255,255,255,.18)", borderRadius: 2, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : COLORS.pri, borderRadius: 2, transition: "width .3s" } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.3)", flexShrink: 0, fontFamily: FONT_FAMILY }, children: [
            progress.resolved,
            "/",
            progress.total
          ] })
        ] }) }),
        editing && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { onClick: (e) => e.stopPropagation(), style: { marginTop: 8, paddingLeft: 18 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "input",
            {
              autoFocus: true,
              value: editName,
              onChange: (e) => setEditName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") saveEdit(e);
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setEditing(false);
                }
              },
              style: {
                width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 2,
                padding: "4px 7px",
                color: "#fff",
                fontSize: 11,
                fontFamily: FONT_FAMILY,
                outline: "none",
                marginBottom: 6
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 6 }, children: Object.entries(SESSION_VIEWPORT_CONFIG).map(([vp2, cfg]) => {
            const isVpActive = editViewport === vp2;
            return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setEditViewport(isVpActive ? null : vp2);
                },
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "3px 0",
                  borderRadius: 2,
                  border: `1px solid ${isVpActive ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.18)"}`,
                  background: isVpActive ? "rgba(255,255,255,.12)" : "transparent",
                  color: isVpActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.3)",
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "all .12s"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { display: "flex", alignItems: "center" }, children: VIEWPORT_ICON[vp2] }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: cfg.label })
                ]
              },
              vp2
            );
          }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                onClick: cancelEdit,
                style: { flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 2, color: "rgba(255,255,255,.4)", fontSize: 11, padding: "3px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uCDE8\uC18C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                onClick: saveEdit,
                style: { flex: 2, background: COLORS.pri, border: "none", borderRadius: 2, color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uC800\uC7A5"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function SessionPicker({
  sessions,
  currentSessionId,
  sessionProgress,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onSetSessionStatus,
  onUpdateSession,
  placement = "top"
}) {
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [creating, setCreating] = (0, import_react4.useState)(false);
  const [newName, setNewName] = (0, import_react4.useState)("");
  const [newViewport, setNewViewport] = (0, import_react4.useState)(null);
  const ref = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
        setNewName("");
        setNewViewport(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const triggerLabel = currentSession ? currentSession.name : "\uC804\uCCB4";
  const triggerVp = currentSession?.viewport ? SESSION_VIEWPORT_CONFIG[currentSession.viewport] : null;
  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await onCreateSession(trimmed, { viewport: newViewport });
    setNewName("");
    setNewViewport(null);
    setCreating(false);
    setOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref, style: { position: "relative", flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        title: "\uAC80\uD1A0 \uD68C\uCC28 \uC120\uD0DD",
        "data-guide": "sb-session",
        style: {
          display: "flex",
          alignItems: "center",
          gap: 3,
          padding: "5px 8px",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,.07)",
          background: open ? "rgba(255,255,255,.07)" : "transparent",
          color: "rgba(255,255,255,.7)",
          fontSize: 11,
          fontWeight: 500,
          cursor: "pointer",
          height: 26,
          fontFamily: FONT_FAMILY,
          whiteSpace: "nowrap",
          maxWidth: 160,
          transition: "all .15s"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,.07)";
          e.currentTarget.style.color = "rgba(255,255,255,1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = open ? "rgba(255,255,255,.07)" : "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,.7)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center" }, children: triggerVp ? VIEWPORT_ICON[currentSession?.viewport ?? ""] : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IBookmark, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 110 }, children: triggerLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 8, opacity: 0.6, marginLeft: 1 }, children: "\u25BE" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "div",
      {
        style: {
          position: "absolute",
          ...placement === "bottom" ? { top: "calc(100% + 4px)" } : { bottom: "calc(100% + 8px)" },
          left: 0,
          minWidth: 260,
          background: "rgba(10,10,10,.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 4,
          boxShadow: "0 -8px 40px rgba(0,0,0,.6)",
          overflow: "hidden",
          zIndex: 2e4,
          fontFamily: FONT_FAMILY
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { padding: "8px 12px 6px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".5px", textTransform: "uppercase" }, children: "\uAC80\uD1A0 \uD68C\uCC28" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "div",
            {
              onClick: () => {
                onSelectSession(null);
                setOpen(false);
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                cursor: "pointer",
                background: currentSessionId === null ? "rgba(255,255,255,.07)" : "transparent",
                transition: "background .12s"
              },
              onMouseEnter: (e) => {
                if (currentSessionId !== null) e.currentTarget.style.background = "rgba(255,255,255,.04)";
              },
              onMouseLeave: (e) => {
                if (currentSessionId !== null) e.currentTarget.style.background = "transparent";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 10, color: currentSessionId === null ? "rgba(255,255,255,.5)" : "transparent", width: 12, textAlign: "center", flexShrink: 0 }, children: "\u2713" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 12, color: currentSessionId === null ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.45)", fontWeight: currentSessionId === null ? 600 : 400, fontFamily: FONT_FAMILY }, children: "\uC804\uCCB4 (\uBAA8\uB4E0 \uD68C\uCC28)" })
              ]
            }
          ),
          sessions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.06)", margin: "2px 0" } }),
          sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            SessionPickerItem,
            {
              session: s,
              isActive: s.id === currentSessionId,
              progress: sessionProgress?.[s.id],
              onClick: () => {
                onSelectSession(s.id);
                setOpen(false);
              },
              onDelete: (e) => {
                e.stopPropagation();
                onDeleteSession(s.id);
              },
              onStatusChange: onSetSessionStatus ? (st) => onSetSessionStatus(s.id, st) : void 0,
              onEdit: onUpdateSession ? (name, viewport) => onUpdateSession(s.id, { name, viewport }) : void 0
            },
            s.id
          )),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)", margin: "2px 0" } }),
          creating ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { padding: "8px 10px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "input",
              {
                autoFocus: true,
                value: newName,
                onChange: (e) => setNewName(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreate();
                  }
                  if (e.key === "Escape") {
                    setCreating(false);
                    setNewName("");
                    setNewViewport(null);
                  }
                },
                placeholder: "\uD68C\uCC28 \uC774\uB984 \uC785\uB825\u2026",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 2,
                  padding: "5px 8px",
                  color: "#fff",
                  fontSize: 11,
                  fontFamily: FONT_FAMILY,
                  outline: "none",
                  marginBottom: 7
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 8 }, children: Object.entries(SESSION_VIEWPORT_CONFIG).map(([vp, cfg]) => {
              const isVpActive = newViewport === vp;
              return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "button",
                {
                  onClick: () => setNewViewport(isVpActive ? null : vp),
                  style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: "4px 0",
                    borderRadius: 2,
                    border: `1px solid ${isVpActive ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.18)"}`,
                    background: isVpActive ? "rgba(255,255,255,.12)" : "transparent",
                    color: isVpActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.3)",
                    fontSize: 10,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    transition: "all .12s"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { display: "flex", alignItems: "center" }, children: VIEWPORT_ICON[vp] }),
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: cfg.label })
                  ]
                },
                vp
              );
            }) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: () => {
                    setCreating(false);
                    setNewName("");
                    setNewViewport(null);
                  },
                  style: { flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 2, color: "rgba(255,255,255,.4)", fontSize: 11, padding: "4px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                  children: "\uCDE8\uC18C"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: handleCreate,
                  style: { flex: 2, background: COLORS.pri, border: "none", borderRadius: 2, color: "#fff", fontSize: 11, padding: "4px 0", cursor: "pointer", fontFamily: FONT_FAMILY, fontWeight: 600 },
                  children: "\uCD94\uAC00"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              onClick: () => setCreating(true),
              style: {
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,.38)",
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT_FAMILY,
                transition: "all .12s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.05)";
                e.currentTarget.style.color = "rgba(255,255,255,.7)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,.38)";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 13 }, children: "\uFF0B" }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "\uC0C8 \uAC80\uD1A0 \uD68C\uCC28" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SBLogo({ size = 28 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: size, height: size, viewBox: "-10 -10 170 172", fill: "none", style: { display: "block", flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { opacity: "0.69", d: "M111.309 79.6218C116.002 96.9372 100.191 112.84 82.8489 108.247L21.3533 91.961C4.01096 87.3681 -1.85607 65.7239 10.7927 53.0015L55.6448 7.88791C68.2936 -4.83456 89.9715 0.906559 94.6651 18.2219L111.309 79.6218Z", fill: "#3078FF" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { opacity: "0.5", d: "M101.327 142.828C86.0562 152.245 66.3188 141.599 65.7993 123.666L64.723 86.5136C64.2035 68.5809 83.2915 56.8106 99.0814 65.3271L131.795 82.9713C147.585 91.4877 148.234 113.904 132.964 123.32L101.327 142.828Z", fill: "#4CD3FF" })
  ] });
}
function AnnotationToolbar({
  enabled,
  onToggleEnabled,
  author,
  defaultLabelId = null,
  onSaveAuthor,
  adding,
  onToggleAdd,
  pinCount,
  showList,
  onToggleList,
  onExportJson,
  onExportMarkdown,
  labels,
  latestSdkVersion,
  onShowGuide,
  showLogoTip,
  onAddSpec,
  addingSpec = false,
  currentViewport,
  onViewportChange,
  settings,
  onChangeSetting
}) {
  const [showUpdateModal, setShowUpdateModal] = (0, import_react4.useState)(false);
  const hasUpdate = isNewer(latestSdkVersion ?? null, SDK_VERSION);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { "data-sb-ui": "true", style: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1e4, fontFamily: FONT_FAMILY }, children: [
    enabled && adding && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", justifyContent: "center", marginBottom: 6, pointerEvents: "none" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          style: {
            background: "rgba(30,58,138,.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 12,
            color: "#bfdbfe",
            fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,.3)",
            border: "1px solid rgba(59,130,246,.3)",
            animation: "specbridgeTbHint .15s ease"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconChat, { size: 11, color: "rgba(147,197,253,.8)", style: { marginRight: 4 } }),
            " \uD654\uBA74 \uC544\uBB34 \uACF3\uC774\uB098 \uD074\uB9AD\uD558\uBA74 \uCF54\uBA58\uD2B8\uAC00 \uBC30\uCE58\uB429\uB2C8\uB2E4 \u2014 ESC \uB610\uB294 \uCDE8\uC18C\uB85C \uC911\uB2E8"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("style", { children: `@keyframes specbridgeTbHint{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}` })
    ] }),
    enabled && addingSpec && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { display: "flex", justifyContent: "center", marginBottom: 6, pointerEvents: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "div",
      {
        style: {
          background: "rgba(127,29,29,.95)",
          backdropFilter: "blur(8px)",
          borderRadius: 20,
          padding: "6px 18px",
          fontSize: 12,
          color: "#fecaca",
          fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,.3)",
          border: "1px solid rgba(239,68,68,.3)",
          animation: "specbridgeTbHint .15s ease"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { width: 11, height: 11, viewBox: "0 0 24 24", fill: "none", stroke: "rgba(252,165,165,.8)", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", style: { marginRight: 4, display: "inline-block", verticalAlign: "middle" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M9 11l3 3L22 4" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" })
          ] }),
          "\uD654\uBA74 \uC694\uC18C\uB97C \uD074\uB9AD\uD558\uBA74 \uC2A4\uD399\uC774 \uB4F1\uB85D\uB429\uB2C8\uB2E4 \u2014 ESC \uB85C \uC911\uB2E8"
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 -4px 24px rgba(0,0,0,.4)",
          height: 45,
          padding: "0 8px 0 16px",
          gap: 0
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "div",
            {
              style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { position: "relative", flexShrink: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                    "div",
                    {
                      onClick: onShowGuide,
                      title: "\uC0AC\uC6A9 \uAC00\uC774\uB4DC \uBCF4\uAE30",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: onShowGuide ? "pointer" : "default",
                        transition: "opacity .15s"
                      },
                      onMouseEnter: (e) => {
                        if (onShowGuide) e.currentTarget.style.opacity = ".72";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.opacity = "1";
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SBLogo, { size: 28 })
                    }
                  ),
                  showLogoTip && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        bottom: "calc(100% + 10px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(10,10,10,.97)",
                        border: "1px solid rgba(255,255,255,.15)",
                        borderRadius: 4,
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "rgba(255,255,255,.82)",
                        whiteSpace: "nowrap",
                        boxShadow: "0 8px 24px rgba(0,0,0,.55)",
                        pointerEvents: "none",
                        zIndex: 20001,
                        fontFamily: FONT_FAMILY,
                        lineHeight: 1.5
                      },
                      children: [
                        "\uB85C\uACE0\uB97C \uD074\uB9AD\uD558\uBA74 \uAC00\uC774\uB4DC\uB97C \uB2E4\uC2DC \uBCFC \uC218 \uC788\uC5B4\uC694 \u{1F446}",
                        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                          "div",
                          {
                            style: {
                              position: "absolute",
                              bottom: -5,
                              left: "50%",
                              transform: "translateX(-50%) rotate(45deg)",
                              width: 8,
                              height: 8,
                              background: "rgba(10,10,10,.97)",
                              borderRight: "1px solid rgba(255,255,255,.15)",
                              borderBottom: "1px solid rgba(255,255,255,.15)"
                            }
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                  "button",
                  {
                    onClick: hasUpdate ? () => setShowUpdateModal(true) : void 0,
                    title: hasUpdate ? `\uC5C5\uB370\uC774\uD2B8 \uAC00\uB2A5: ${shortVer(latestSdkVersion ?? "")} \u2014 \uD074\uB9AD\uD558\uC5EC \uC548\uB0B4 \uBCF4\uAE30` : `SpecBridge SDK ${shortVer(SDK_VERSION)}`,
                    style: { background: "transparent", border: "none", padding: 0, cursor: hasUpdate ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: ".2px", lineHeight: 1, whiteSpace: "nowrap" }, children: "SpecBridge" }),
                      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 1 }, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: COLORS.pri, lineHeight: 1 }, children: "Beta" }),
                        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 9, fontFamily: "monospace", color: hasUpdate ? "#fbbf24" : "rgba(255,255,255,.55)", lineHeight: 1 }, children: shortVer(SDK_VERSION) }),
                        hasUpdate && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { fontSize: 7, fontWeight: 700, background: "#f59e0b", color: "#0f172a", borderRadius: 3, padding: "1px 3px", lineHeight: 1.4, whiteSpace: "nowrap" }, children: [
                          "\u2191 ",
                          shortVer(latestSdkVersion ?? "")
                        ] })
                      ] })
                    ]
                  }
                ),
                onViewportChange && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { width: 1, height: 22, background: "rgba(255,255,255,.18)", flexShrink: 0, marginLeft: 4 } }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { "data-guide": "sb-viewport", style: { display: "flex", gap: 2, alignItems: "center" }, children: ["desktop", "tablet", "mobile"].map((vp) => {
                    const icons = { desktop: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IDesktop, {}), tablet: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ITablet, {}), mobile: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IMobile, {}) };
                    const labels2 = { desktop: "PC", tablet: "\uD0DC\uBE14\uB9BF", mobile: "\uBAA8\uBC14\uC77C" };
                    const isActive = (currentViewport ?? "desktop") === vp;
                    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                      "button",
                      {
                        onClick: () => onViewportChange(vp),
                        title: labels2[vp],
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 26,
                          height: 26,
                          borderRadius: 2,
                          border: `1px solid ${isActive ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.07)"}`,
                          background: isActive ? "rgba(255,255,255,.12)" : "transparent",
                          color: isActive ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.45)",
                          cursor: "pointer",
                          transition: "all .15s",
                          flexShrink: 0
                        },
                        onMouseEnter: (e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "rgba(255,255,255,.07)";
                            e.currentTarget.style.color = "rgba(255,255,255,.8)";
                          }
                        },
                        onMouseLeave: (e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "rgba(255,255,255,.45)";
                          }
                        },
                        children: icons[vp]
                      },
                      vp
                    );
                  }) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { flex: 1 } }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }, children: [
            enabled && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
              onAddSpec && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                TBtn,
                {
                  label: "\uC2A4\uD399 \uCD94\uAC00",
                  activeColor: "#3b82f6",
                  onClick: onAddSpec,
                  title: "\uD654\uBA74 \uC694\uC18C \uC2A4\uD399 \uCD94\uAC00 \u2014 \uB2E8\uCD95\uD0A4 S",
                  dataGuide: "sb-add-spec",
                  shortcut: "S"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                TBtn,
                {
                  label: adding ? "\uCDE8\uC18C" : "\uCF54\uBA58\uD2B8 \uCD94\uAC00",
                  active: adding,
                  activeColor: COLORS.pri,
                  onClick: onToggleAdd,
                  title: adding ? "\uCF54\uBA58\uD2B8 \uBC30\uCE58 \uCDE8\uC18C (ESC)" : "\uCF54\uBA58\uD2B8 \uCD94\uAC00 \u2014 \uB2E8\uCD95\uD0A4 C",
                  dataGuide: "sb-add-pin",
                  shortcut: adding ? void 0 : "C"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                TBtn,
                {
                  label: "\uBAA9\uB85D",
                  active: showList,
                  activeColor: COLORS.pri,
                  badge: pinCount,
                  onClick: onToggleList,
                  title: "\uD604\uC7AC \uD398\uC774\uC9C0 \uBAA9\uB85D \u2014 \uB2E8\uCD95\uD0A4 L",
                  dataGuide: "sb-pin-list"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { width: 1, height: 22, background: "rgba(255,255,255,.12)", flexShrink: 0, margin: "0 2px" } })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "button",
              {
                onClick: onToggleEnabled,
                title: enabled ? "\uC124\uACC4 \uBAA8\uB4DC \uC885\uB8CC \u2014 \uB2E8\uCD95\uD0A4 A" : "\uC124\uACC4 \uBAA8\uB4DC \uC2DC\uC791 \u2014 \uB2E8\uCD95\uD0A4 A",
                "data-guide": "sb-design-mode",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  border: `1px solid ${enabled ? "rgba(99,102,241,.5)" : "rgba(255,255,255,.15)"}`,
                  borderRadius: 2,
                  cursor: "pointer",
                  background: enabled ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.06)",
                  color: enabled ? "#a5b4fc" : "rgba(255,255,255,.6)",
                  fontSize: 11,
                  fontWeight: 600,
                  height: 26,
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontFamily: FONT_FAMILY
                },
                onMouseEnter: (e) => {
                  if (!enabled) {
                    e.currentTarget.style.background = "rgba(99,102,241,.15)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,.4)";
                    e.currentTarget.style.color = "#a5b4fc";
                  }
                },
                onMouseLeave: (e) => {
                  if (!enabled) {
                    e.currentTarget.style.background = "rgba(255,255,255,.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,.6)";
                  }
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: {
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: enabled ? "#6ee7b7" : "rgba(255,255,255,.25)",
                    boxShadow: enabled ? "0 0 6px #6ee7b7" : "none",
                    transition: "all .2s"
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "\uC124\uACC4\uBAA8\uB4DC" }),
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    borderRadius: 2,
                    lineHeight: 1.4,
                    border: "1px solid rgba(255,255,255,.2)",
                    color: "rgba(255,255,255,.35)",
                    background: "rgba(255,255,255,.06)",
                    fontFamily: "monospace",
                    flexShrink: 0,
                    marginLeft: 4
                  }, children: "A" })
                ]
              }
            ),
            settings && onChangeSetting && onSaveAuthor && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              SettingsPopover,
              {
                settings,
                onChangeSetting,
                author,
                labels: labels ?? [],
                defaultLabelId,
                onSaveAuthor,
                onExportJson,
                onExportMarkdown
              }
            )
          ] })
        ]
      }
    ),
    showUpdateModal && latestSdkVersion && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      UpdateModal,
      {
        currentVersion: SDK_VERSION,
        latestVersion: latestSdkVersion,
        onClose: () => setShowUpdateModal(false)
      }
    )
  ] });
}

// src/AuthorModal.tsx
var import_react5 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function AuthorModal({
  currentAuthor,
  currentDefaultLabelId,
  labels,
  onSave,
  onCancel
}) {
  const [name, setName] = (0, import_react5.useState)(currentAuthor);
  const [selectedLabelId, setSelectedLabelId] = (0, import_react5.useState)(
    currentDefaultLabelId ?? labels[0]?.id ?? null
  );
  const inputRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, []);
  (0, import_react5.useEffect)(() => {
    if (!selectedLabelId && labels.length > 0) {
      setSelectedLabelId(labels[0].id);
    }
  }, [labels, selectedLabelId]);
  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedLabelId);
  };
  const activeLabel = labels.find((l) => l.id === selectedLabelId);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 11e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.55)",
        fontFamily: FONT_FAMILY
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "div",
        {
          style: {
            background: DARK.bg,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 14,
            padding: "28px 32px",
            width: 360,
            boxShadow: "0 20px 60px rgba(0,0,0,.5)"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: 16, fontWeight: 700, marginBottom: 5, color: DARK.txt }, children: "\uC791\uC131\uC790 \uB4F1\uB85D" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: 12, color: DARK.txS, marginBottom: 20 }, children: "\uC774\uB984\uACFC \uAE30\uBCF8 \uB808\uC774\uBE14\uC740 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uACC4\uC18D \uC720\uC9C0\uB429\uB2C8\uB2E4." }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 5 }, children: "\uC774\uB984" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "input",
              {
                ref: inputRef,
                value: name,
                onChange: (e) => {
                  const v = e.target.value;
                  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(v);
                  const limit = hasKorean ? 5 : 10;
                  if (v.length <= limit) setName(v);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" && name.trim()) handleSave();
                },
                placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694 (\uD55C\uAE00 5\uC790 / \uC601\uBB38 10\uC790)",
                style: {
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${DARK.brd2}`,
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 20,
                  background: DARK.bg3,
                  color: DARK.txt,
                  fontFamily: FONT_FAMILY
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 8 }, children: [
              "\uAE30\uBCF8 \uB808\uC774\uBE14",
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { fontWeight: 400, color: DARK.txL, marginLeft: 6 }, children: "(\uBC88\uD638 \uCD94\uAC00 \uC2DC \uC790\uB3D9 \uC120\uD0DD)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }, children: labels.map((l) => {
              const active = selectedLabelId === l.id;
              const color = l.color || FALLBACK_LABEL_COLOR;
              return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                "button",
                {
                  onClick: () => setSelectedLabelId(l.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 13px",
                    borderRadius: 20,
                    border: `1.5px solid ${active ? color : DARK.brd}`,
                    background: active ? `${color}22` : DARK.bg2,
                    color: active ? color : DARK.txS,
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    transition: "all .12s"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 } }),
                    l.name,
                    active && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { fontSize: 11 }, children: "\u2713" })
                  ]
                },
                l.id
              );
            }) }),
            activeLabel && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                style: {
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${activeLabel.color}12`,
                  border: `1px solid ${activeLabel.color}30`,
                  fontSize: 11,
                  color: DARK.txS,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { width: 8, height: 8, borderRadius: "50%", background: activeLabel.color, flexShrink: 0 } }),
                  "\uBC88\uD638 \uCD94\uAC00 \uC2DC \uAE30\uBCF8\uC73C\uB85C\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { color: activeLabel.color, fontWeight: 700 }, children: activeLabel.name }),
                  "\xA0\uB808\uC774\uBE14\uC774 \uC120\uD0DD\uB429\uB2C8\uB2E4."
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "button",
                {
                  onClick: onCancel,
                  style: {
                    flex: 1,
                    padding: "9px 0",
                    border: `1px solid ${DARK.brd}`,
                    borderRadius: 8,
                    background: DARK.bg2,
                    fontSize: 13,
                    cursor: "pointer",
                    color: DARK.txS,
                    fontFamily: FONT_FAMILY
                  },
                  children: "\uCDE8\uC18C"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "button",
                {
                  onClick: handleSave,
                  disabled: !name.trim(),
                  style: {
                    flex: 2,
                    padding: "9px 0",
                    border: "none",
                    borderRadius: 8,
                    background: name.trim() ? COLORS.pri : DARK.bg2,
                    color: name.trim() ? "#fff" : DARK.txL,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: name.trim() ? "pointer" : "not-allowed",
                    transition: "background .15s",
                    fontFamily: FONT_FAMILY
                  },
                  children: "\uB4F1\uB85D"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}

// src/LabelManagerModal.tsx
var import_react6 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
function LabelManagerModal({ labels, pinUsage, onAdd, onUpdate, onDelete, onClose }) {
  const [newName, setNewName] = (0, import_react6.useState)("");
  const [newColor, setNewColor] = (0, import_react6.useState)(LABEL_COLOR_PRESETS[0]);
  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name, newColor);
    setNewName("");
    setNewColor(LABEL_COLOR_PRESETS[0]);
  };
  const inp = {
    padding: "7px 10px",
    border: `1px solid ${DARK.brd2}`,
    borderRadius: 6,
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: DARK.bg3,
    color: DARK.txt
  };
  (0, import_react6.useEffect)(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onClose]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 11e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.55)"
      },
      onClick: onClose,
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: DARK.bg,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 14,
            width: 440,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
              "div",
              {
                style: {
                  padding: "14px 18px",
                  background: DARK.bg2,
                  borderBottom: `1px solid ${DARK.brd}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: DARK.txt }, children: "\u{1F3F7}\uFE0F \uB808\uC774\uBE14 \uAD00\uB9AC" }),
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 10, color: DARK.txL, marginTop: 2 }, children: "\uC804\uCCB4 \uD398\uC774\uC9C0\uC5D0 \uACF5\uD1B5 \uC801\uC6A9\uB429\uB2C8\uB2E4" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    "button",
                    {
                      onClick: onClose,
                      style: {
                        background: "rgba(255,255,255,.08)",
                        border: "none",
                        color: DARK.txS,
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 16
                      },
                      children: "\xD7"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "14px 18px" }, children: labels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { padding: "24px 0", textAlign: "center", color: DARK.txL, fontSize: 12 }, children: "\uB4F1\uB85D\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uCD94\uAC00\uD558\uC138\uC694." }) : labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              LabelRow,
              {
                label,
                usage: pinUsage[label.id] ?? 0,
                onUpdate: (patch) => onUpdate(label.id, patch),
                onDelete: () => onDelete(label.id)
              },
              label.id
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
              "div",
              {
                style: {
                  borderTop: `1px solid ${DARK.brd}`,
                  padding: "12px 18px",
                  background: DARK.bg2,
                  flexShrink: 0
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 6 }, children: "+ \uB808\uC774\uBE14 \uCD94\uAC00" }),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ColorDot, { color: newColor, onChange: setNewColor, title: "\uC0C9\uC0C1 \uC120\uD0DD" }),
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                      "input",
                      {
                        value: newName,
                        onChange: (e) => setNewName(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") handleAdd();
                        },
                        placeholder: "\uB808\uC774\uBE14 \uC774\uB984 (\uC608: UI \uC774\uC288)",
                        style: { ...inp, flex: 1 }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                      "button",
                      {
                        onClick: handleAdd,
                        disabled: !newName.trim(),
                        style: {
                          padding: "7px 14px",
                          border: "none",
                          borderRadius: 6,
                          background: newName.trim() ? COLORS.pri : DARK.bg3,
                          color: newName.trim() ? "#fff" : DARK.txL,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: newName.trim() ? "pointer" : "not-allowed"
                        },
                        children: "\uCD94\uAC00"
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function LabelRow({ label, usage, onUpdate, onDelete }) {
  const [editing, setEditing] = (0, import_react6.useState)(false);
  const [draftName, setDraftName] = (0, import_react6.useState)(label.name);
  const commit = () => {
    const n = draftName.trim();
    if (n && n !== label.name) onUpdate({ name: n });
    else setDraftName(label.name);
    setEditing(false);
  };
  const handleDelete = () => {
    if (usage > 0) {
      const ok = window.confirm(
        `\uC774 \uB808\uC774\uBE14\uC744 \uC0AC\uC6A9 \uC911\uC778 \uD540\uC774 ${usage}\uAC1C \uC788\uC2B5\uB2C8\uB2E4.
\uC0AD\uC81C\uD558\uBA74 \uD574\uB2F9 \uD540\uB4E4\uC740 "\uBBF8\uBD84\uB958"\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?`
      );
      if (!ok) return;
    }
    onDelete();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 6px",
        borderBottom: `1px solid ${DARK.brd}`
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ColorDot, { color: label.color, onChange: (c) => onUpdate({ color: c }), title: "\uC0C9\uC0C1 \uBCC0\uACBD" }),
        editing ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "input",
          {
            autoFocus: true,
            value: draftName,
            onChange: (e) => setDraftName(e.target.value),
            onBlur: commit,
            onKeyDown: (e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraftName(label.name);
                setEditing(false);
              }
            },
            style: {
              flex: 1,
              padding: "4px 8px",
              border: `1px solid ${DARK.brd2}`,
              borderRadius: 5,
              fontSize: 12,
              outline: "none",
              fontFamily: "inherit",
              background: DARK.bg3,
              color: DARK.txt
            }
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "div",
          {
            onClick: () => setEditing(true),
            style: { flex: 1, fontSize: 13, fontWeight: 500, color: DARK.txt, cursor: "text", padding: "4px 2px" },
            title: "\uD074\uB9AD\uD558\uC5EC \uC218\uC815",
            children: label.name
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { style: { fontSize: 10, color: usage > 0 ? DARK.txS : DARK.txL, minWidth: 40, textAlign: "right" }, children: [
          usage,
          "\uAC1C \uC0AC\uC6A9"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "button",
          {
            onClick: handleDelete,
            title: "\uB808\uC774\uBE14 \uC0AD\uC81C",
            style: {
              padding: "4px 8px",
              border: `1px solid ${DARK.brd}`,
              borderRadius: 5,
              background: "transparent",
              color: "#f87171",
              fontSize: 11,
              cursor: "pointer"
            },
            children: "\uC0AD\uC81C"
          }
        )
      ]
    }
  );
}
function ColorDot({ color, onChange, title }) {
  const [open, setOpen] = (0, import_react6.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        title,
        style: {
          width: 22,
          height: 22,
          borderRadius: 5,
          background: color,
          border: `1px solid ${DARK.brd}`,
          cursor: "pointer",
          padding: 0,
          flexShrink: 0
        }
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { onClick: () => setOpen(false), style: { position: "fixed", inset: 0, zIndex: 1 } }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "div",
        {
          style: {
            position: "absolute",
            top: 26,
            left: 0,
            zIndex: 2,
            background: DARK.bg2,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 7,
            padding: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 22px)",
            gap: 6
          },
          children: LABEL_COLOR_PRESETS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: () => {
                onChange(c);
                setOpen(false);
              },
              style: {
                width: 22,
                height: 22,
                borderRadius: 4,
                background: c,
                border: c === color ? `2px solid #fff` : `1px solid ${DARK.brd}`,
                cursor: "pointer",
                padding: 0
              }
            },
            c
          ))
        }
      )
    ] })
  ] });
}

// src/OnboardingGuide.tsx
var import_react7 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
var SB_LOGO_PATHS = /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { opacity: "0.69", d: "M111.309 79.6218C116.002 96.9372 100.191 112.84 82.8489 108.247L21.3533 91.961C4.01096 87.3681 -1.85607 65.7239 10.7927 53.0015L55.6448 7.88791C68.2936 -4.83456 89.9715 0.906559 94.6651 18.2219L111.309 79.6218Z", fill: "#3078FF" }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { opacity: "0.5", d: "M101.327 142.828C86.0562 152.245 66.3188 141.599 65.7993 123.666L64.723 86.5136C64.2035 68.5809 83.2915 56.8106 99.0814 65.3271L131.795 82.9713C147.585 91.4877 148.234 113.904 132.964 123.32L101.327 142.828Z", fill: "#4CD3FF" })
] });
var SB_LOGO_VIEWBOX = "-10 -10 170 172";
var GIcon = ({ children, size = 32 }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,.75)", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", children }) });
function IntroLogo() {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { width: 54, height: 54, viewBox: SB_LOGO_VIEWBOX, fill: "none", style: { display: "block", margin: "0 auto", position: "relative", left: -3 }, children: SB_LOGO_PATHS });
}
var GUIDE_KEY = "cs_annot_guide_v1";
function hasDismissedForever() {
  try {
    return localStorage.getItem(GUIDE_KEY) === "1";
  } catch {
    return false;
  }
}
function markDismissedForever() {
  try {
    localStorage.setItem(GUIDE_KEY, "1");
  } catch {
  }
}
var STEPS = [
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IntroLogo, {}),
    title: "SpecBridge",
    badge: "\uD654\uBA74 \uC2A4\uD399 \uD611\uC5C5 \uD234",
    desc: "\uC2A4\uD399\uBE0C\uB9BF\uC9C0\uB294 \uD654\uBA74 \uC694\uC18C \uBCC4 \uC2A4\uD399\uC744 \uC815\uC758\uD558\uACE0,\n\uD540\uC73C\uB85C \uCF54\uBA58\uD2B8\xB7\uAC80\uD1A0\uB97C \uD300\uC6D0\uACFC \uD568\uAED8 \uAD00\uB9AC\uD558\uB294 \uD611\uC5C5 \uD234\uC785\uB2C8\uB2E4.\n\uC544\uB798 \uAC00\uC774\uB4DC\uB85C \uD575\uC2EC \uAE30\uB2A5\uC744 \uC0B4\uD3B4\uBCF4\uC138\uC694.",
    target: null
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "12", cy: "7", r: "4" })
    ] }),
    title: "\uC774\uB984 \uC124\uC815",
    badge: "\uAE30\uBCF8 \uC124\uC815",
    desc: "\uC6B0\uCE21 \uD234\uBC14\uC758 \uC124\uC815(\u2699) \uBC84\uD2BC\uC744 \uD074\uB9AD\uD574 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694.\n\uD540\uACFC \uC2A4\uD399\uC5D0 \uC791\uC131\uC790 \uC815\uBCF4\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.",
    target: "sb-settings"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("polyline", { points: "12 6 12 12 16 14" })
    ] }),
    title: "\uC124\uACC4 \uBAA8\uB4DC",
    badge: "\uAE30\uBCF8 \uC124\uC815",
    desc: "\uC124\uACC4 \uBAA8\uB4DC \uBC84\uD2BC\uC73C\uB85C \uC2A4\uD399 \uC791\uC5C5\uC744 ON/OFF\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.\n\uC124\uACC4 \uBAA8\uB4DC\uC5D0\uC11C\uB9CC \uD540 \uCD94\uAC00\xB7\uC2A4\uD399 \uD3B8\uC9D1\uC774 \uAC00\uB2A5\uD569\uB2C8\uB2E4.\n\uB2E8\uCD95\uD0A4 A",
    target: "sb-design-mode"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("polyline", { points: "14 2 14 8 20 8" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("line", { x1: "9", y1: "13", x2: "15", y2: "13" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("line", { x1: "9", y1: "17", x2: "13", y2: "17" })
    ] }),
    title: "\uC2A4\uD399 \uCD94\uAC00",
    badge: "\uC2A4\uD399 \uAD00\uB9AC",
    desc: '\uC124\uACC4 \uBAA8\uB4DC\uC5D0\uC11C "\uC2A4\uD399 \uCD94\uAC00" \uBC84\uD2BC\uC73C\uB85C\n\uD654\uBA74 \uC694\uC18C\uB97C \uD074\uB9AD\uD574 \uC2A4\uD399\uC744 \uB4F1\uB85D\uD569\uB2C8\uB2E4.\n\uC6B0\uCE21 \uD328\uB110\uC5D0\uC11C \uB0B4\uC6A9\uC744 \uD3B8\uC9D1\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.\n\uB2E8\uCD95\uD0A4 S',
    target: "sb-add-spec"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(GIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" }) }),
    title: "\uCF54\uBA58\uD2B8 \uCD94\uAC00",
    badge: "\uD611\uC5C5",
    desc: "\uD540 \uCD94\uAC00 \uBC84\uD2BC\uC73C\uB85C \uD654\uBA74\uC758 \uC6D0\uD558\uB294 \uC704\uCE58\uC5D0 \uD540\uC744 \uCC0D\uACE0\n\uCF54\uBA58\uD2B8\uB97C \uB0A8\uAE30\uC138\uC694.\n\uD540\uC744 \uD074\uB9AD\uD558\uBA74 \uC2A4\uB808\uB4DC \uB313\uAE00\xB7\uD574\uACB0 \uCC98\uB9AC\uAC00 \uAC00\uB2A5\uD569\uB2C8\uB2E4.\n\uB2E8\uCD95\uD0A4 C",
    target: "sb-add-pin"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { width: "18", height: "14", x: "3", y: "4", rx: "2" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M3 10h18" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M8 20h8M12 14v6" })
    ] }),
    title: "\uB808\uC774\uC544\uC6C3 \uC804\uD658",
    badge: "\uD654\uBA74 \uC124\uC815",
    desc: "\uB85C\uACE0 \uC624\uB978\uCABD\uC758 \uBDF0\uD3EC\uD2B8 \uC544\uC774\uCF58\uC73C\uB85C\nPC \xB7 \uD0DC\uBE14\uB9BF \xB7 \uBAA8\uBC14\uC77C \uB808\uC774\uC544\uC6C3\uC744 \uC804\uD658\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.\n\uC124\uC815(\u2699) \uBC84\uD2BC\uC5D0\uC11C \uD328\uB110 \uD45C\uC2DC \uBC29\uC2DD\uB3C4 \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    target: "sb-viewport"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" })
    ] }),
    title: "\uB2E8\uCD95\uD0A4 \uC548\uB0B4",
    badge: "\uB2E8\uCD95\uD0A4",
    desc: "[A] \uC124\uACC4 \uBAA8\uB4DC ON/OFF\n[C] \uCF54\uBA58\uD2B8 \uCD94\uAC00\n[S] \uC2A4\uD399 \uCD94\uAC00\n[L] \uBAA9\uB85D",
    target: null
  }
];
var SPOTLIGHT_PADDING = 8;
function getSpotRect(target) {
  if (!target) return null;
  const el = document.querySelector(`[data-guide="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}
function OnboardingGuide({ onClose }) {
  const [step, setStep] = (0, import_react7.useState)(0);
  const [hideForever, setHideForever] = (0, import_react7.useState)(false);
  const [spotRect, setSpotRect] = (0, import_react7.useState)(null);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  (0, import_react7.useEffect)(() => {
    const raf = requestAnimationFrame(() => {
      setSpotRect(getSpotRect(current.target));
    });
    return () => cancelAnimationFrame(raf);
  }, [step, current.target]);
  (0, import_react7.useEffect)(() => {
    const onResize = () => setSpotRect(getSpotRect(current.target));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current.target]);
  const handleClose = () => {
    if (hideForever) markDismissedForever();
    onClose(hideForever);
  };
  const handleNext = () => {
    if (isLast) {
      handleClose();
      return;
    }
    setStep((v) => v + 1);
  };
  const handlePrev = () => setStep((v) => v - 1);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        onClick: handleClose,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 19996,
          background: spotRect ? "transparent" : "rgba(0,0,0,.70)",
          fontFamily: FONT_FAMILY
        }
      }
    ),
    spotRect && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        style: {
          position: "fixed",
          top: spotRect.top - SPOTLIGHT_PADDING,
          left: spotRect.left - SPOTLIGHT_PADDING,
          width: spotRect.width + SPOTLIGHT_PADDING * 2,
          height: spotRect.height + SPOTLIGHT_PADDING * 2,
          borderRadius: 10,
          boxShadow: "0 0 0 9999px rgba(0,0,0,.70)",
          border: "2px solid rgba(59,130,246,.75)",
          zIndex: 19997,
          transition: "top .3s cubic-bezier(.4,0,.2,1), left .3s cubic-bezier(.4,0,.2,1), width .3s cubic-bezier(.4,0,.2,1), height .3s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 19999,
          background: "rgba(12,12,12,.98)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 16,
          padding: "20px 26px 18px",
          width: 340,
          height: 390,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,.75)",
          fontFamily: FONT_FAMILY
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "button",
            {
              onClick: handleClose,
              style: {
                position: "absolute",
                top: 13,
                right: 14,
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,.28)",
                fontSize: 15,
                cursor: "pointer",
                lineHeight: 1,
                padding: 4
              },
              children: "\u2715"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { display: "flex", gap: 5, justifyContent: "center", marginBottom: 14, flexShrink: 0 }, children: STEPS.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "div",
            {
              onClick: () => setStep(i),
              style: {
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? "#3B82F6" : "rgba(255,255,255,.16)",
                cursor: "pointer",
                transition: "all .22s"
              }
            },
            i
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { height: 68, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: current.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: {
            textAlign: "center",
            fontSize: step === 0 ? 20 : 16,
            fontWeight: 700,
            color: "rgba(255,255,255,.92)",
            marginBottom: 8,
            lineHeight: 1.3,
            flexShrink: 0
          }, children: current.title }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { display: "flex", justifyContent: "center", marginBottom: 8, flexShrink: 0 }, children: step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: {
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".6px",
            color: "#6B82F6",
            background: "rgba(107,130,246,.15)",
            border: "1px solid rgba(107,130,246,.3)",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: FONT_FAMILY
          }, children: current.badge }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: {
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: ".4px",
            color: "rgba(255,255,255,.28)",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: FONT_FAMILY
          }, children: current.badge }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 12.5,
            color: "rgba(255,255,255,.48)",
            lineHeight: 1.75,
            whiteSpace: "pre-line"
          }, children: current.desc }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: { textAlign: "center", fontSize: 10, color: "rgba(255,255,255,.22)", marginBottom: 10, flexShrink: 0 }, children: [
            step + 1,
            " / ",
            STEPS.length
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 10, flexShrink: 0 }, children: [
            step > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                onClick: handlePrev,
                style: {
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.4)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY
                },
                children: "\uC774\uC804"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                onClick: handleNext,
                style: {
                  flex: 2,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "#3B82F6",
                  border: "none",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "background .15s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "#2563EB";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "#3B82F6";
                },
                children: isLast ? "\uC2DC\uC791\uD558\uAE30 \u{1F680}" : "\uB2E4\uC74C"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                cursor: "pointer",
                userSelect: "none",
                flexShrink: 0
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: hideForever,
                    onChange: (e) => setHideForever(e.target.checked),
                    style: { width: 13, height: 13, cursor: "pointer", accentColor: "#3B82F6" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontSize: 11, color: "rgba(255,255,255,.28)", fontFamily: FONT_FAMILY }, children: "\uC55E\uC73C\uB85C \uBCF4\uC774\uC9C0 \uC54A\uC74C" })
              ]
            }
          )
        ]
      }
    )
  ] });
}

// src/ElementPicker.tsx
var import_react8 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var EXCLUDED_IDS = [
  "specbridge-annot-layer",
  "specbridge-pin-layer",
  "sb-element-picker-highlight",
  "sb-element-picker-popup",
  "sb-spec-drawer"
  // SpecDrawer
];
function isExcluded(el) {
  let cur = el;
  while (cur && cur !== document.body) {
    if (EXCLUDED_IDS.includes(cur.id)) return true;
    if (cur.dataset?.sbUi) return true;
    cur = cur.parentElement;
  }
  return false;
}
function NamingPopup({
  rect,
  initialName,
  onConfirm,
  onCancel
}) {
  const [name, setName] = (0, import_react8.useState)(initialName);
  const inputRef = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  const popW = 240;
  const popH = 96;
  const margin = 8;
  let left = rect.left;
  let top = rect.bottom + margin;
  if (left + popW > window.innerWidth - margin) left = window.innerWidth - popW - margin;
  if (left < margin) left = margin;
  if (top + popH > window.innerHeight - 50) top = rect.top - popH - margin;
  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      id: "sb-element-picker-popup",
      style: {
        position: "fixed",
        top,
        left,
        width: popW,
        background: "rgba(8,12,24,.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,.4)",
        borderRadius: 6,
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        padding: "10px 12px",
        zIndex: 19999,
        fontFamily: FONT_FAMILY
      },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 6, letterSpacing: ".3px", fontWeight: 600 }, children: "\uC694\uC18C \uC774\uB984 \uC9C0\uC815" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "input",
          {
            ref: inputRef,
            value: name,
            onChange: (e) => setName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }
              if (e.key === "Escape") onCancel();
            },
            placeholder: "\uC608: \uC800\uC7A5 \uBC84\uD2BC, \uD68C\uC6D0 \uD14C\uC774\uBE14...",
            style: {
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(255,255,255,.07)",
              border: "1px solid rgba(99,102,241,.4)",
              borderRadius: 4,
              padding: "6px 9px",
              color: "#fff",
              fontSize: 12,
              fontFamily: FONT_FAMILY,
              outline: "none",
              marginBottom: 8
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              onClick: onCancel,
              style: {
                flex: 1,
                padding: "5px 0",
                borderRadius: 3,
                background: "transparent",
                border: "1px solid rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.45)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: FONT_FAMILY
              },
              children: "\uCDE8\uC18C"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              onClick: handleConfirm,
              disabled: !name.trim(),
              style: {
                flex: 2,
                padding: "5px 0",
                borderRadius: 3,
                background: name.trim() ? "rgba(99,102,241,.7)" : "rgba(255,255,255,.07)",
                border: "none",
                color: name.trim() ? "#fff" : "rgba(255,255,255,.25)",
                fontSize: 11,
                fontWeight: 600,
                cursor: name.trim() ? "pointer" : "not-allowed",
                fontFamily: FONT_FAMILY
              },
              children: "\uD655\uC778 \u2192"
            }
          )
        ] })
      ]
    }
  );
}
function ElementPicker({ active, align, onSelectElement }) {
  const [hovered, setHovered] = (0, import_react8.useState)(null);
  const [naming, setNaming] = (0, import_react8.useState)(null);
  const frameRef = (0, import_react8.useRef)(null);
  const hoveredRef = (0, import_react8.useRef)(null);
  const onMove = (0, import_react8.useCallback)((e) => {
    if (naming) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const target = e.target;
      if (!target || isExcluded(target)) {
        setHovered(null);
        hoveredRef.current = null;
        return;
      }
      const el = target.closest("[id], button, a, input, select, textarea, [role], h1, h2, h3, h4, li, td, th, label, img, form, section, article, nav, header, footer, main, aside") ?? target;
      if (isExcluded(el)) {
        setHovered(null);
        hoveredRef.current = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      const next = { el, rect };
      hoveredRef.current = next;
      setHovered(next);
    });
  }, [naming]);
  const onClick = (0, import_react8.useCallback)((e) => {
    const clickTarget = e.target;
    if (!clickTarget || isExcluded(clickTarget)) return;
    const pinLayer = document.getElementById("specbridge-pin-layer");
    const layerRect = pinLayer?.getBoundingClientRect();
    if (!layerRect || layerRect.width === 0 || layerRect.height === 0) return;
    e.preventDefault();
    e.stopPropagation();
    if (hoveredRef.current && !isExcluded(hoveredRef.current.el)) {
      const { el, rect } = hoveredRef.current;
      hoveredRef.current = null;
      const rawX = rect.left - layerRect.left;
      const pinX = align === "center" ? rawX - layerRect.width / 2 : align === "right" ? layerRect.width - rawX : rawX;
      const pinY = rect.top - layerRect.top;
      setNaming({ rect, initialName: el.dataset?.specLabel ?? "", pinX, pinY });
    } else {
      hoveredRef.current = null;
      const rawX = e.clientX - layerRect.left;
      const rawY = e.clientY - layerRect.top;
      const pinX = align === "center" ? rawX - layerRect.width / 2 : align === "right" ? layerRect.width - rawX : rawX;
      const fakeRect = new DOMRect(e.clientX, e.clientY, 0, 0);
      setNaming({ rect: fakeRect, initialName: "", pinX, pinY: rawY });
    }
    setHovered(null);
  }, [align]);
  (0, import_react8.useEffect)(() => {
    if (!active) {
      setHovered(null);
      setNaming(null);
      return;
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, onMove, onClick]);
  (0, import_react8.useEffect)(() => {
    if (!active) return;
    document.body.style.cursor = "crosshair";
    return () => {
      document.body.style.cursor = "";
    };
  }, [active]);
  (0, import_react8.useEffect)(() => {
    if (!naming) return;
    const onKey = (e) => {
      if (e.key === "Escape") setNaming(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [naming]);
  if (!active) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
    hovered && !naming && (() => {
      const { rect } = hovered;
      const PAD = 2;
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "div",
        {
          id: "sb-element-picker-highlight",
          style: {
            position: "fixed",
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            border: "2px solid rgba(99,102,241,.75)",
            borderRadius: 3,
            background: "rgba(99,102,241,.06)",
            pointerEvents: "none",
            zIndex: 9800,
            boxShadow: "0 0 0 1px rgba(99,102,241,.15)"
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: {
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: 0,
            background: "rgba(99,102,241,.9)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "3px 3px 3px 0",
            whiteSpace: "nowrap",
            fontFamily: FONT_FAMILY,
            pointerEvents: "none"
          }, children: "\uD074\uB9AD\uD558\uC5EC \uC2A4\uD399 \uC791\uC131" })
        }
      );
    })(),
    naming && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      NamingPopup,
      {
        rect: naming.rect,
        initialName: naming.initialName,
        onConfirm: (name) => {
          const { pinX, pinY } = naming;
          setNaming(null);
          onSelectElement(name, name, pinX, pinY);
        },
        onCancel: () => setNaming(null)
      }
    )
  ] });
}

// src/SpecDrawer.tsx
var import_react9 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
var DRAWER_W = 350;
var SCREEN_LIST_W = 280;
var STATUS_CFG = {
  planned: { label: "\uC608\uC815", color: "#94a3b8" },
  draft: { label: "\uC791\uC131", color: "#60a5fa" },
  review: { label: "\uAC80\uD1A0", color: "#a78bfa" },
  changed: { label: "\uBCC0\uACBD", color: "#fb923c" },
  confirmed: { label: "\uD655\uC815", color: "#4ade80" },
  deprecated: { label: "\uD3D0\uAE30", color: "#f87171" }
};
var ALL_STATUSES = ["planned", "draft", "review", "changed", "confirmed", "deprecated"];
var SPEC_COLOR = "#3b82f6";
var BADGE_COLOR = "#ef4444";
var CHANGELOG_COLORS = [
  { bg: "rgba(59,130,246,.20)", fg: "#93c5fd", bd: "rgba(59,130,246,.30)" },
  // blue
  { bg: "rgba(16,185,129,.20)", fg: "#6ee7b7", bd: "rgba(16,185,129,.30)" },
  // emerald
  { bg: "rgba(245,158,11,.20)", fg: "#fcd34d", bd: "rgba(245,158,11,.30)" },
  // amber
  { bg: "rgba(239,68,68,.20)", fg: "#fca5a5", bd: "rgba(239,68,68,.30)" },
  // red
  { bg: "rgba(168,85,247,.20)", fg: "#c4b5fd", bd: "rgba(168,85,247,.30)" },
  // violet
  { bg: "rgba(236,72,153,.20)", fg: "#f9a8d4", bd: "rgba(236,72,153,.30)" },
  // pink
  { bg: "rgba(20,184,166,.20)", fg: "#5eead4", bd: "rgba(20,184,166,.30)" },
  // teal
  { bg: "rgba(249,115,22,.20)", fg: "#fdba74", bd: "rgba(249,115,22,.30)" },
  // orange
  { bg: "rgba(99,102,241,.20)", fg: "#a5b4fc", bd: "rgba(99,102,241,.30)" },
  // indigo
  { bg: "rgba(234,179,8,.20)", fg: "#fde047", bd: "rgba(234,179,8,.30)" }
  // yellow
];
function fmtDate(iso) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}.${dd} ${hh}:${mi}`;
}
function fmtDateOnly(iso) {
  const d = new Date(iso);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}
function todayIso() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ScreenSelector({ screens, currentPageId, onSelect }) {
  const [open, setOpen] = (0, import_react9.useState)(false);
  const ref = (0, import_react9.useRef)(null);
  const current = screens.find((s) => s.pageId === currentPageId);
  (0, import_react9.useEffect)(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  if (screens.length <= 1) return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: DARK.txt, fontFamily: FONT_FAMILY }, children: current?.title || currentPageId });
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { ref, style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { onClick: () => setOpen((v) => !v), style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: DARK.bg3,
      border: `1px solid ${DARK.brd}`,
      borderRadius: 2,
      padding: "3px 8px",
      cursor: "pointer",
      color: DARK.txt,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: FONT_FAMILY
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: current?.title || currentPageId }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 7, opacity: 0.5 }, children: "\u25BE" })
    ] }),
    open && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      zIndex: 100,
      background: DARK.bg2,
      border: `1px solid ${DARK.brd}`,
      borderRadius: 3,
      overflow: "hidden",
      minWidth: 180,
      boxShadow: "0 8px 24px rgba(0,0,0,.5)"
    }, children: screens.map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        onClick: () => {
          onSelect(s.pageId);
          setOpen(false);
        },
        style: {
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "8px 12px",
          border: "none",
          background: s.pageId === currentPageId ? `${SPEC_COLOR}18` : "transparent",
          color: s.pageId === currentPageId ? SPEC_COLOR : DARK.txS,
          fontSize: 11,
          cursor: "pointer",
          fontFamily: FONT_FAMILY,
          fontWeight: s.pageId === currentPageId ? 700 : 400
        },
        onMouseEnter: (e) => {
          if (s.pageId !== currentPageId) e.currentTarget.style.background = DARK.bg3;
        },
        onMouseLeave: (e) => {
          if (s.pageId !== currentPageId) e.currentTarget.style.background = "transparent";
        },
        children: s.title || s.pageId
      },
      s.pageId
    )) })
  ] });
}
function ChangelogEntryCard({ entry, canDelete, onDelete, isLast }) {
  const [hovered, setHovered] = (0, import_react9.useState)(false);
  const [confirming, setConfirming] = (0, import_react9.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        setConfirming(false);
      },
      style: {
        padding: "8px 14px",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,.05)",
        background: confirming ? "rgba(239,68,68,.06)" : hovered ? "rgba(255,255,255,.02)" : "transparent",
        transition: "background .1s"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }, children: [
          entry.version && (() => {
            const idx = (entry.seq > 0 ? entry.seq - 1 : 0) % 10;
            const c = CHANGELOG_COLORS[idx];
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
              fontSize: 9,
              fontWeight: 700,
              fontFamily: FONT_FAMILY,
              padding: "1px 6px",
              borderRadius: 3,
              flexShrink: 0,
              background: c.bg,
              color: c.fg,
              border: `1px solid ${c.bd}`
            }, children: entry.version });
          })(),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.28)", fontFamily: FONT_FAMILY }, children: fmtDateOnly(entry.createdAt) }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { flex: 1 } }),
          entry.author && !confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.28)", fontFamily: FONT_FAMILY }, children: entry.author }),
          canDelete && !confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => setConfirming(true),
              title: "\uC0AD\uC81C",
              style: {
                opacity: hovered ? 1 : 0,
                transition: "opacity .15s",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,.4)",
                cursor: "pointer",
                fontSize: 11,
                lineHeight: 1,
                padding: "0 2px",
                fontFamily: FONT_FAMILY
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.color = "#f87171";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.color = "rgba(255,255,255,.4)";
              },
              children: "\xD7"
            }
          ),
          confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.45)", fontFamily: FONT_FAMILY }, children: "\uC0AD\uC81C\uD560\uAE4C\uC694?" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: onDelete,
                style: {
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 3,
                  cursor: "pointer",
                  background: "rgba(239,68,68,.25)",
                  border: "1px solid rgba(239,68,68,.4)",
                  color: "#fca5a5",
                  fontFamily: FONT_FAMILY
                },
                children: "\uC0AD\uC81C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: () => setConfirming(false),
                style: {
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 3,
                  cursor: "pointer",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.15)",
                  color: "rgba(255,255,255,.45)",
                  fontFamily: FONT_FAMILY
                },
                children: "\uCDE8\uC18C"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: {
          fontSize: 11,
          color: "rgba(255,255,255,.6)",
          fontFamily: FONT_FAMILY,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }, children: entry.content })
      ]
    }
  );
}
var INPUT_STYLE = {
  width: "100%",
  boxSizing: "border-box",
  background: DARK.bg3,
  border: `1px solid rgba(255,255,255,.12)`,
  borderRadius: 3,
  padding: "5px 8px",
  color: DARK.txt,
  fontSize: 11,
  fontFamily: FONT_FAMILY,
  outline: "none"
};
function ChangelogSection({ storage, currentAuthor }) {
  const [entries, setEntries] = (0, import_react9.useState)([]);
  const [open, setOpen] = (0, import_react9.useState)(false);
  const [adding, setAdding] = (0, import_react9.useState)(false);
  const [formDate, setFormDate] = (0, import_react9.useState)("");
  const [formVersion, setFormVersion] = (0, import_react9.useState)("");
  const [formContent, setFormContent] = (0, import_react9.useState)("");
  const [formAuthor, setFormAuthor] = (0, import_react9.useState)("");
  const [saving, setSaving] = (0, import_react9.useState)(false);
  const [saveError, setSaveError] = (0, import_react9.useState)(null);
  (0, import_react9.useEffect)(() => {
    if (!storage.loadChangelog) return;
    storage.loadChangelog().then((e) => {
      setEntries(e);
    }).catch(() => {
    });
  }, [storage]);
  const openForm = () => {
    setFormDate(todayIso());
    setFormVersion("");
    setFormContent("");
    setFormAuthor(currentAuthor || "");
    setSaveError(null);
    setAdding(true);
    setOpen(true);
  };
  const closeForm = () => {
    setAdding(false);
    setSaveError(null);
  };
  const handleAdd = async () => {
    if (!formContent.trim() || !storage.addChangelogEntry) return;
    setSaving(true);
    setSaveError(null);
    try {
      const entry = await storage.addChangelogEntry(
        formContent.trim(),
        formAuthor.trim() || null,
        formDate || null,
        formVersion.trim() || null
      );
      setEntries((prev) => [entry, ...prev]);
      closeForm();
      setOpen(true);
    } catch (e) {
      console.error("[SpecBridge] changelog save error:", e);
      setSaveError(e instanceof Error ? e.message : String(e) || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!storage.deleteChangelogEntry) return;
    try {
      await storage.deleteChangelogEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
    }
  };
  if (!storage.loadChangelog) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flexShrink: 0, borderTop: "1px solid rgba(255,255,255,.08)" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", padding: "9px 14px 8px", gap: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "button",
        {
          onClick: () => setOpen((v) => !v),
          style: { flex: 1, display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left", minWidth: 0 },
          children: [
            entries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
              entries[0].version && (() => {
                const idx = (entries[0].seq > 0 ? entries[0].seq - 1 : 0) % 10;
                const c = CHANGELOG_COLORS[idx];
                return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY,
                  flexShrink: 0,
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: c.bg,
                  color: c.fg,
                  border: `1px solid ${c.bd}`
                }, children: entries[0].version });
              })(),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, color: "rgba(255,255,255,.45)", fontFamily: FONT_FAMILY, flexShrink: 0 }, children: fmtDateOnly(entries[0].createdAt) })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".4px", fontFamily: FONT_FAMILY }, children: "\uBCC0\uACBD \uC774\uB825" }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 8, color: "rgba(255,255,255,.22)", marginLeft: 2 }, children: open ? "\u25B2" : "\u25BC" })
          ]
        }
      ),
      storage.addChangelogEntry && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "button",
        {
          onClick: () => adding ? closeForm() : openForm(),
          title: adding ? "\uC785\uB825 \uCDE8\uC18C" : "\uC774\uB825 \uCD94\uAC00",
          style: {
            width: 20,
            height: 20,
            borderRadius: 3,
            fontSize: 14,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: adding ? `${SPEC_COLOR}22` : "transparent",
            border: `1px solid ${adding ? SPEC_COLOR : "rgba(255,255,255,.12)"}`,
            color: adding ? SPEC_COLOR : "rgba(255,255,255,.4)",
            cursor: "pointer",
            transition: "all .15s"
          },
          onMouseEnter: (e) => {
            if (!adding) {
              e.currentTarget.style.borderColor = SPEC_COLOR;
              e.currentTarget.style.color = SPEC_COLOR;
            }
          },
          onMouseLeave: (e) => {
            if (!adding) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
              e.currentTarget.style.color = "rgba(255,255,255,.4)";
            }
          },
          children: adding ? "\xD7" : "+"
        }
      )
    ] }),
    adding && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.35)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: "\uBC84\uC804" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "input",
            {
              type: "text",
              value: formVersion,
              onChange: (e) => setFormVersion(e.target.value),
              placeholder: "v1.0.0",
              style: INPUT_STYLE
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flex: 2, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.35)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: "\uB0A0\uC9DC" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "input",
            {
              type: "date",
              value: formDate,
              onChange: (e) => setFormDate(e.target.value),
              style: { ...INPUT_STYLE, colorScheme: "dark" }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flex: 2, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.35)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: "\uC791\uC131\uC790" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "input",
            {
              type: "text",
              value: formAuthor,
              onChange: (e) => setFormAuthor(e.target.value),
              placeholder: "\uC791\uC131\uC790",
              style: INPUT_STYLE
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.35)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: "\uBCC0\uACBD \uB0B4\uC6A9" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "textarea",
          {
            autoFocus: true,
            value: formContent,
            onChange: (e) => setFormContent(e.target.value),
            placeholder: "\uBCC0\uACBD\uB41C \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694\u2026",
            rows: 3,
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                e.nativeEvent.stopImmediatePropagation();
                closeForm();
              }
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleAdd();
              }
            },
            style: { ...INPUT_STYLE, resize: "none", lineHeight: 1.6, overflow: "hidden", border: `1px solid ${SPEC_COLOR}55` }
          }
        )
      ] }),
      saveError && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { fontSize: 10, color: "#f87171", fontFamily: FONT_FAMILY, background: "rgba(239,68,68,.1)", borderRadius: 3, padding: "4px 8px" }, children: [
        "\u26A0 ",
        saveError
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 5, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            onClick: closeForm,
            style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, background: "transparent", border: `1px solid ${DARK.brd}`, color: DARK.txS, cursor: "pointer", fontFamily: FONT_FAMILY },
            children: "\uCDE8\uC18C"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            onClick: handleAdd,
            disabled: !formContent.trim() || saving,
            style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: SPEC_COLOR, border: "none", color: "#fff", cursor: "pointer", fontFamily: FONT_FAMILY, opacity: !formContent.trim() || saving ? 0.5 : 1 },
            children: saving ? "\uC800\uC7A5 \uC911\u2026" : "\uC800\uC7A5"
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "sb-scroll", style: { maxHeight: 220, overflowY: "auto" }, children: entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { padding: "4px 14px 12px", fontSize: 11, color: "rgba(255,255,255,.2)", fontFamily: FONT_FAMILY }, children: "\uBCC0\uACBD \uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : entries.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      ChangelogEntryCard,
      {
        entry,
        canDelete: !!storage.deleteChangelogEntry,
        onDelete: () => handleDelete(entry.id),
        isLast: idx === entries.length - 1
      },
      entry.id
    )) })
  ] });
}
function ScreenListItem({ s, isCurrent, cfg, canDelete, allAnnotations, onSelect, onDelete }) {
  const [hovered, setHovered] = (0, import_react9.useState)(false);
  const [confirming, setConfirming] = (0, import_react9.useState)(false);
  const pagePins = allAnnotations?.[s.pageId] ?? [];
  const unresolvedCount = pagePins.filter((p) => p.status !== "resolved").length;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "div",
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        setConfirming(false);
      },
      style: {
        borderBottom: "1px solid rgba(255,255,255,.05)",
        background: confirming ? "rgba(239,68,68,.06)" : isCurrent ? `${SPEC_COLOR}12` : hovered ? "rgba(255,255,255,.04)" : "transparent",
        transition: "background .1s"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "button",
        {
          onClick: onSelect,
          style: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "12px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                flex: 1,
                fontSize: 12,
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? SPEC_COLOR : s.status === "deprecated" ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.75)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: FONT_FAMILY,
                textDecoration: s.status === "deprecated" ? "line-through" : "none"
              }, children: s.title || s.pageId }),
              s.updatedAt && !confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.28)", flexShrink: 0, fontFamily: FONT_FAMILY }, children: fmtDate(s.updatedAt) }),
              canDelete && !confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setConfirming(true);
                  },
                  title: "\uC0AD\uC81C",
                  style: {
                    opacity: hovered ? 1 : 0,
                    transition: "opacity .15s",
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,.4)",
                    cursor: "pointer",
                    fontSize: 13,
                    lineHeight: 1,
                    padding: "0 2px",
                    fontFamily: FONT_FAMILY,
                    flexShrink: 0
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.color = "#f87171";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,.4)";
                  },
                  children: "\xD7"
                }
              ),
              confirming && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5 }, onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.45)", fontFamily: FONT_FAMILY }, children: "\uC0AD\uC81C\uD560\uAE4C\uC694?" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      onDelete();
                    },
                    style: {
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 3,
                      cursor: "pointer",
                      background: "rgba(239,68,68,.25)",
                      border: "1px solid rgba(239,68,68,.4)",
                      color: "#fca5a5",
                      fontFamily: FONT_FAMILY
                    },
                    children: "\uC0AD\uC81C"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      setConfirming(false);
                    },
                    style: {
                      fontSize: 9,
                      padding: "2px 8px",
                      borderRadius: 3,
                      cursor: "pointer",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,.15)",
                      color: "rgba(255,255,255,.45)",
                      fontFamily: FONT_FAMILY
                    },
                    children: "\uCDE8\uC18C"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 11, color: cfg.color, flexShrink: 0 }, children: "\u25CF" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, fontWeight: 500, color: cfg.color, flexShrink: 0, fontFamily: FONT_FAMILY }, children: cfg.label }),
              (s.updatedBy || s.createdBy) && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, color: "rgba(255,255,255,.2)", flexShrink: 0 }, children: "-" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  fontSize: 10,
                  color: "rgba(255,255,255,.4)",
                  fontFamily: FONT_FAMILY,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1
                }, children: s.updatedBy || s.createdBy })
              ] }),
              !(s.updatedBy || s.createdBy) && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { flex: 1 } }),
              unresolvedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: {
                fontSize: 9,
                fontWeight: 700,
                color: "#93c5fd",
                background: "rgba(59,130,246,.2)",
                padding: "1px 5px",
                borderRadius: 2,
                flexShrink: 0,
                fontFamily: FONT_FAMILY
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(IconChat, { size: 9, color: "#93c5fd" }),
                " ",
                unresolvedCount
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ScreenListPanel({ screens, currentPageId, onSelect, allAnnotations, storage, currentAuthor, onScreenAdded, onScreenDeleted, screensLoaded = true }) {
  const [filterStatus, setFilterStatus] = (0, import_react9.useState)(null);
  const [addOpen, setAddOpen] = (0, import_react9.useState)(false);
  const [addTitle, setAddTitle] = (0, import_react9.useState)("");
  const [addSaving, setAddSaving] = (0, import_react9.useState)(false);
  const [addError, setAddError] = (0, import_react9.useState)(null);
  const isCurrentPageRegistered = screensLoaded && screens.some((s) => s.pageId === currentPageId && s.id !== null);
  const handleSelect = (pageId) => {
    onSelect(pageId);
  };
  const openAddForm = () => {
    setAddTitle("");
    setAddError(null);
    setAddOpen(true);
  };
  const closeAddForm = () => {
    setAddOpen(false);
    setAddError(null);
  };
  const handleAddScreen = async () => {
    const title = addTitle.trim();
    if (!title) {
      setAddError("\uD654\uBA74 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    if (!storage.saveScreenSpec) return;
    setAddSaving(true);
    setAddError(null);
    try {
      const saved = await storage.saveScreenSpec(currentPageId, { title, updatedBy: currentAuthor || null });
      onScreenAdded?.(saved);
      closeAddForm();
    } catch (e) {
      const apiMsg = e && typeof e === "object" && "userMessage" in e ? e.userMessage : void 0;
      setAddError(apiMsg ?? "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4");
    } finally {
      setAddSaving(false);
    }
  };
  const handleDeleteScreen = async (pageId) => {
    if (!storage.deleteScreenSpec) return;
    try {
      await storage.deleteScreenSpec(pageId);
      onScreenDeleted?.(pageId);
    } catch {
    }
  };
  const statusCounts = (0, import_react9.useMemo)(
    () => ALL_STATUSES.reduce((acc, s) => {
      acc[s] = screens.filter((sc) => (sc.status ?? "draft") === s).length;
      return acc;
    }, {}),
    [screens]
  );
  const sortScreens = (list) => {
    const active = list.filter((s) => s.status !== "deprecated").sort((a, b) => (a.title || a.pageId).localeCompare(b.title || b.pageId, "ko"));
    const deprecated = list.filter((s) => s.status === "deprecated").sort((a, b) => (a.title || a.pageId).localeCompare(b.title || b.pageId, "ko"));
    return [...active, ...deprecated];
  };
  const filtered = sortScreens(filterStatus ? screens.filter((s) => (s.status ?? "draft") === filterStatus) : screens);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      "data-sb-ui": "true",
      style: {
        position: "fixed",
        top: 0,
        right: DRAWER_W,
        bottom: 45,
        width: 280,
        background: DARK.bg2,
        borderLeft: `1px solid ${DARK.brd}`,
        boxShadow: "-8px 0 32px rgba(0,0,0,.35)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9994,
        fontFamily: FONT_FAMILY,
        animation: "sbSlideLeft .15s ease"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("style", { children: `@keyframes sbSlideLeft{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}` }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
          display: "flex",
          alignItems: "center",
          padding: "14px 16px 12px",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { flex: 1, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)", fontFamily: FONT_FAMILY }, children: [
            "\uD654\uBA74 \uBAA9\uB85D",
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { marginLeft: 6, fontSize: 10, color: "rgba(255,255,255,.3)", fontWeight: 400 }, children: filterStatus ? `${filtered.length} / ${screens.length}` : screens.length })
          ] }),
          storage.saveScreenSpec && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => {
                if (!screensLoaded || isCurrentPageRegistered) return;
                addOpen ? closeAddForm() : openAddForm();
              },
              title: addOpen ? "\uCDE8\uC18C" : !screensLoaded ? "\uB85C\uB529 \uC911\u2026" : isCurrentPageRegistered ? "\uC774\uBBF8 \uB4F1\uB85D\uB41C \uD654\uBA74\uC785\uB2C8\uB2E4" : "\uD604\uC7AC \uD654\uBA74 \uB4F1\uB85D",
              disabled: (!screensLoaded || isCurrentPageRegistered) && !addOpen,
              style: {
                width: 22,
                height: 22,
                borderRadius: 3,
                fontSize: 15,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: addOpen ? `${SPEC_COLOR}22` : "transparent",
                border: `1px solid ${addOpen ? SPEC_COLOR : "rgba(255,255,255,.15)"}`,
                color: addOpen ? SPEC_COLOR : !screensLoaded || isCurrentPageRegistered ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.45)",
                cursor: (!screensLoaded || isCurrentPageRegistered) && !addOpen ? "default" : "pointer",
                transition: "all .15s",
                flexShrink: 0
              },
              onMouseEnter: (e) => {
                if (!addOpen && screensLoaded && !isCurrentPageRegistered) {
                  e.currentTarget.style.borderColor = SPEC_COLOR;
                  e.currentTarget.style.color = SPEC_COLOR;
                }
              },
              onMouseLeave: (e) => {
                if (!addOpen) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                  e.currentTarget.style.color = screensLoaded && !isCurrentPageRegistered ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.2)";
                }
              },
              children: addOpen ? "\xD7" : "+"
            }
          )
        ] }),
        addOpen && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, borderBottom: `1px solid ${DARK.brd}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.35)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: [
              "\uD654\uBA74 \uC774\uB984 ",
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { color: "#f87171" }, children: "*" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "input",
              {
                autoFocus: true,
                type: "text",
                value: addTitle,
                onChange: (e) => setAddTitle(e.target.value),
                placeholder: "\uC608: \uB300\uC2DC\uBCF4\uB4DC, \uC8FC\uBB38 \uBAA9\uB85D\u2026",
                onKeyDown: (e) => {
                  if (e.key === "Escape") {
                    e.nativeEvent.stopImmediatePropagation();
                    closeAddForm();
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddScreen();
                  }
                },
                style: INPUT_STYLE
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { fontSize: 9, color: "rgba(255,255,255,.25)", fontFamily: FONT_FAMILY, marginBottom: 3 }, children: [
              "\uC2DD\uBCC4\uC790 ",
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { color: "rgba(255,255,255,.2)", fontWeight: 400 }, children: "(\uD604\uC7AC \uD398\uC774\uC9C0)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "input",
              {
                type: "text",
                value: currentPageId,
                disabled: true,
                readOnly: true,
                style: {
                  ...INPUT_STYLE,
                  color: "rgba(255,255,255,.25)",
                  background: "rgba(255,255,255,.03)",
                  cursor: "default",
                  userSelect: "all"
                }
              }
            )
          ] }),
          addError && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { fontSize: 10, color: "#f87171", fontFamily: FONT_FAMILY, background: "rgba(239,68,68,.1)", borderRadius: 3, padding: "4px 8px" }, children: [
            "\u26A0 ",
            addError
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 5, justifyContent: "flex-end" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: closeAddForm,
                style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, background: "transparent", border: `1px solid ${DARK.brd}`, color: DARK.txS, cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uCDE8\uC18C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: handleAddScreen,
                disabled: !addTitle.trim() || addSaving,
                style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: SPEC_COLOR, border: "none", color: "#fff", cursor: "pointer", fontFamily: FONT_FAMILY, opacity: !addTitle.trim() || addSaving ? 0.5 : 1 },
                children: addSaving ? "\uC800\uC7A5 \uC911\u2026" : "\uCD94\uAC00"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ (() => {
            const isActive = filterStatus === null;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: () => setFilterStatus(null),
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? "rgba(255,255,255,.7)" : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "border-color .15s"
                },
                onMouseEnter: (e) => {
                  if (!isActive) e.currentTarget.style.borderBottomColor = "rgba(255,255,255,.2)";
                },
                onMouseLeave: (e) => {
                  if (!isActive) e.currentTarget.style.borderBottomColor = "transparent";
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.4)" }, children: "\uC804\uCCB4" })
              }
            );
          })(),
          ALL_STATUSES.map((status) => {
            const cfg = STATUS_CFG[status];
            const count = statusCounts[status];
            const isActive = filterStatus === status;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "button",
              {
                onClick: () => setFilterStatus((prev) => prev === status ? null : status),
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? cfg.color : "transparent"}`,
                  cursor: "pointer",
                  opacity: count === 0 ? 0.3 : 1,
                  fontFamily: FONT_FAMILY,
                  transition: "border-color .15s"
                },
                onMouseEnter: (e) => {
                  if (!isActive) e.currentTarget.style.borderBottomColor = `${cfg.color}55`;
                },
                onMouseLeave: (e) => {
                  if (!isActive) e.currentTarget.style.borderBottomColor = "transparent";
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? cfg.color : "rgba(255,255,255,.4)"
                }, children: cfg.label })
              },
              status
            );
          })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto" }, children: [
          filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { padding: "20px 16px", color: "rgba(255,255,255,.25)", fontSize: 12 }, children: "\uD574\uB2F9 \uC0C1\uD0DC\uC758 \uD654\uBA74\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }),
          filtered.map((s) => {
            const isCurrent = s.pageId === currentPageId;
            const cfg = STATUS_CFG[s.status ?? "draft"] ?? STATUS_CFG.draft;
            const canDelete = !!storage.deleteScreenSpec && s.id !== null;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              ScreenListItem,
              {
                s,
                isCurrent,
                cfg,
                canDelete,
                allAnnotations,
                onSelect: () => handleSelect(s.pageId),
                onDelete: () => handleDeleteScreen(s.pageId)
              },
              s.pageId
            );
          })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ChangelogSection, { storage, currentAuthor })
      ]
    }
  );
}
function ScreenSpecTab({ pageId, storage, currentAuthor, onDeleteElement, refreshKey, onScreenSpecSaved, externalTitle, onSoftDeleteElement, onRestoreElement, onHoverElement, onElementSaved }) {
  const [screen, setScreen] = (0, import_react9.useState)(null);
  const [elements, setElements] = (0, import_react9.useState)([]);
  const [feedback, setFeedback] = (0, import_react9.useState)(null);
  const [hoveredItemId, setHoveredItemId] = (0, import_react9.useState)(null);
  const [renamingId, setRenamingId] = (0, import_react9.useState)(null);
  const [renameValue, setRenameValue] = (0, import_react9.useState)("");
  const [editingContentId, setEditingContentId] = (0, import_react9.useState)(null);
  const [editContent, setEditContent] = (0, import_react9.useState)("");
  const [collapsedIds, setCollapsedIds] = (0, import_react9.useState)(/* @__PURE__ */ new Set());
  const [softDeletedIds, setSoftDeletedIds] = (0, import_react9.useState)(/* @__PURE__ */ new Set());
  const [editingTitle, setEditingTitle] = (0, import_react9.useState)(false);
  const [editTitleValue, setEditTitleValue] = (0, import_react9.useState)("");
  const [editingDesc, setEditingDesc] = (0, import_react9.useState)(false);
  const [editDescValue, setEditDescValue] = (0, import_react9.useState)("");
  const [editingAuthor, setEditingAuthor] = (0, import_react9.useState)(false);
  const [editAuthorValue, setEditAuthorValue] = (0, import_react9.useState)("");
  (0, import_react9.useEffect)(() => {
    if (storage.loadScreenSpec) storage.loadScreenSpec(pageId).then(setScreen).catch(() => {
    });
    if (storage.loadPageSpecs) storage.loadPageSpecs(pageId).then(setElements).catch(() => {
    });
  }, [pageId, storage, refreshKey]);
  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 2500);
  };
  const saveScreen = async (patch) => {
    if (!storage.saveScreenSpec) return;
    try {
      const saved = await storage.saveScreenSpec(pageId, {
        title: screen?.title,
        description: screen?.description,
        status: screen?.status ?? "draft",
        updatedBy: currentAuthor || null,
        ...patch
      });
      setScreen(saved);
      onScreenSpecSaved?.(saved);
      showFeedback("ok", "\uC800\uC7A5\uB428");
    } catch (e) {
      showFeedback("err", e instanceof Error ? e.message : "\uC800\uC7A5 \uC2E4\uD328");
    }
  };
  const saveElement = async (spec, patch) => {
    if (!storage.savePageSpec) return;
    const saved = await storage.savePageSpec(pageId, spec.elementId, { ...patch, updatedBy: currentAuthor || null });
    setElements((prev) => prev.map((e) => e.id === spec.id ? saved : e));
    onElementSaved?.(saved);
    if (storage.saveScreenSpec) {
      const updatedScreen = await storage.saveScreenSpec(pageId, {
        title: screen?.title,
        description: screen?.description,
        status: screen?.status ?? "draft",
        updatedBy: currentAuthor || null
      });
      setScreen(updatedScreen);
      onScreenSpecSaved?.(updatedScreen);
    }
  };
  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const softDeleteElement = (spec) => {
    setSoftDeletedIds((prev) => /* @__PURE__ */ new Set([...prev, spec.id]));
    if (editingContentId === spec.id) setEditingContentId(null);
    onSoftDeleteElement?.(spec.id);
  };
  const hardDeleteElement = async (spec) => {
    const name = spec.elementLabel ?? spec.elementId;
    if (!window.confirm(`"${name}" \uC694\uC18C\uB97C \uC644\uC804\uD788 \uC0AD\uC81C\uD569\uB2C8\uB2E4.
\uC0AD\uC81C \uD6C4 \uBCF5\uAD6C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)) return;
    try {
      await storage.deletePageSpec?.(spec.id);
      setElements((prev) => prev.filter((e) => e.id !== spec.id));
      setSoftDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(spec.id);
        return next;
      });
      onDeleteElement?.(spec.id);
    } catch (e) {
      showFeedback("err", e instanceof Error ? e.message : "\uC0AD\uC81C \uC2E4\uD328");
    }
  };
  const restoreElement = (spec) => {
    setSoftDeletedIds((prev) => {
      const next = new Set(prev);
      next.delete(spec.id);
      return next;
    });
    onRestoreElement?.(spec.id);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", padding: "16px 8px 8px 8px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 8, paddingLeft: 4, paddingRight: 4 }, children: ALL_STATUSES.map((s) => {
        const cfg = STATUS_CFG[s];
        const isActive = (screen?.status ?? "draft") === s;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            onClick: () => saveScreen({ status: s }),
            style: {
              flex: 1,
              padding: "0",
              height: 26,
              borderRadius: 3,
              fontSize: 10,
              fontWeight: 700,
              border: `1px solid ${isActive ? cfg.color : DARK.brd}`,
              background: isActive ? `${cfg.color}22` : "transparent",
              color: isActive ? cfg.color : DARK.txL,
              cursor: "pointer",
              fontFamily: FONT_FAMILY,
              transition: "all .15s"
            },
            onMouseEnter: (e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = cfg.color;
                e.currentTarget.style.color = cfg.color;
              }
            },
            onMouseLeave: (e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = DARK.brd;
                e.currentTarget.style.color = DARK.txL;
              }
            },
            children: cfg.label
          },
          s
        );
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { borderTop: `1px solid ${DARK.brd}`, margin: "8px 4px" } }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { marginBottom: 6, paddingLeft: 4, paddingRight: 4 }, children: editingTitle ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "input",
        {
          autoFocus: true,
          value: editTitleValue,
          onChange: (e) => setEditTitleValue(e.target.value),
          onBlur: () => {
            const t = editTitleValue.trim();
            if (t) saveScreen({ title: t });
            setEditingTitle(false);
          },
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              e.nativeEvent.stopImmediatePropagation();
              setEditingTitle(false);
            }
            if (e.key === "Enter") {
              e.preventDefault();
              const t = editTitleValue.trim();
              if (t) saveScreen({ title: t });
              setEditingTitle(false);
            }
          },
          style: {
            width: "100%",
            boxSizing: "border-box",
            background: DARK.bg3,
            border: `1px solid ${SPEC_COLOR}66`,
            borderRadius: 3,
            padding: "4px 8px",
            color: DARK.txt,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT_FAMILY,
            outline: "none"
          }
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "span",
          {
            onDoubleClick: () => {
              setEditingTitle(true);
              setEditTitleValue(externalTitle ?? screen?.title ?? pageId);
            },
            title: "\uB354\uBE14\uD074\uB9AD\uD558\uC5EC \uC218\uC815",
            style: { fontSize: 18, fontWeight: 700, color: DARK.txt, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "text" },
            children: externalTitle ?? screen?.title ?? pageId
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }, children: [
          screen?.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, color: DARK.txL, fontFamily: FONT_FAMILY }, children: fmtDate(screen.updatedAt) }),
          editingAuthor ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "input",
            {
              autoFocus: true,
              value: editAuthorValue,
              onChange: (e) => setEditAuthorValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Escape") {
                  e.nativeEvent.stopImmediatePropagation();
                  setEditingAuthor(false);
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = editAuthorValue.trim();
                  if (v) saveScreen({ updatedBy: v });
                  setEditingAuthor(false);
                }
              },
              onBlur: () => {
                const v = editAuthorValue.trim();
                if (v) saveScreen({ updatedBy: v });
                setEditingAuthor(false);
              },
              style: {
                fontSize: 10,
                width: 80,
                padding: "1px 5px",
                borderRadius: 3,
                background: "rgba(255,255,255,.08)",
                border: `1px solid ${SPEC_COLOR}66`,
                color: "rgba(255,255,255,.8)",
                fontFamily: FONT_FAMILY,
                outline: "none"
              }
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "span",
            {
              onDoubleClick: () => {
                setEditAuthorValue(screen?.updatedBy || screen?.createdBy || "");
                setEditingAuthor(true);
              },
              title: "\uB354\uBE14\uD074\uB9AD\uD558\uC5EC \uC791\uC131\uC790 \uBCC0\uACBD",
              style: {
                fontSize: 10,
                color: SPEC_COLOR,
                fontFamily: FONT_FAMILY,
                cursor: "text"
              },
              children: screen?.updatedBy || screen?.createdBy || "\uC791\uC131\uC790"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { marginBottom: 6, paddingLeft: 4, paddingRight: 4 }, children: editingDesc ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "textarea",
          {
            autoFocus: true,
            value: editDescValue,
            onChange: (e) => {
              setEditDescValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            },
            ref: (el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }
            },
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                e.nativeEvent.stopImmediatePropagation();
                setEditingDesc(false);
              }
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                saveScreen({ description: editDescValue.trim() });
                setEditingDesc(false);
              }
            },
            placeholder: "\uD654\uBA74 \uC804\uBC18\uC5D0 \uB300\uD55C \uC124\uBA85\u2026",
            style: {
              width: "100%",
              boxSizing: "border-box",
              resize: "none",
              overflow: "hidden",
              background: DARK.bg3,
              border: `1px solid ${SPEC_COLOR}66`,
              borderRadius: 3,
              padding: "5px 8px",
              color: DARK.txt,
              fontSize: 11,
              fontFamily: FONT_FAMILY,
              outline: "none",
              lineHeight: 1.6,
              minHeight: 56
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 5, justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => setEditingDesc(false),
              style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, background: "transparent", border: `1px solid ${DARK.brd}`, color: DARK.txS, cursor: "pointer", fontFamily: FONT_FAMILY },
              children: "\uCDE8\uC18C"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => {
                saveScreen({ description: editDescValue.trim() });
                setEditingDesc(false);
              },
              style: { padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 600, background: SPEC_COLOR, border: "none", color: "#fff", cursor: "pointer", fontFamily: FONT_FAMILY },
              children: "\uC800\uC7A5"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "div",
        {
          onDoubleClick: () => {
            setEditingDesc(true);
            setEditDescValue(screen?.description ?? "");
          },
          title: "\uB354\uBE14\uD074\uB9AD\uD558\uC5EC \uC218\uC815",
          style: {
            fontSize: 11,
            color: screen?.description ? DARK.txS : DARK.txL,
            lineHeight: 1.6,
            cursor: "text",
            fontFamily: FONT_FAMILY,
            minHeight: 36,
            whiteSpace: "pre-wrap"
          },
          children: screen?.description || "\uB354\uBE14 \uD074\uB9AD \uD558\uBA74 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { borderTop: "none", borderBottom: `3px solid ${DARK.brd}`, margin: "8px 4px" } }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { padding: "4px 4px 6px", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { flex: 1, fontSize: 10, color: DARK.txL, fontFamily: FONT_FAMILY, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }, children: [
          "\uC694\uC18C \uC2A4\uD399 ",
          elements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { fontWeight: 400 }, children: [
            "(",
            elements.length,
            ")"
          ] })
        ] }),
        elements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 2 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => setCollapsedIds(new Set(elements.map((e) => e.id))),
              style: { border: `1px solid ${DARK.brd}`, background: "transparent", color: DARK.txL, cursor: "pointer", fontSize: 10, fontFamily: FONT_FAMILY, padding: "2px 6px", borderRadius: 3 },
              onMouseEnter: (e) => {
                e.currentTarget.style.color = SPEC_COLOR;
                e.currentTarget.style.borderColor = SPEC_COLOR;
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.color = DARK.txL;
                e.currentTarget.style.borderColor = DARK.brd;
              },
              children: "\uC811\uAE30"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              onClick: () => setCollapsedIds(/* @__PURE__ */ new Set()),
              style: { border: `1px solid ${DARK.brd}`, background: "transparent", color: DARK.txL, cursor: "pointer", fontSize: 10, fontFamily: FONT_FAMILY, padding: "2px 6px", borderRadius: 3 },
              onMouseEnter: (e) => {
                e.currentTarget.style.color = SPEC_COLOR;
                e.currentTarget.style.borderColor = SPEC_COLOR;
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.color = DARK.txL;
                e.currentTarget.style.borderColor = DARK.brd;
              },
              children: "\uD3BC\uCE58\uAE30"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto" }, children: [
      elements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
        textAlign: "center",
        color: DARK.txL,
        fontSize: 11,
        marginTop: 24,
        lineHeight: 1.8,
        fontFamily: FONT_FAMILY
      }, children: [
        '"+ \uCD94\uAC00"\uB97C \uB20C\uB7EC',
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("br", {}),
        "\uD654\uBA74 \uC694\uC18C\uB97C \uC120\uD0DD\uD558\uC138\uC694"
      ] }),
      [...elements].sort((a, b) => (a.num ?? Infinity) - (b.num ?? Infinity)).map((spec, idx) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "div",
        {
          onMouseEnter: () => {
            setHoveredItemId(spec.id);
            onHoverElement?.(spec.elementId);
          },
          onMouseLeave: () => {
            setHoveredItemId(null);
            onHoverElement?.(null);
          },
          style: {
            padding: "10px 4px",
            borderBottom: idx < elements.length - 1 ? `1px solid ${DARK.brd}` : "none",
            background: softDeletedIds.has(spec.id) ? "rgba(239,68,68,.06)" : hoveredItemId === spec.id ? "rgba(59,130,246,.08)" : "transparent",
            cursor: "pointer",
            transition: "background .15s"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: collapsedIds.has(spec.id) ? 0 : 4 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "div",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    if (renamingId !== spec.id) toggleCollapse(spec.id);
                  },
                  style: {
                    width: 18,
                    height: 18,
                    borderRadius: collapsedIds.has(spec.id) ? "50% 50% 0 50%" : "50%",
                    background: BADGE_COLOR,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT_FAMILY,
                    transition: "border-radius .2s",
                    cursor: "pointer"
                  },
                  children: spec.num ?? "\xB7"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: renamingId === spec.id ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "input",
                {
                  autoFocus: true,
                  value: renameValue,
                  onClick: (e) => e.stopPropagation(),
                  onChange: (e) => setRenameValue(e.target.value),
                  onKeyDown: (e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      const t = renameValue.trim();
                      if (t) saveElement(spec, { elementLabel: t });
                      setRenamingId(null);
                    }
                    if (e.key === "Escape") {
                      e.nativeEvent.stopImmediatePropagation();
                      setRenamingId(null);
                    }
                  },
                  onBlur: () => {
                    const t = renameValue.trim();
                    if (t && t !== (spec.elementLabel ?? spec.elementId)) saveElement(spec, { elementLabel: t });
                    setRenamingId(null);
                  },
                  style: {
                    width: "100%",
                    fontSize: 12,
                    fontWeight: 600,
                    background: DARK.bg3,
                    border: `1px solid ${SPEC_COLOR}66`,
                    borderRadius: 3,
                    padding: "1px 6px",
                    color: DARK.txt,
                    fontFamily: FONT_FAMILY,
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "span",
                {
                  onDoubleClick: (e) => {
                    e.stopPropagation();
                    setRenamingId(spec.id);
                    setRenameValue(spec.elementLabel ?? spec.elementId);
                  },
                  title: "\uB354\uBE14\uD074\uB9AD\uD558\uC5EC \uC774\uB984 \uC218\uC815",
                  style: {
                    fontSize: 12,
                    fontWeight: 600,
                    color: softDeletedIds.has(spec.id) ? DARK.txL : DARK.txt,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: FONT_FAMILY,
                    display: "block",
                    textDecoration: softDeletedIds.has(spec.id) ? "line-through" : "none"
                  },
                  children: spec.elementLabel ?? spec.elementId
                }
              ) }),
              spec.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                fontSize: 9,
                color: DARK.txL,
                fontFamily: FONT_FAMILY,
                flexShrink: 0,
                whiteSpace: "nowrap"
              }, children: fmtDate(spec.updatedAt) }),
              softDeletedIds.has(spec.id) ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      hardDeleteElement(spec);
                    },
                    style: { fontSize: 10, fontFamily: FONT_FAMILY, padding: "2px 6px", borderRadius: 3, cursor: "pointer", border: "1px solid rgba(239,68,68,.4)", background: "transparent", color: "#f87171" },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,.18)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                    },
                    children: "\uC0AD\uC81C"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      restoreElement(spec);
                    },
                    style: { fontSize: 10, fontFamily: FONT_FAMILY, padding: "2px 6px", borderRadius: 3, cursor: "pointer", border: `1px solid ${SPEC_COLOR}66`, background: "transparent", color: SPEC_COLOR },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = `${SPEC_COLOR}18`;
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                    },
                    children: "\uBCF5\uC6D0"
                  }
                )
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    softDeleteElement(spec);
                  },
                  title: "\uC694\uC18C \uC0AD\uC81C",
                  style: {
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    border: "1px solid transparent",
                    background: "transparent",
                    color: DARK.txL,
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    padding: 0,
                    opacity: hoveredItemId === spec.id ? 1 : 0.35,
                    transition: "opacity .15s, background .15s, border-color .15s, color .15s"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,.18)";
                    e.currentTarget.style.borderColor = "rgba(239,68,68,.4)";
                    e.currentTarget.style.color = "#f87171";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.color = DARK.txL;
                  },
                  children: "\xD7"
                }
              )
            ] }),
            !collapsedIds.has(spec.id) && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { paddingLeft: 24 }, children: editingContentId === spec.id ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "textarea",
                {
                  autoFocus: true,
                  value: editContent,
                  onChange: (e) => {
                    setEditContent(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  },
                  ref: (el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Escape") {
                      e.nativeEvent.stopImmediatePropagation();
                      setEditingContentId(null);
                    }
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      saveElement(spec, { content: editContent });
                      setEditingContentId(null);
                    }
                  },
                  placeholder: "\uC2A4\uD399 \uB0B4\uC6A9\u2026",
                  style: {
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "none",
                    overflow: "hidden",
                    background: DARK.bg3,
                    border: `1px solid ${SPEC_COLOR}66`,
                    borderRadius: 3,
                    padding: "5px 8px",
                    color: DARK.txt,
                    fontSize: 11,
                    fontFamily: FONT_FAMILY,
                    outline: "none",
                    lineHeight: 1.6,
                    minHeight: 36
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", gap: 5, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: () => setEditingContentId(null),
                    style: {
                      padding: "3px 10px",
                      borderRadius: 3,
                      fontSize: 10,
                      background: "transparent",
                      border: `1px solid ${DARK.brd}`,
                      color: DARK.txS,
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY
                    },
                    children: "\uCDE8\uC18C"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                  "button",
                  {
                    onClick: () => {
                      saveElement(spec, { content: editContent });
                      setEditingContentId(null);
                    },
                    style: {
                      padding: "3px 10px",
                      borderRadius: 3,
                      fontSize: 10,
                      fontWeight: 600,
                      background: SPEC_COLOR,
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY
                    },
                    children: "\uC800\uC7A5"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "div",
              {
                onDoubleClick: () => {
                  setEditingContentId(spec.id);
                  setEditContent(spec.content ?? "");
                },
                title: "\uB354\uBE14\uD074\uB9AD\uD558\uC5EC \uB0B4\uC6A9 \uC218\uC815",
                style: {
                  fontSize: 11,
                  color: spec.content ? DARK.txS : DARK.txL,
                  lineHeight: 1.6,
                  cursor: "text",
                  fontFamily: FONT_FAMILY,
                  minHeight: 20,
                  whiteSpace: "pre-wrap",
                  textDecoration: softDeletedIds.has(spec.id) ? "line-through" : "none"
                },
                children: spec.content || "\uB354\uBE14 \uD074\uB9AD \uD558\uBA74 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
              }
            ) })
          ]
        },
        spec.id
      ))
    ] }),
    feedback && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
      padding: "5px 16px",
      fontSize: 10,
      fontFamily: FONT_FAMILY,
      color: feedback.type === "ok" ? "#4ade80" : "#f87171",
      background: feedback.type === "ok" ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)",
      borderTop: `1px solid ${DARK.brd}`,
      flexShrink: 0
    }, children: [
      feedback.type === "ok" ? "\u2713 " : "\u26A0 ",
      feedback.msg
    ] })
  ] });
}
function CommentTab({ pins, labels, screenTitle, screenUpdatedAt, screenDescription, selectedId, hoveredId, showResolved, resolvedCount, onSelect, onHover, onToggleShowResolved, sessions, currentSessionId, sessionProgress, onSelectSession, onCreateSession, onDeleteSession, onSetSessionStatus, onUpdateSession }) {
  const labelById = new Map(labels.map((l) => [l.id, l]));
  const [authorFilter, setAuthorFilter] = (0, import_react9.useState)(null);
  const [labelFilterIds, setLabelFilterIds] = (0, import_react9.useState)(/* @__PURE__ */ new Set());
  const uniqueAuthors = Array.from(new Set(pins.map((p) => p.author).filter((a) => !!a)));
  const resolvedTotal = pins.filter((p) => p.status === "resolved").length;
  const basePins = showResolved ? pins : pins.filter((p) => p.status !== "resolved");
  const labelFiltered = labelFilterIds.size === 0 ? basePins : basePins.filter((p) => p.labelId && labelFilterIds.has(p.labelId));
  const filtered = authorFilter ? labelFiltered.filter((p) => p.author === authorFilter) : labelFiltered;
  const currentSession = sessions?.find((s) => s.id === currentSessionId) ?? null;
  const [editingNote, setEditingNote] = (0, import_react9.useState)(false);
  const [noteValue, setNoteValue] = (0, import_react9.useState)("");
  const [labelDropOpen, setLabelDropOpen] = (0, import_react9.useState)(false);
  const labelDropRef = (0, import_react9.useRef)(null);
  (0, import_react9.useEffect)(() => {
    if (!labelDropOpen) return;
    const h = (e) => {
      if (labelDropRef.current && !labelDropRef.current.contains(e.target)) setLabelDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [labelDropOpen]);
  const toggleLabelFilter = (id) => {
    setLabelFilterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const labelTriggerText = labelFilterIds.size === 0 ? "\uC804\uCCB4" : Array.from(labelFilterIds).map((id) => labelById.get(id)?.name ?? id).join(", ");
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", padding: "16px 8px 8px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
      display: "flex",
      gap: 4,
      alignItems: "center",
      paddingLeft: 4,
      paddingRight: 4
    }, children: [
      sessions && sessions.length > 0 && onSelectSession && onCreateSession && onDeleteSession && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        SessionPicker,
        {
          sessions,
          currentSessionId: currentSessionId ?? null,
          sessionProgress,
          onSelectSession,
          onCreateSession,
          onDeleteSession,
          onSetSessionStatus,
          onUpdateSession,
          placement: "bottom"
        }
      ) }),
      labels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { ref: labelDropRef, style: { position: "relative", flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          "button",
          {
            onClick: () => setLabelDropOpen((v) => !v),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: "5px 8px",
              borderRadius: 2,
              cursor: "pointer",
              border: `1px solid ${labelFilterIds.size > 0 ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.07)"}`,
              background: labelDropOpen ? "rgba(255,255,255,.07)" : "transparent",
              color: labelFilterIds.size > 0 ? "rgba(59,130,246,.9)" : "rgba(255,255,255,.7)",
              fontSize: 11,
              fontWeight: 500,
              outline: "none",
              fontFamily: FONT_FAMILY,
              height: 26,
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              transition: "all .15s"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.07)";
              e.currentTarget.style.color = labelFilterIds.size > 0 ? "rgba(59,130,246,1)" : "rgba(255,255,255,1)";
              e.currentTarget.style.borderColor = labelFilterIds.size > 0 ? "rgba(59,130,246,.6)" : "rgba(255,255,255,.15)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = labelDropOpen ? "rgba(255,255,255,.07)" : "transparent";
              e.currentTarget.style.color = labelFilterIds.size > 0 ? "rgba(59,130,246,.9)" : "rgba(255,255,255,.7)";
              e.currentTarget.style.borderColor = labelFilterIds.size > 0 ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.07)";
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }, children: labelTriggerText }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 8, opacity: 0.6, marginLeft: 1 }, children: "\u25BE" })
            ]
          }
        ),
        labelDropOpen && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          zIndex: 200,
          background: DARK.bg2,
          border: `1px solid ${DARK.brd}`,
          borderRadius: 4,
          overflow: "hidden",
          minWidth: 120,
          boxShadow: "0 8px 24px rgba(0,0,0,.5)"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            "div",
            {
              onClick: () => setLabelFilterIds(/* @__PURE__ */ new Set()),
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                cursor: "pointer",
                background: labelFilterIds.size === 0 ? "rgba(255,255,255,.06)" : "transparent",
                borderBottom: `1px solid ${DARK.brd}`
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  width: 12,
                  fontSize: 9,
                  textAlign: "center",
                  flexShrink: 0,
                  color: labelFilterIds.size === 0 ? "rgba(255,255,255,.7)" : "transparent"
                }, children: "\u2713" }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  fontSize: 11,
                  fontFamily: FONT_FAMILY,
                  color: labelFilterIds.size === 0 ? DARK.txt : DARK.txL,
                  fontWeight: labelFilterIds.size === 0 ? 600 : 400
                }, children: "\uC804\uCCB4" })
              ]
            }
          ),
          labels.map((l) => {
            const active = labelFilterIds.has(l.id);
            const color = l.color || FALLBACK_LABEL_COLOR;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
              "div",
              {
                onClick: () => toggleLabelFilter(l.id),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                  background: active ? `${color}14` : "transparent",
                  transition: "background .1s"
                },
                onMouseEnter: (e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,.04)";
                },
                onMouseLeave: (e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                    width: 12,
                    fontSize: 9,
                    textAlign: "center",
                    flexShrink: 0,
                    color: active ? color : "transparent"
                  }, children: "\u2713" }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 } }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                    fontSize: 11,
                    fontFamily: FONT_FAMILY,
                    color: active ? color : DARK.txL,
                    fontWeight: active ? 600 : 400
                  }, children: l.name })
                ]
              },
              l.id
            );
          })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "select",
        {
          value: authorFilter ?? "",
          onChange: (e) => setAuthorFilter(e.target.value || null),
          disabled: uniqueAuthors.length === 0,
          style: {
            flex: 1,
            minWidth: 0,
            padding: "5px 8px",
            background: DARK.bg3,
            border: `1px solid ${authorFilter ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.07)"}`,
            borderRadius: 2,
            color: authorFilter ? "rgba(59,130,246,.9)" : "rgba(255,255,255,.7)",
            fontSize: 11,
            fontWeight: 500,
            cursor: uniqueAuthors.length > 0 ? "pointer" : "default",
            outline: "none",
            fontFamily: FONT_FAMILY,
            height: 26,
            transition: "all .15s",
            opacity: uniqueAuthors.length === 0 ? 0.4 : 1
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("option", { value: "", children: "\uC791\uC131\uC790" }),
            uniqueAuthors.map((a) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("option", { value: a, children: a }, a))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { borderTop: `1px solid ${DARK.brd}`, margin: "8px 4px" } }),
    screenTitle && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { marginBottom: 6, paddingLeft: 4, paddingRight: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { title: "\uD654\uBA74 \uBA85\uCE6D", style: {
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(255,255,255,.88)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: FONT_FAMILY
        }, children: screenTitle }),
        screenUpdatedAt && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 10, color: "rgba(255,255,255,.3)", flexShrink: 0, marginLeft: 8, fontFamily: FONT_FAMILY }, children: fmtDate(screenUpdatedAt) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { paddingLeft: 4, paddingRight: 4 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: {
        fontSize: 11,
        color: screenDescription ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.3)",
        lineHeight: 1.6,
        fontFamily: FONT_FAMILY,
        minHeight: 36,
        whiteSpace: "pre-wrap"
      }, children: screenDescription || "\uB354\uBE14 \uD074\uB9AD \uD558\uBA74 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { borderBottom: `3px solid ${DARK.brd}`, margin: "8px 4px" } }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { padding: "4px 4px 6px", display: "flex", alignItems: "center", flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { flex: 1, fontSize: 10, color: DARK.txL, fontFamily: FONT_FAMILY, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }, children: [
        "\uCF54\uBA58\uD2B8 ",
        filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { fontWeight: 400 }, children: [
          "(",
          filtered.length,
          ")"
        ] })
      ] }),
      resolvedTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { onClick: onToggleShowResolved, style: {
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: "3px 8px",
        borderRadius: 3,
        cursor: "pointer",
        border: `1px solid ${showResolved ? "rgba(22,163,74,.5)" : DARK.brd}`,
        background: showResolved ? "rgba(22,163,74,.15)" : "transparent",
        color: showResolved ? "#4ade80" : DARK.txL,
        fontSize: 10,
        fontWeight: 600,
        fontFamily: FONT_FAMILY
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { children: showResolved ? "\u2713" : "\u25CB" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { children: [
          "\uD574\uACB0 ",
          resolvedTotal
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto" }, children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { textAlign: "center", color: DARK.txL, fontSize: 11, marginTop: 36, lineHeight: 1.8, fontFamily: FONT_FAMILY }, children: authorFilter || labelFilterIds.size > 0 ? "\uD544\uD130 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uCF54\uBA58\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." : "\uC544\uC9C1 \uCD94\uAC00\uB41C \uCF54\uBA58\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) : filtered.map((p, idx) => {
      const sel = p.id === selectedId;
      const hov = p.id === hoveredId;
      const label = p.labelId ? labelById.get(p.labelId) : void 0;
      const color = label?.color ?? FALLBACK_LABEL_COLOR;
      const resolved = p.status === "resolved";
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
        "div",
        {
          onClick: () => onSelect(p.id),
          onMouseEnter: () => onHover?.(p.id),
          onMouseLeave: () => onHover?.(null),
          style: {
            padding: "10px 4px",
            borderBottom: idx < filtered.length - 1 ? `1px solid ${DARK.brd}` : "none",
            cursor: "pointer",
            background: sel ? `${color}1a` : hov ? "rgba(59,130,246,.12)" : "transparent",
            transition: "background .15s",
            opacity: resolved ? 0.65 : 1
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: {
                position: "relative",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: color,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY
              }, children: [
                p.num,
                resolved && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#16a34a",
                  color: "#fff",
                  fontSize: 6,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #1e1e1e"
                }, children: "\u2713" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
                fontSize: 12,
                fontWeight: 600,
                color: resolved ? DARK.txL : DARK.txt,
                fontFamily: FONT_FAMILY,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textDecoration: resolved ? "line-through" : "none"
              }, children: p.author || "\uC775\uBA85" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { flex: 1 } }),
              p.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { fontSize: 9, padding: "1px 6px", background: "rgba(59,130,246,.2)", color: "#93C5FD", borderRadius: 4, fontWeight: 700, fontFamily: FONT_FAMILY, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(IconChat, { size: 9, color: "#93C5FD" }),
                " ",
                p.comments.length
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { fontSize: 9, color: DARK.txL, fontFamily: FONT_FAMILY, flexShrink: 0 }, children: fmtDate(p.createdAt) })
            ] }),
            p.note && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { paddingLeft: 24, marginTop: 4, marginBottom: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 11, color: DARK.txL, fontFamily: FONT_FAMILY, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: p.note }) })
          ]
        },
        p.id
      );
    }) })
  ] });
}
var TABS = [
  { key: "screenSpec", label: "\uD654\uBA74 \uC2A4\uD399" },
  { key: "comment", label: "\uCF54\uBA58\uD2B8" }
];
function SpecDrawer({
  pageId,
  storage,
  currentAuthor,
  onClose,
  onDeleteElement,
  onSoftDeleteElement,
  onRestoreElement,
  onScreenSpecSaved,
  onElementSaved,
  refreshKey,
  pins = [],
  labels = [],
  selectedPinId = null,
  hoveredPinId = null,
  showResolved = false,
  resolvedCount = 0,
  onSelectPin,
  onHoverPin,
  onToggleShowResolved,
  defaultTab = "screenSpec",
  sessions,
  currentSessionId,
  sessionProgress,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onSetSessionStatus,
  onUpdateSession,
  onHoverElement,
  allAnnotations,
  onNavigate,
  onScreenListChange,
  pinned = false,
  onTogglePin
}) {
  const [tab, setTab] = (0, import_react9.useState)(defaultTab);
  const [screens, setScreens] = (0, import_react9.useState)([]);
  const [screensLoaded, setScreensLoaded] = (0, import_react9.useState)(false);
  const [activePageId, setActivePageId] = (0, import_react9.useState)(pageId);
  const [showScreenList, setShowScreenList] = (0, import_react9.useState)(() => {
    try {
      const saved = localStorage.getItem("sb_screen_list_open");
      return saved === null ? true : saved === "1";
    } catch {
      return true;
    }
  });
  const setShowScreenListPersisted = (0, import_react9.useCallback)((v) => {
    setShowScreenList(v);
    try {
      localStorage.setItem("sb_screen_list_open", v ? "1" : "0");
    } catch {
    }
    onScreenListChange?.(v);
  }, [onScreenListChange]);
  (0, import_react9.useEffect)(() => {
    const saved = localStorage.getItem("sb_screen_list_open");
    onScreenListChange?.(saved === null ? true : saved === "1");
  }, []);
  (0, import_react9.useEffect)(() => {
    if (!showScreenList) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showScreenList, onClose]);
  const handleSelectPage = (id) => {
    setActivePageId(id);
    onNavigate?.(id);
  };
  (0, import_react9.useEffect)(() => {
    if (!storage.loadScreenSpecs) {
      setScreensLoaded(true);
      return;
    }
    storage.loadScreenSpecs().then((data) => {
      setScreens(data);
      setScreensLoaded(true);
    }).catch(() => {
      setScreensLoaded(true);
    });
  }, [storage]);
  (0, import_react9.useEffect)(() => {
    setActivePageId(pageId);
  }, [pageId]);
  const allScreens = screens.some((s) => s.pageId === activePageId) ? screens : [{ id: null, pageId: activePageId, title: activePageId, description: "", status: "draft", createdAt: null, updatedAt: null }, ...screens];
  const activeScreenTitle = allScreens.find((s) => s.pageId === activePageId)?.title ?? activePageId;
  const drawerPins = allAnnotations?.[activePageId] ?? (activePageId === pageId ? pins : []);
  const handleScreenSpecSaved = (spec) => {
    setScreens((prev) => {
      const exists = prev.some((s) => s.pageId === spec.pageId);
      return exists ? prev.map((s) => s.pageId === spec.pageId ? spec : s) : [...prev, spec];
    });
    onScreenSpecSaved?.(spec);
  };
  const handleScreenDeleted = (pageId2) => {
    setScreens((prev) => prev.filter((s) => s.pageId !== pageId2));
  };
  const handleRenameScreen = async () => {
    const current = allScreens.find((s) => s.pageId === activePageId);
    const name = window.prompt("\uD654\uBA74 \uC774\uB984", current?.title || activePageId);
    if (!name?.trim() || !storage.saveScreenSpec) return;
    const saved = await storage.saveScreenSpec(activePageId, { title: name.trim(), updatedBy: currentAuthor || null });
    setScreens((prev) => {
      const exists = prev.some((s) => s.pageId === activePageId);
      return exists ? prev.map((s) => s.pageId === activePageId ? saved : s) : [...prev, saved];
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      id: "sb-spec-drawer",
      "data-sb-ui": "true",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 45,
        width: DRAWER_W,
        background: DARK.bg,
        borderLeft: `1px solid ${DARK.brd}`,
        boxShadow: "-4px 0 24px rgba(0,0,0,.3)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9995,
        fontFamily: FONT_FAMILY
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("style", { children: `
        .sb-scroll::-webkit-scrollbar{width:4px}
        .sb-scroll::-webkit-scrollbar-track{background:transparent}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:10px}
        .sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26)}
        .sb-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
      ` }),
        showScreenList && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          ScreenListPanel,
          {
            screens: allScreens,
            currentPageId: activePageId,
            onSelect: handleSelectPage,
            allAnnotations,
            storage,
            currentAuthor,
            onScreenAdded: handleScreenSpecSaved,
            onScreenDeleted: handleScreenDeleted,
            screensLoaded
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { padding: "14px 10px 0px", background: DARK.bg2, flexShrink: 0, borderBottom: `1px solid ${DARK.brd}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7, minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "button",
                {
                  onClick: () => setShowScreenListPersisted(!showScreenList),
                  title: "\uD654\uBA74 \uBAA9\uB85D",
                  style: {
                    background: showScreenList ? `${SPEC_COLOR}22` : "transparent",
                    border: `1px solid ${showScreenList ? SPEC_COLOR : DARK.brd}`,
                    borderRadius: 2,
                    color: showScreenList ? SPEC_COLOR : DARK.txL,
                    fontSize: 10,
                    padding: "2px 6px",
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    flexShrink: 0,
                    transition: "all .15s"
                  },
                  onMouseEnter: (e) => {
                    if (!showScreenList) {
                      e.currentTarget.style.borderColor = SPEC_COLOR;
                      e.currentTarget.style.color = SPEC_COLOR;
                    }
                  },
                  onMouseLeave: (e) => {
                    if (!showScreenList) {
                      e.currentTarget.style.borderColor = DARK.brd;
                      e.currentTarget.style.color = DARK.txL;
                    }
                  },
                  children: "\u2261"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                ScreenSelector,
                {
                  screens: allScreens,
                  currentPageId: activePageId,
                  onSelect: handleSelectPage
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }, children: [
              onTogglePin && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "button",
                {
                  onClick: onTogglePin,
                  title: pinned ? "\uACE0\uC815 \uD574\uC81C \u2014 \uD398\uC774\uC9C0 \uC774\uB3D9 \uC2DC \uD328\uB110\uC774 \uB2EB\uD799\uB2C8\uB2E4" : "\uD328\uB110 \uACE0\uC815 \u2014 \uD398\uC774\uC9C0 \uC774\uB3D9 \uC2DC \uD328\uB110\uC774 \uC720\uC9C0\uB429\uB2C8\uB2E4",
                  style: {
                    width: 26,
                    height: 26,
                    borderRadius: 5,
                    cursor: "pointer",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: pinned ? `${SPEC_COLOR}22` : "rgba(255,255,255,.08)",
                    border: `1px solid ${pinned ? SPEC_COLOR + "88" : "transparent"}`,
                    color: pinned ? SPEC_COLOR : DARK.txS,
                    transition: "all .15s"
                  },
                  onMouseEnter: (e) => {
                    if (!pinned) {
                      e.currentTarget.style.background = "rgba(255,255,255,.14)";
                      e.currentTarget.style.color = DARK.txt;
                    }
                  },
                  onMouseLeave: (e) => {
                    if (!pinned) {
                      e.currentTarget.style.background = "rgba(255,255,255,.08)";
                      e.currentTarget.style.color = DARK.txS;
                    }
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z" }) })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                "button",
                {
                  onClick: onClose,
                  style: {
                    background: "rgba(255,255,255,.08)",
                    border: "none",
                    color: DARK.txS,
                    width: 26,
                    height: 26,
                    borderRadius: 5,
                    cursor: "pointer",
                    fontSize: 14,
                    flexShrink: 0
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.14)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                  },
                  children: "\xD7"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { display: "flex", gap: 0, marginTop: 10 }, children: TABS.map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("button", { onClick: () => setTab(key), style: {
            padding: "4px 10px",
            background: "transparent",
            border: "none",
            borderBottom: `2px solid ${tab === key ? "#3b82f6" : "transparent"}`,
            color: tab === key ? "#3b82f6" : DARK.txL,
            fontSize: 11,
            fontWeight: tab === key ? 700 : 400,
            cursor: "pointer",
            fontFamily: FONT_FAMILY,
            transition: "all .12s",
            display: "flex",
            alignItems: "center",
            gap: 4
          }, children: [
            label,
            key === "comment" && drawerPins.filter((p) => p.status !== "resolved").length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
              fontSize: 9,
              fontWeight: 700,
              minWidth: 14,
              height: 14,
              background: tab === "comment" ? "#3b82f6" : "rgba(255,255,255,.18)",
              color: "#fff",
              borderRadius: 3,
              padding: "0 3px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }, children: drawerPins.filter((p) => p.status !== "resolved").length })
          ] }, key)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { flex: 1, overflow: "hidden" }, children: [
          tab === "screenSpec" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            ScreenSpecTab,
            {
              pageId: activePageId,
              storage,
              currentAuthor,
              onDeleteElement,
              onSoftDeleteElement,
              onRestoreElement,
              onHoverElement,
              onScreenSpecSaved: handleScreenSpecSaved,
              onElementSaved,
              refreshKey,
              externalTitle: allScreens.find((s) => s.pageId === activePageId)?.title
            },
            activePageId
          ),
          tab === "comment" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            CommentTab,
            {
              pins: drawerPins,
              labels,
              screenTitle: activeScreenTitle,
              screenUpdatedAt: allScreens.find((s) => s.pageId === activePageId)?.updatedAt ?? null,
              screenDescription: allScreens.find((s) => s.pageId === activePageId)?.description ?? "",
              selectedId: selectedPinId,
              hoveredId: hoveredPinId,
              showResolved,
              resolvedCount,
              onSelect: onSelectPin ?? (() => {
              }),
              onHover: onHoverPin,
              onToggleShowResolved: onToggleShowResolved ?? (() => {
              }),
              sessions,
              currentSessionId,
              sessionProgress,
              onSelectSession,
              onCreateSession,
              onDeleteSession,
              onSetSessionStatus,
              onUpdateSession
            }
          )
        ] })
      ]
    }
  );
}

// src/SpecPin.tsx
var import_react_dom2 = require("react-dom");
var import_react10 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var PIN_LAYER_ID = "specbridge-pin-layer";
var EXPAND_W2 = 220;
function timeAgo2(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 6e4) return "\uBC29\uAE08";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}\uBD84 \uC804`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}\uC2DC\uAC04 \uC804`;
  return `${Math.floor(diff / 864e5)}\uC77C \uC804`;
}
var SPEC_COLOR2 = "#ef4444";
function SpecPin({ spec, align, isExternalHovered, onClick, onMove, onMoveEnd, softDeleted }) {
  const [hovered, setHovered] = (0, import_react10.useState)(false);
  const [dragging, setDragging] = (0, import_react10.useState)(false);
  const [contentReady, setContentReady] = (0, import_react10.useState)(false);
  const expanded = hovered || !!isExternalHovered;
  (0, import_react10.useEffect)(() => {
    if (!expanded) {
      setContentReady(false);
      return;
    }
    const raf = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(raf);
  }, [expanded]);
  if (spec.pinX == null || spec.pinY == null) return null;
  const num = spec.num ?? "\xB7";
  const label = spec.elementLabel ?? spec.elementId;
  const { viewportX, viewportY, expandLeft } = (() => {
    const el = document.getElementById(PIN_LAYER_ID);
    const r = el?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const rawX = align === "center" ? spec.pinX + r.width / 2 : align === "right" ? r.width - spec.pinX : spec.pinX;
    const vx = r.left + rawX;
    const vy = r.top + spec.pinY;
    return {
      viewportX: vx,
      viewportY: vy,
      expandLeft: vx + EXPAND_W2 > window.innerWidth - 8
    };
  })();
  const EDGE = 8;
  const MIN_UP = 120;
  const expandDown = expanded && viewportY + 28 - EDGE < MIN_UP;
  const maxExpandH = expanded ? expandDown ? Math.min(400, window.innerHeight - viewportY - EDGE) : Math.min(400, viewportY + 28 - EDGE) : 28;
  const portalLeft = expandLeft ? viewportX + 28 - EXPAND_W2 : viewportX;
  const portalVertical = expandDown ? { top: viewportY } : { bottom: window.innerHeight - viewportY - 28 };
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (spec.pinX == null || spec.pinY == null) return;
    e.stopPropagation();
    if (!onMove && !onMoveEnd) {
      onClick();
      return;
    }
    const pinLayer = document.getElementById(PIN_LAYER_ID);
    if (!pinLayer) {
      onClick();
      return;
    }
    const base = pinLayer.getBoundingClientRect();
    const pinRawX = align === "center" ? spec.pinX + base.width / 2 : align === "right" ? base.width - spec.pinX : spec.pinX;
    const startX = e.clientX - base.left - pinRawX;
    const startY = e.clientY - base.top - spec.pinY;
    let moved = false;
    let lastPos = { pinX: spec.pinX, pinY: spec.pinY };
    const onMoveHandler = (ev) => {
      if (!moved) {
        moved = true;
        setDragging(true);
      }
      const newRawX = ev.clientX - base.left - startX;
      const newRawY = ev.clientY - base.top - startY;
      const clampedRawX = Math.max(0, Math.min(base.width, newRawX));
      const clampedRawY = Math.max(0, Math.min(base.height, newRawY));
      const newPinX = align === "center" ? clampedRawX - base.width / 2 : align === "right" ? base.width - clampedRawX : clampedRawX;
      lastPos = { pinX: newPinX, pinY: clampedRawY };
      onMove?.(lastPos);
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMoveHandler);
      document.removeEventListener("mouseup", onUp);
      setDragging(false);
      if (!moved) {
        onClick();
      } else {
        onMoveEnd?.(lastPos);
      }
    };
    document.addEventListener("mousemove", onMoveHandler);
    document.addEventListener("mouseup", onUp);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "div",
      {
        "data-sb-ui": "true",
        onMouseDown: handleMouseDown,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        title: label,
        style: {
          position: "absolute",
          ...align === "center" ? { left: `calc(50% + ${spec.pinX}px)` } : align === "right" ? { right: `${spec.pinX}px` } : { left: `${spec.pinX}px` },
          top: `${spec.pinY}px`,
          transform: "translate(0, 0)",
          zIndex: 9850,
          cursor: dragging ? "grabbing" : expanded ? "grab" : "pointer",
          pointerEvents: "all",
          display: "flex",
          alignItems: "flex-start",
          transition: dragging ? "none" : "opacity .15s",
          opacity: softDeleted ? 0.4 : 1
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: {
          width: 28,
          height: 28,
          borderRadius: "80px 80px 80px 12px",
          background: "#1A1A1A",
          boxShadow: "0 2px 8px rgba(0,0,0,.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: {
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: SPEC_COLOR2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: {
          fontSize: 10,
          fontWeight: 700,
          color: "#fff",
          fontFamily: FONT_FAMILY,
          lineHeight: 1,
          userSelect: "none",
          textDecoration: softDeleted ? "line-through" : "none"
        }, children: num }) }) })
      }
    ),
    expanded && typeof document !== "undefined" && (0, import_react_dom2.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "div",
        {
          onMouseDown: handleMouseDown,
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          style: {
            position: "fixed",
            left: portalLeft,
            ...portalVertical,
            width: EXPAND_W2,
            maxHeight: maxExpandH,
            minHeight: 28,
            borderRadius: expandDown ? "4px 16px 16px 16px" : "16px 16px 16px 4px",
            background: "#1A1A1A",
            boxShadow: "0 6px 18px rgba(0,0,0,.38)",
            overflow: "hidden",
            zIndex: 9992,
            fontFamily: FONT_FAMILY,
            pointerEvents: "all",
            display: "flex",
            flexDirection: "column",
            cursor: dragging ? "grabbing" : "grab"
          },
          children: contentReady && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: {
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: SPEC_COLOR2,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color: "#fff", lineHeight: 1 }, children: num }) }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: {
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,.88)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: FONT_FAMILY,
                minWidth: 0,
                flexShrink: 1
              }, children: label }),
              spec.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: {
                marginLeft: "auto",
                flexShrink: 0,
                fontSize: 9,
                color: "rgba(255,255,255,.28)",
                whiteSpace: "nowrap",
                fontFamily: FONT_FAMILY
              }, children: timeAgo2(spec.updatedAt) })
            ] }),
            spec.content && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: {
              fontSize: 11,
              color: "rgba(255,255,255,.55)",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontFamily: FONT_FAMILY
            }, children: spec.content })
          ] })
        }
      ),
      document.body
    )
  ] });
}

// src/storage.ts
var loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};
var saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
};
function genId(prefix = "") {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function readAll() {
  return loadJson(STORAGE_KEYS.annotations, {});
}
function writeAll(data) {
  saveJson(STORAGE_KEYS.annotations, data);
}
function readSessions() {
  return loadJson(STORAGE_KEYS.sessions, []);
}
function writeSessions(sessions) {
  saveJson(STORAGE_KEYS.sessions, sessions);
}
function readLabels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.labels);
    if (raw == null) return DEFAULT_LABELS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
  }
  return DEFAULT_LABELS;
}
function writeLabels(labels) {
  saveJson(STORAGE_KEYS.labels, labels);
}
function replacePinEverywhere(data, pinId, mutator) {
  const out = {};
  for (const [pageId, arr] of Object.entries(data)) {
    out[pageId] = arr.map((p) => p.id === pinId ? mutator(p) : p);
  }
  return out;
}
async function updatePinLocal(id, patch) {
  const data = readAll();
  let updated = null;
  const next = replacePinEverywhere(data, id, (p) => {
    updated = { ...p, ...patch };
    return updated;
  });
  writeAll(next);
  if (!updated) throw new Error(`pin not found: ${id}`);
  return updated;
}
var localStorageAdapter = {
  async loadAnnotations() {
    const data = readAll();
    const allPins = Object.values(data).flat();
    const hasUnnum = allPins.some((p) => !p.num);
    if (hasUnnum) {
      let maxNum = allPins.reduce((m, p) => Math.max(m, p.num ?? 0), 0);
      const unnum = allPins.filter((p) => !p.num).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      for (const p of unnum) p.num = ++maxNum;
      writeAll(data);
    }
    return data;
  },
  async loadLabels() {
    return readLabels();
  },
  async loadAuthor() {
    try {
      return localStorage.getItem(STORAGE_KEYS.author) ?? "";
    } catch {
      return "";
    }
  },
  async loadLastLabelId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.lastLabel);
    } catch {
      return null;
    }
  },
  async saveAuthor(name) {
    try {
      localStorage.setItem(STORAGE_KEYS.author, name);
    } catch {
    }
  },
  async saveLastLabelId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.lastLabel);
      else localStorage.setItem(STORAGE_KEYS.lastLabel, id);
    } catch {
    }
  },
  async loadAuthorDefaultLabelId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.defaultLabel);
    } catch {
      return null;
    }
  },
  async saveAuthorDefaultLabelId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.defaultLabel);
      else localStorage.setItem(STORAGE_KEYS.defaultLabel, id);
    } catch {
    }
  },
  async createLabel({ name, color }) {
    const label = { id: genId("lbl-"), name: name.trim(), color };
    const labels = readLabels();
    writeLabels([...labels, label]);
    return label;
  },
  async updateLabel(id, patch) {
    const labels = readLabels();
    const next = labels.map(
      (l) => l.id === id ? { ...l, ...patch, name: patch.name?.trim() ?? l.name } : l
    );
    writeLabels(next);
    const found = next.find((l) => l.id === id);
    if (!found) throw new Error(`label not found: ${id}`);
    return found;
  },
  async deleteLabel(id) {
    const labels = readLabels();
    writeLabels(labels.filter((l) => l.id !== id));
  },
  async createPin({ pageId, x, y, labelId, author, sessionId }) {
    const data = readAll();
    const maxNum = Object.values(data).flat().reduce((m, p) => Math.max(m, p.num ?? 0), 0);
    const pin = {
      id: genId(),
      num: maxNum + 1,
      x,
      y,
      labelId,
      note: "",
      author,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "open",
      comments: [],
      sessionId: sessionId ?? null
    };
    data[pageId] = [...data[pageId] ?? [], pin];
    writeAll(data);
    return pin;
  },
  async updatePin(id, patch) {
    return updatePinLocal(id, patch);
  },
  async deletePin(id) {
    const data = readAll();
    const out = {};
    for (const [pageId, arr] of Object.entries(data)) {
      out[pageId] = arr.filter((p) => p.id !== id);
    }
    writeAll(out);
  },
  async resolvePin(id, by) {
    return updatePinLocal(id, {
      status: "resolved",
      resolvedBy: by,
      resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  async reopenPin(id) {
    return updatePinLocal(id, {
      status: "open",
      resolvedBy: void 0,
      resolvedAt: void 0
    });
  },
  async addComment(pinId, author, text) {
    const comment = {
      id: genId("c-"),
      author,
      text: text.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const data = readAll();
    const next = replacePinEverywhere(data, pinId, (p) => ({
      ...p,
      comments: [...p.comments, comment]
    }));
    writeAll(next);
    return comment;
  },
  async updateComment(commentId, text) {
    const data = readAll();
    let updated = null;
    const next = {};
    for (const [pageId, arr] of Object.entries(data)) {
      next[pageId] = arr.map((p) => ({
        ...p,
        comments: p.comments.map((c) => {
          if (c.id !== commentId) return c;
          updated = { ...c, text: text.trim(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          return updated;
        })
      }));
    }
    writeAll(next);
    if (!updated) throw new Error(`comment not found: ${commentId}`);
    return updated;
  },
  async deleteComment(commentId) {
    const data = readAll();
    const next = {};
    for (const [pageId, arr] of Object.entries(data)) {
      next[pageId] = arr.map((p) => ({
        ...p,
        comments: p.comments.filter((c) => c.id !== commentId)
      }));
    }
    writeAll(next);
  },
  // ── Sessions ─────────────────────────────────────────────
  async loadSessions() {
    return readSessions();
  },
  async createSession(name, options) {
    const session = {
      id: genId("ses-"),
      name: name.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active",
      viewport: options?.viewport ?? null,
      note: options?.note ?? null
    };
    writeSessions([...readSessions(), session]);
    return session;
  },
  async updateSession(id, patch) {
    const sessions = readSessions();
    const next = sessions.map(
      (s) => s.id === id ? { ...s, ...patch, ...patch.name ? { name: patch.name.trim() } : {} } : s
    );
    writeSessions(next);
    const found = next.find((s) => s.id === id);
    if (!found) throw new Error(`session not found: ${id}`);
    return found;
  },
  async deleteSession(id) {
    writeSessions(readSessions().filter((s) => s.id !== id));
  },
  async loadCurrentSessionId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.currentSession);
    } catch {
      return null;
    }
  },
  async saveCurrentSessionId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.currentSession);
      else localStorage.setItem(STORAGE_KEYS.currentSession, id);
    } catch {
    }
  }
};

// src/useAnnotations.ts
var import_react11 = require("react");
function useAnnotations(pageId, storage) {
  const [allAnnots, setAllAnnots] = (0, import_react11.useState)({});
  const [loading, setLoading] = (0, import_react11.useState)(true);
  (0, import_react11.useEffect)(() => {
    let cancelled = false;
    storage.loadAnnotations().then((data) => {
      if (!cancelled) setAllAnnots(data);
    }).catch((e) => console.error("[specbridge] loadAnnotations failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const pins = (0, import_react11.useMemo)(() => allAnnots[pageId] ?? [], [allAnnots, pageId]);
  const replacePin = (0, import_react11.useCallback)((pin) => {
    setAllAnnots((prev) => {
      const out = {};
      for (const [pid, arr] of Object.entries(prev)) {
        out[pid] = arr.map((p) => p.id === pin.id ? pin : p);
      }
      return out;
    });
  }, []);
  const removePinEverywhere = (0, import_react11.useCallback)((pinId) => {
    setAllAnnots((prev) => {
      const out = {};
      for (const [pid, arr] of Object.entries(prev)) {
        out[pid] = arr.filter((p) => p.id !== pinId);
      }
      return out;
    });
  }, []);
  const addPin = (0, import_react11.useCallback)(
    async (x, y, author, labelId, sessionId) => {
      try {
        const pin = await storage.createPin({ pageId, x, y, labelId, author, sessionId });
        setAllAnnots((prev) => ({
          ...prev,
          [pageId]: [...prev[pageId] ?? [], pin]
        }));
        return pin;
      } catch (e) {
        console.error("[specbridge] createPin failed", e);
        return null;
      }
    },
    [pageId, storage]
  );
  const updatePin = (0, import_react11.useCallback)(
    async (id, patch) => {
      setAllAnnots((prev) => {
        const out = {};
        for (const [pid, arr] of Object.entries(prev)) {
          out[pid] = arr.map((p) => p.id === id ? { ...p, ...patch } : p);
        }
        return out;
      });
      try {
        const pin = await storage.updatePin(id, patch);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] updatePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const deletePin = (0, import_react11.useCallback)(
    async (id) => {
      try {
        await storage.deletePin(id);
        removePinEverywhere(id);
      } catch (e) {
        console.error("[specbridge] deletePin failed", e);
      }
    },
    [storage, removePinEverywhere]
  );
  const movePin = (0, import_react11.useCallback)(
    async (id, pos) => {
      try {
        const pin = await storage.updatePin(id, pos);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] movePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const resolvePin = (0, import_react11.useCallback)(
    async (id, by) => {
      try {
        const pin = await storage.resolvePin(id, by);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] resolvePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const reopenPin = (0, import_react11.useCallback)(
    async (id) => {
      try {
        const pin = await storage.reopenPin(id);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] reopenPin failed", e);
      }
    },
    [storage, replacePin]
  );
  const addComment = (0, import_react11.useCallback)(
    async (pinId, author, text) => {
      try {
        const comment = await storage.addComment(pinId, author, text);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: [...p.comments, comment] } : p
            );
          }
          return out;
        });
        return comment;
      } catch (e) {
        console.error("[specbridge] addComment failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateComment = (0, import_react11.useCallback)(
    async (pinId, commentId, text) => {
      setAllAnnots((prev) => {
        const out = {};
        for (const [pid, arr] of Object.entries(prev)) {
          out[pid] = arr.map(
            (p) => p.id === pinId ? { ...p, comments: p.comments.map((c) => c.id === commentId ? { ...c, text } : c) } : p
          );
        }
        return out;
      });
      try {
        const comment = await storage.updateComment(commentId, text);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: p.comments.map((c) => c.id === commentId ? comment : c) } : p
            );
          }
          return out;
        });
      } catch (e) {
        console.error("[specbridge] updateComment failed", e);
      }
    },
    [storage]
  );
  const deleteComment = (0, import_react11.useCallback)(
    async (pinId, commentId) => {
      try {
        await storage.deleteComment(commentId);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
            );
          }
          return out;
        });
      } catch (e) {
        console.error("[specbridge] deleteComment failed", e);
      }
    },
    [storage]
  );
  return {
    loading,
    allAnnots,
    pins,
    addPin,
    updatePin,
    deletePin,
    movePin,
    addComment,
    updateComment,
    deleteComment,
    resolvePin,
    reopenPin
  };
}

// src/useAuthor.ts
var import_react12 = require("react");
function useAuthor(storage) {
  const [author, setAuthorState] = (0, import_react12.useState)("");
  const [defaultLabelId, setDefaultLabelIdState] = (0, import_react12.useState)(null);
  const [loading, setLoading] = (0, import_react12.useState)(true);
  (0, import_react12.useEffect)(() => {
    let cancelled = false;
    Promise.all([
      storage.loadAuthor(),
      storage.loadAuthorDefaultLabelId?.() ?? Promise.resolve(null)
    ]).then(([name, labelId]) => {
      if (!cancelled) {
        setAuthorState(name);
        setDefaultLabelIdState(labelId);
      }
    }).catch((e) => console.error("[specbridge] useAuthor load failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const setAuthor = (0, import_react12.useCallback)(
    async (name) => {
      setAuthorState(name);
      try {
        await storage.saveAuthor(name);
      } catch (e) {
        console.error("[specbridge] saveAuthor failed", e);
      }
    },
    [storage]
  );
  const setDefaultLabelId = (0, import_react12.useCallback)(
    async (id) => {
      setDefaultLabelIdState(id);
      try {
        await storage.saveAuthorDefaultLabelId?.(id);
      } catch (e) {
        console.error("[specbridge] saveAuthorDefaultLabelId failed", e);
      }
    },
    [storage]
  );
  return { author, setAuthor, defaultLabelId, setDefaultLabelId, loading };
}

// src/useLabels.ts
var import_react13 = require("react");
function useLabels(storage) {
  const [labels, setLabels] = (0, import_react13.useState)([]);
  const [loading, setLoading] = (0, import_react13.useState)(true);
  (0, import_react13.useEffect)(() => {
    let cancelled = false;
    storage.loadLabels().then((v) => {
      if (!cancelled) setLabels(v);
    }).catch((e) => console.error("[specbridge] loadLabels failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const addLabel = (0, import_react13.useCallback)(
    async (name, color) => {
      try {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const created = await storage.createLabel({ name: trimmed, color });
        setLabels((prev) => [...prev, created]);
        return created;
      } catch (e) {
        console.error("[specbridge] createLabel failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateLabel = (0, import_react13.useCallback)(
    async (id, patch) => {
      try {
        const updated = await storage.updateLabel(id, patch);
        setLabels((prev) => prev.map((l) => l.id === id ? updated : l));
      } catch (e) {
        console.error("[specbridge] updateLabel failed", e);
      }
    },
    [storage]
  );
  const deleteLabel = (0, import_react13.useCallback)(
    async (id) => {
      try {
        await storage.deleteLabel(id);
        setLabels((prev) => prev.filter((l) => l.id !== id));
      } catch (e) {
        console.error("[specbridge] deleteLabel failed", e);
      }
    },
    [storage]
  );
  return { labels, addLabel, updateLabel, deleteLabel, loading };
}

// src/useSettings.ts
var import_react14 = require("react");
var SETTINGS_KEY = "cs_sb_settings_v1";
var DEFAULT_SETTINGS = {
  panelMode: "overlay",
  markerAlign: "left"
};
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
  }
  return { ...DEFAULT_SETTINGS };
}
function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
  }
}
function useSettings() {
  const [settings, setSettingsState] = (0, import_react14.useState)(loadSettings);
  const setSetting = (0, import_react14.useCallback)(
    (key, value) => {
      setSettingsState((prev) => {
        const next = { ...prev, [key]: value };
        saveSettings(next);
        return next;
      });
    },
    []
  );
  return { settings, setSetting };
}

// src/useSessions.ts
var import_react15 = require("react");
function useSessions(storage) {
  const [sessions, setSessions] = (0, import_react15.useState)([]);
  (0, import_react15.useEffect)(() => {
    let cancelled = false;
    storage.loadSessions().then(async (v) => {
      if (cancelled) return;
      if (v.length > 0) {
        setSessions(v);
      } else {
        try {
          const session = await storage.createSession("1\uCC28 \uAC80\uD1A0");
          if (!cancelled) setSessions([session]);
        } catch {
          if (!cancelled) setSessions([]);
        }
      }
    }).catch((e) => console.error("[specbridge] loadSessions failed", e));
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const addSession = (0, import_react15.useCallback)(
    async (name, options) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      try {
        const session = await storage.createSession(trimmed, options);
        setSessions((prev) => [...prev, session]);
        return session;
      } catch (e) {
        console.error("[specbridge] createSession failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateSession = (0, import_react15.useCallback)(
    async (id, patch) => {
      if (patch.name !== void 0 && !patch.name.trim()) return;
      try {
        const updated = await storage.updateSession(id, patch);
        setSessions((prev) => prev.map((s) => s.id === id ? updated : s));
      } catch (e) {
        console.error("[specbridge] updateSession failed", e);
      }
    },
    [storage]
  );
  const setSessionStatus = (0, import_react15.useCallback)(
    async (id, status) => {
      await updateSession(id, { status });
    },
    [updateSession]
  );
  const setSessionViewport = (0, import_react15.useCallback)(
    async (id, viewport) => {
      await updateSession(id, { viewport });
    },
    [updateSession]
  );
  const deleteSession = (0, import_react15.useCallback)(
    async (id) => {
      try {
        await storage.deleteSession(id);
        const remaining = await storage.loadSessions();
        if (remaining.length === 0) {
          const session = await storage.createSession("1\uCC28 \uAC80\uD1A0");
          setSessions([session]);
        } else {
          setSessions(remaining);
        }
      } catch (e) {
        console.error("[specbridge] deleteSession failed", e);
      }
    },
    [storage]
  );
  return { sessions, addSession, updateSession, setSessionStatus, setSessionViewport, deleteSession };
}

// src/SpecBridgeAnnotation.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var LAYER_ID = "specbridge-annot-layer";
var CONTAINER_ID = "specbridge-annot-container";
var PIN_LAYER_ID2 = "specbridge-pin-layer";
var LOGO_TIP_KEY = "cs_annot_logo_tip_v1";
function hasShownLogoTip() {
  try {
    return localStorage.getItem(LOGO_TIP_KEY) === "1";
  } catch {
    return false;
  }
}
function markLogoTipShown() {
  try {
    localStorage.setItem(LOGO_TIP_KEY, "1");
  } catch {
  }
}
function SpecBridgeAnnotation({
  pageId,
  enabled: initialEnabled = true,
  storage = localStorageAdapter,
  onNavigate,
  children,
  overlayMode = false,
  pageWrapper,
  serviceId
}) {
  const [enabled, setEnabled] = (0, import_react16.useState)(initialEnabled);
  const [showGuide, setShowGuide] = (0, import_react16.useState)(() => !hasDismissedForever());
  const [showLogoTip, setShowLogoTip] = (0, import_react16.useState)(false);
  const [adding, setAdding] = (0, import_react16.useState)(false);
  const mountTimeRef = (0, import_react16.useRef)(Date.now());
  const firstToolbarUsedRef = (0, import_react16.useRef)(false);
  const markerClickCountRef = (0, import_react16.useRef)(0);
  const [showDrawer, setShowDrawer] = (0, import_react16.useState)(() => {
    try {
      return localStorage.getItem("sb_drawer_pinned") === "1";
    } catch {
      return false;
    }
  });
  const [showScreenListOpen, setShowScreenListOpen] = (0, import_react16.useState)(false);
  const [drawerDefaultTab, setDrawerDefaultTab] = (0, import_react16.useState)("screenSpec");
  const [pickingForElement, setPickingForElement] = (0, import_react16.useState)(false);
  const [specPins, setSpecPins] = (0, import_react16.useState)([]);
  const [softDeletedSpecIds, setSoftDeletedSpecIds] = (0, import_react16.useState)(/* @__PURE__ */ new Set());
  const [hoveredSpecElementId, setHoveredSpecElementId] = (0, import_react16.useState)(null);
  const [specRefreshKey, setSpecRefreshKey] = (0, import_react16.useState)(0);
  const [showResolved, setShowResolved] = (0, import_react16.useState)(false);
  const [currentViewport, setCurrentViewport] = (0, import_react16.useState)("desktop");
  const [viewportToast, setViewportToast] = (0, import_react16.useState)(null);
  const viewportToastTimer = (0, import_react16.useRef)(null);
  const [selectedId, setSelectedId] = (0, import_react16.useState)(null);
  const [currentSessionId, setCurrentSessionId] = (0, import_react16.useState)(null);
  const [hoveredId, setHoveredId] = (0, import_react16.useState)(null);
  const hoverTimer = (0, import_react16.useRef)(null);
  const [showAuthorModal, setShowAuthorModal] = (0, import_react16.useState)(false);
  const [showLabelModal, setShowLabelModal] = (0, import_react16.useState)(false);
  const [lastLabelId, setLastLabelIdState] = (0, import_react16.useState)(null);
  const [latestSdkVersion, setLatestSdkVersion] = (0, import_react16.useState)(null);
  const [screenMarkerAlign, setScreenMarkerAlign] = (0, import_react16.useState)(null);
  const containerRef = (0, import_react16.useRef)(null);
  const [drawerPinned, setDrawerPinned] = (0, import_react16.useState)(() => {
    try {
      return localStorage.getItem("sb_drawer_pinned") === "1";
    } catch {
      return false;
    }
  });
  const drawerPinnedRef = (0, import_react16.useRef)(drawerPinned);
  (0, import_react16.useEffect)(() => {
    drawerPinnedRef.current = drawerPinned;
  }, [drawerPinned]);
  const [, setResizeTick] = (0, import_react16.useState)(0);
  (0, import_react16.useEffect)(() => {
    const onResize = () => setResizeTick((t) => t + 1);
    const onScroll = () => setResizeTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  (0, import_react16.useEffect)(() => {
    if (!storage.loadSetting) return;
    storage.loadSetting("markerAlign").then((val) => {
      if (val === "left" || val === "center" || val === "right") {
        setSetting("markerAlign", val);
      }
    }).catch(() => {
    });
  }, [storage]);
  (0, import_react16.useEffect)(() => {
    if (!storage.loadScreenSpec) {
      setScreenMarkerAlign(null);
      return;
    }
    storage.loadScreenSpec(pageId).then((s) => setScreenMarkerAlign(s.markerAlign ?? null)).catch(() => setScreenMarkerAlign(null));
  }, [pageId, storage]);
  (0, import_react16.useEffect)(() => {
    const id = "specbridge-pretendard";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css";
    document.head.appendChild(link);
  }, []);
  (0, import_react16.useEffect)(() => {
    if (!storage.checkSdkVersion) return;
    storage.checkSdkVersion().then(({ latest }) => {
      if (latest) setLatestSdkVersion(latest);
    }).catch(() => {
    });
  }, []);
  (0, import_react16.useEffect)(() => {
    let cancelled = false;
    storage.loadLastLabelId().then((v) => {
      if (!cancelled) setLastLabelIdState(v);
    }).catch((e) => console.error("[specbridge] loadLastLabelId failed", e));
    return () => {
      cancelled = true;
    };
  }, [storage]);
  (0, import_react16.useEffect)(() => {
    storage.loadCurrentSessionId().then((id) => {
      if (id) setCurrentSessionId(id);
    }).catch(() => {
    });
  }, []);
  (0, import_react16.useEffect)(() => {
    if (serviceId) setServiceId(serviceId);
  }, [serviceId]);
  (0, import_react16.useEffect)(() => {
    trackEvent("sb_session_start", { page_id: pageId });
  }, [pageId]);
  (0, import_react16.useEffect)(() => {
    if (selectedId) trackEvent("sb_panel_open", { page_id: pageId });
  }, [selectedId, pageId]);
  const { settings, setSetting } = useSettings();
  const trackFirstToolbarUse = (0, import_react16.useCallback)((action) => {
    if (firstToolbarUsedRef.current) return;
    firstToolbarUsedRef.current = true;
    trackEvent("sb_toolbar_first_use", {
      page_id: pageId,
      action,
      time_to_interact_ms: Date.now() - mountTimeRef.current
    });
  }, [pageId]);
  const handleChangeSetting = (0, import_react16.useCallback)(
    (key, value) => {
      setSetting(key, value);
      if (key === "markerAlign") {
        storage.saveSetting?.("markerAlign", value).catch(() => {
        });
        if (storage.saveScreenSpec) {
          storage.saveScreenSpec(pageId, { markerAlign: value }).then((spec) => setScreenMarkerAlign(spec.markerAlign ?? null)).catch(() => {
          });
        }
      }
    },
    [setSetting, storage, pageId]
  );
  const { author, setAuthor, defaultLabelId, setDefaultLabelId } = useAuthor(storage);
  const { labels, addLabel, updateLabel, deleteLabel } = useLabels(storage);
  const { sessions, addSession, updateSession, setSessionStatus, deleteSession } = useSessions(storage);
  const handleSelectSession = (0, import_react16.useCallback)((id) => {
    setCurrentSessionId(id);
    storage.saveCurrentSessionId(id).catch(() => {
    });
    setSelectedId(null);
  }, [storage]);
  const handleCreateSession = (0, import_react16.useCallback)(
    async (name, options) => {
      const session = await addSession(name, options);
      if (!session) return null;
      handleSelectSession(session.id);
      return session.id;
    },
    [addSession, handleSelectSession]
  );
  const handleDeleteSession = (0, import_react16.useCallback)(async (id) => {
    await deleteSession(id);
    if (currentSessionId === id) handleSelectSession(null);
  }, [deleteSession, currentSessionId, handleSelectSession]);
  const VIEWPORT_MAX_W = {
    desktop: void 0,
    tablet: 768,
    mobile: 375
  };
  const handleViewportChange = (0, import_react16.useCallback)((vp) => {
    trackFirstToolbarUse("viewport_switch");
    trackEvent("sb_viewport_change", { to: vp, page_id: pageId });
    setCurrentViewport(vp);
    if (vp !== "desktop") {
      if (viewportToastTimer.current) clearTimeout(viewportToastTimer.current);
      const label = vp === "tablet" ? "\uD0DC\uBE14\uB9BF" : "\uBAA8\uBC14\uC77C";
      setViewportToast(`${label} \uBDF0\uC5D0\uC11C\uB294 \uD540\uC774 \uD45C\uC2DC\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4`);
      viewportToastTimer.current = setTimeout(() => setViewportToast(null), 3500);
    } else {
      setViewportToast(null);
    }
  }, [trackFirstToolbarUse, pageId]);
  (0, import_react16.useEffect)(() => {
    if (!overlayMode || !pageWrapper) return;
    const maxW = VIEWPORT_MAX_W[currentViewport];
    const isDesktop = currentViewport === "desktop";
    const drawerOffset = enabled && settings.panelMode === "push" && showDrawer ? DRAWER_W + (showScreenListOpen ? SCREEN_LIST_W : 0) : 0;
    pageWrapper.style.transition = "max-width .3s ease, width .3s ease";
    if (isDesktop) {
      pageWrapper.style.maxWidth = "";
      pageWrapper.style.left = "";
      pageWrapper.style.margin = "";
      pageWrapper.style.marginRight = "";
      pageWrapper.style.transform = "translateX(0)";
      pageWrapper.style.width = drawerOffset ? `calc(100% - ${drawerOffset}px)` : "";
      pageWrapper.style.overflow = "";
      pageWrapper.style.outline = "";
      pageWrapper.style.boxShadow = "";
      if (containerRef.current) {
        containerRef.current.style.transition = "width .3s ease";
        containerRef.current.style.width = drawerOffset ? `calc(100% - ${drawerOffset}px)` : "100%";
      }
    } else {
      pageWrapper.style.maxWidth = `${maxW}px`;
      pageWrapper.style.width = "100%";
      pageWrapper.style.left = "50%";
      pageWrapper.style.transform = "translateX(-50%)";
      pageWrapper.style.margin = "";
      pageWrapper.style.marginRight = "";
      pageWrapper.style.overflow = "hidden";
      pageWrapper.style.outline = "2px solid rgba(255,255,255,.06)";
      pageWrapper.style.boxShadow = "0 0 0 1px rgba(255,255,255,.04), 0 8px 40px rgba(0,0,0,.4)";
    }
    return () => {
      pageWrapper.style.maxWidth = "";
      pageWrapper.style.width = "";
      pageWrapper.style.left = "";
      pageWrapper.style.margin = "";
      pageWrapper.style.marginRight = "";
      pageWrapper.style.transition = "";
      pageWrapper.style.transform = "";
      pageWrapper.style.overflow = "";
      pageWrapper.style.outline = "";
      pageWrapper.style.boxShadow = "";
      if (containerRef.current) {
        containerRef.current.style.transition = "";
        containerRef.current.style.width = "";
      }
    };
  }, [overlayMode, pageWrapper, currentViewport, enabled, settings.panelMode, showDrawer, showScreenListOpen]);
  const {
    allAnnots,
    pins: allPagePins,
    addPin,
    updatePin,
    deletePin,
    movePin,
    addComment,
    updateComment,
    deleteComment,
    resolvePin,
    reopenPin
  } = useAnnotations(pageId, storage);
  const labelById = (0, import_react16.useMemo)(() => new Map(labels.map((l) => [l.id, l])), [labels]);
  const visiblePins = (0, import_react16.useMemo)(() => {
    let pins = allPagePins;
    if (currentSessionId !== null) {
      pins = pins.filter((p) => p.id === selectedId || p.sessionId === currentSessionId || p.sessionId == null);
    }
    if (!showResolved) {
      pins = pins.filter((p) => p.status !== "resolved" || p.id === selectedId);
    }
    return pins;
  }, [allPagePins, showResolved, selectedId, currentSessionId]);
  const resolvedCountThisPage = (0, import_react16.useMemo)(
    () => allPagePins.filter((p) => p.status === "resolved").length,
    [allPagePins]
  );
  const sessionProgress = (0, import_react16.useMemo)(() => {
    const progress = {};
    for (const pins of Object.values(allAnnots)) {
      for (const pin of pins) {
        const sid = pin.sessionId ?? "__none__";
        if (!progress[sid]) progress[sid] = { total: 0, resolved: 0 };
        progress[sid].total++;
        if (pin.status === "resolved") progress[sid].resolved++;
      }
    }
    return progress;
  }, [allAnnots]);
  const pinUsage = (0, import_react16.useMemo)(() => {
    const usage = {};
    for (const list of Object.values(allAnnots)) {
      for (const p of list) {
        if (p.labelId) usage[p.labelId] = (usage[p.labelId] ?? 0) + 1;
      }
    }
    return usage;
  }, [allAnnots]);
  const rememberLastLabel = (0, import_react16.useCallback)(
    (id) => {
      if (!id) return;
      setLastLabelIdState(id);
      storage.saveLastLabelId(id);
    },
    [storage]
  );
  (0, import_react16.useEffect)(() => {
    if (!defaultLabelId && labels.length > 0) {
      setDefaultLabelId(labels[0].id);
    }
  }, [labels, defaultLabelId, setDefaultLabelId]);
  (0, import_react16.useEffect)(() => {
    if (lastLabelId && !labels.some((l) => l.id === lastLabelId)) {
      setLastLabelIdState(null);
      storage.saveLastLabelId(null);
    }
  }, [labels, lastLabelId, storage]);
  (0, import_react16.useEffect)(() => {
    setSelectedId(null);
    setAdding(false);
    if (!drawerPinnedRef.current) setShowDrawer(false);
  }, [pageId]);
  (0, import_react16.useEffect)(() => {
    if (!enabled || !storage.loadPageSpecs) {
      setSpecPins([]);
      return;
    }
    storage.loadPageSpecs(pageId).then((specs) => {
      setSpecPins(specs.filter((s) => s.pinX != null && s.pinY != null));
    }).catch(() => {
    });
  }, [enabled, pageId, storage]);
  (0, import_react16.useEffect)(() => {
    if (!enabled) {
      setAdding(false);
      setShowDrawer(false);
      setSelectedId(null);
      setShowLabelModal(false);
    }
  }, [enabled]);
  (0, import_react16.useEffect)(() => {
    if (selectedId && !visiblePins.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, visiblePins]);
  (0, import_react16.useEffect)(() => {
    if (!adding) return;
    const onKey = (e) => {
      if (e.key === "Escape") setAdding(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adding]);
  (0, import_react16.useEffect)(() => {
    const onKey = (e) => {
      if (e.code !== "KeyA") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      e.preventDefault();
      setEnabled((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  (0, import_react16.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyC") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      e.preventDefault();
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      setAdding((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, author]);
  (0, import_react16.useEffect)(() => {
    if (!pickingForElement) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPickingForElement(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickingForElement]);
  (0, import_react16.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyS") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      e.preventDefault();
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      setPickingForElement((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, author]);
  (0, import_react16.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyL") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      setDrawerDefaultTab("screenSpec");
      setShowDrawer((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
  const handleLayerClick = (0, import_react16.useCallback)(
    async (e) => {
      if (!adding) return;
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      const layer = document.getElementById(PIN_LAYER_ID2);
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const defaultExists = defaultLabelId && labels.some((l) => l.id === defaultLabelId);
      const lastExists = lastLabelId && labels.some((l) => l.id === lastLabelId);
      const resolvedLabelId = defaultExists ? defaultLabelId : lastExists ? lastLabelId : labels[0]?.id ?? null;
      const PIN_SIZE = 28;
      const MARGIN = 4;
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top - PIN_SIZE;
      const clampedX = Math.max(MARGIN, Math.min(rawX, rect.width - PIN_SIZE - MARGIN));
      const clampedY = Math.max(MARGIN, Math.min(rawY, rect.height - PIN_SIZE - MARGIN));
      const resolvedAlign = screenMarkerAlign ?? settings.markerAlign;
      const storedX = resolvedAlign === "center" ? clampedX - rect.width / 2 : resolvedAlign === "right" ? rect.width - clampedX : clampedX;
      const pin = await addPin(storedX, clampedY, author, resolvedLabelId, currentSessionId);
      if (!pin) return;
      trackEvent("sb_pin_added", { page_id: pageId });
      if (!defaultExists) rememberLastLabel(resolvedLabelId);
      setSelectedId(pin.id);
      setAdding(false);
    },
    [adding, author, addPin, labels, lastLabelId, defaultLabelId, rememberLastLabel]
  );
  const handlePanelClose = (0, import_react16.useCallback)(() => {
    const pin = allPagePins.find((p) => p.id === selectedId);
    if (pin && !pin.note?.trim()) deletePin(pin.id);
    setSelectedId(null);
  }, [allPagePins, selectedId, deletePin]);
  const handleUpdatePin = (0, import_react16.useCallback)(
    async (id, patch) => {
      await updatePin(id, patch);
      if (patch.labelId !== void 0) rememberLastLabel(patch.labelId);
    },
    [updatePin, rememberLastLabel]
  );
  const handleResolve = (0, import_react16.useCallback)(
    (pinId) => {
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      void resolvePin(pinId, author);
    },
    [author, resolvePin]
  );
  (0, import_react16.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyQ") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      if (selectedId) {
        const pin = allPagePins.find((p) => p.id === selectedId);
        if (pin?.status === "resolved") reopenPin(selectedId);
        else handleResolve(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, selectedId, handleResolve, allPagePins, reopenPin]);
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  const STATUS_LABEL = {
    planned: "\uC608\uC815",
    draft: "\uC791\uC131",
    review: "\uAC80\uD1A0",
    changed: "\uBCC0\uACBD",
    confirmed: "\uD655\uC815",
    deprecated: "\uD3D0\uAE30"
  };
  function safeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, "_").trim() || "untitled";
  }
  function buildScreenMarkdown(screen, specs) {
    const date = screen.updatedAt ? screen.updatedAt.slice(0, 10) : "";
    const author2 = screen.updatedBy || screen.createdBy || "";
    const statusLabel = STATUS_LABEL[screen.status] ?? screen.status;
    const meta = [
      `**\uC0C1\uD0DC**: ${statusLabel}`,
      author2 && `**\uC791\uC131\uC790**: ${author2}`,
      date && `**\uC218\uC815\uC77C**: ${date}`
    ].filter(Boolean).join(" \xB7 ");
    const lines = [
      `# ${screen.title || screen.pageId}`,
      "",
      meta
    ];
    if (screen.description) {
      lines.push("", screen.description);
    }
    const sorted = [...specs].sort((a, b) => (a.num ?? 999) - (b.num ?? 999));
    if (sorted.length > 0) {
      lines.push("", "---", "", "## \uC2A4\uD399 \uD56D\uBAA9", "");
      sorted.forEach((spec) => {
        const num = spec.num != null ? `[${spec.num}] ` : "";
        const label = spec.elementLabel ? ` \u2014 ${spec.elementLabel}` : "";
        lines.push(`### ${num}${spec.title}${label}`);
        lines.push("");
        lines.push(`**\uC0C1\uD0DC**: ${STATUS_LABEL[spec.status] ?? spec.status}`);
        if (spec.content) {
          lines.push("", spec.content);
        }
        lines.push("", "---", "");
      });
    }
    return lines.join("\n");
  }
  const handleExportJson = (0, import_react16.useCallback)(async () => {
    if (!storage.loadScreenSpecs || !storage.loadAllPageSpecs) return;
    const [screens, pageSpecs] = await Promise.all([
      storage.loadScreenSpecs(),
      storage.loadAllPageSpecs()
    ]);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const payload = { exportedAt: (/* @__PURE__ */ new Date()).toISOString(), screens, pageSpecs };
    downloadBlob(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
      `specbridge-specs-${today}.json`
    );
    trackEvent("sb_export", { format: "json", screen_count: screens.length });
  }, [storage]);
  const handleExportMarkdown = (0, import_react16.useCallback)(async () => {
    if (!storage.loadScreenSpecs || !storage.loadAllPageSpecs) return;
    const [screens, pageSpecs] = await Promise.all([
      storage.loadScreenSpecs(),
      storage.loadAllPageSpecs()
    ]);
    const files = {};
    screens.forEach((screen) => {
      const specs = pageSpecs.filter((s) => s.pageId === screen.pageId);
      const md = buildScreenMarkdown(screen, specs);
      files[`${safeFilename(screen.title || screen.pageId)}.md`] = strToU8(md);
    });
    if (Object.keys(files).length === 0) return;
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const zipped = zipSync(files, { level: 6 });
    downloadBlob(
      new Blob([zipped], { type: "application/zip" }),
      `specbridge-specs-${today}.zip`
    );
    trackEvent("sb_export", { format: "markdown", screen_count: screens.length });
  }, [storage]);
  const handlePinHoverEnter = (0, import_react16.useCallback)((id) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoveredId(id);
  }, []);
  const handlePinHoverLeave = (0, import_react16.useCallback)((_id) => {
    hoverTimer.current = setTimeout(() => {
      setHoveredId(null);
      hoverTimer.current = null;
    }, 60);
  }, []);
  (0, import_react16.useEffect)(() => {
    if (currentSessionId !== null && sessions.length > 0 && !sessions.some((s) => s.id === currentSessionId)) {
      handleSelectSession(null);
    }
  }, [sessions, currentSessionId, handleSelectSession]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "div",
    {
      ref: containerRef,
      id: CONTAINER_ID,
      style: overlayMode ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden"
      } : {
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        maxWidth: VIEWPORT_MAX_W[currentViewport],
        ...(() => {
          const containerMargin = currentViewport !== "desktop" ? { margin: "0 auto" } : { marginRight: enabled && settings.panelMode === "push" && showDrawer ? DRAWER_W + (showScreenListOpen ? SCREEN_LIST_W : 0) : 0 };
          return containerMargin;
        })(),
        transition: "max-width .3s ease, margin .3s ease",
        outline: currentViewport !== "desktop" ? "2px solid rgba(255,255,255,.06)" : "none",
        boxShadow: currentViewport !== "desktop" ? "0 0 0 1px rgba(255,255,255,.04), 0 8px 40px rgba(0,0,0,.4)" : "none"
      },
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: overlayMode ? { pointerEvents: "auto" } : void 0, children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ElementPicker,
            {
              active: enabled && pickingForElement,
              align: screenMarkerAlign ?? settings.markerAlign,
              onSelectElement: async (elementId, elementLabel, pinX, pinY) => {
                setPickingForElement(false);
                if (storage.savePageSpec) {
                  const saved = await storage.savePageSpec(pageId, elementId, {
                    elementLabel,
                    pinX,
                    pinY,
                    updatedBy: author || null
                  });
                  trackEvent("sb_spec_created", { page_id: pageId });
                  setSpecPins((prev) => {
                    const exists = prev.some((p) => p.elementId === elementId);
                    return exists ? prev.map((p) => p.elementId === elementId ? saved : p) : [...prev, saved];
                  });
                  setSpecRefreshKey((k) => k + 1);
                }
                setShowDrawer(true);
              }
            }
          ),
          enabled && showDrawer && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            SpecDrawer,
            {
              pageId,
              storage,
              currentAuthor: author,
              onClose: () => {
                setDrawerPinned(false);
                try {
                  localStorage.setItem("sb_drawer_pinned", "0");
                } catch {
                }
                setShowDrawer(false);
              },
              pinned: drawerPinned,
              onTogglePin: () => {
                const next = !drawerPinned;
                setDrawerPinned(next);
                try {
                  localStorage.setItem("sb_drawer_pinned", next ? "1" : "0");
                } catch {
                }
              },
              onDeleteElement: (id) => {
                setSpecPins((prev) => prev.filter((s) => s.id !== id));
                setSoftDeletedSpecIds((prev) => {
                  const n = new Set(prev);
                  n.delete(id);
                  return n;
                });
              },
              onSoftDeleteElement: (id) => setSoftDeletedSpecIds((prev) => /* @__PURE__ */ new Set([...prev, id])),
              onRestoreElement: (id) => setSoftDeletedSpecIds((prev) => {
                const n = new Set(prev);
                n.delete(id);
                return n;
              }),
              onScreenSpecSaved: (spec) => {
                const align = spec.markerAlign ?? null;
                setScreenMarkerAlign(align);
                if (align) setSetting("markerAlign", align);
              },
              onElementSaved: (spec) => setSpecPins((prev) => prev.map((s) => s.id === spec.id ? spec : s)),
              onHoverElement: (elementId) => setHoveredSpecElementId(elementId),
              allAnnotations: allAnnots,
              onNavigate,
              onScreenListChange: setShowScreenListOpen,
              refreshKey: specRefreshKey,
              defaultTab: drawerDefaultTab,
              pins: visiblePins,
              labels,
              selectedPinId: selectedId,
              hoveredPinId: hoveredId,
              showResolved,
              resolvedCount: resolvedCountThisPage,
              onSelectPin: (id) => {
                setSelectedId(id);
                const pin = allPagePins.find((p) => p.id === id);
                if (pin && pin.comments.length > 0) {
                  setDrawerDefaultTab("comment");
                }
              },
              onHoverPin: (id) => setHoveredId(id ?? null),
              onToggleShowResolved: () => setShowResolved((v) => !v),
              sessions,
              currentSessionId,
              sessionProgress,
              onSelectSession: handleSelectSession,
              onCreateSession: handleCreateSession,
              onDeleteSession: handleDeleteSession,
              onSetSessionStatus: setSessionStatus,
              onUpdateSession: updateSession
            }
          )
        ] }),
        enabled && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "div",
          {
            id: LAYER_ID,
            onClick: handleLayerClick,
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 9990,
              cursor: adding ? "crosshair" : "default",
              pointerEvents: adding ? "all" : "none"
            },
            children: (() => {
              const resolvedAlign = screenMarkerAlign ?? settings.markerAlign;
              return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { id: PIN_LAYER_ID2, style: { position: "absolute", inset: 0 }, children: [
                currentViewport === "desktop" && enabled && specPins.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  SpecPin,
                  {
                    spec,
                    align: resolvedAlign,
                    isExternalHovered: hoveredSpecElementId === spec.elementId,
                    softDeleted: softDeletedSpecIds.has(spec.id ?? ""),
                    onClick: () => setShowDrawer(true),
                    onMove: (pos) => {
                      setSpecPins((prev) => prev.map(
                        (s) => s.id === spec.id ? { ...s, pinX: pos.pinX, pinY: pos.pinY } : s
                      ));
                    },
                    onMoveEnd: async (pos) => {
                      if (!storage.savePageSpec) return;
                      try {
                        const saved = await storage.savePageSpec(pageId, spec.elementId, {
                          pinX: pos.pinX,
                          pinY: pos.pinY,
                          updatedBy: author || null
                        });
                        setSpecPins((prev) => prev.map((s) => s.id === spec.id ? saved : s));
                      } catch (e) {
                        console.error("[specbridge] moveSpecPin failed", e);
                      }
                    }
                  },
                  spec.id ?? spec.elementId
                )),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { pointerEvents: "none" }, children: currentViewport === "desktop" && visiblePins.map((pin) => {
                  const label = pin.labelId ? labelById.get(pin.labelId) : void 0;
                  const isHov = pin.id === hoveredId;
                  const isSel = pin.id === selectedId;
                  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                    AnnotPin,
                    {
                      pin,
                      num: pin.num,
                      label,
                      layerId: PIN_LAYER_ID2,
                      align: resolvedAlign,
                      isSelected: isSel,
                      isHovered: isHov,
                      onSelect: () => {
                        const nextId = isSel ? null : pin.id;
                        setSelectedId(nextId);
                        if (nextId) {
                          markerClickCountRef.current++;
                          trackEvent("sb_marker_click", {
                            page_id: pageId,
                            session_marker_count: markerClickCountRef.current
                          });
                          if (pin.comments.length > 0) {
                            setDrawerDefaultTab("comment");
                            setShowDrawer(true);
                          }
                        }
                      },
                      onMove: (pos) => movePin(pin.id, pos),
                      onHoverEnter: handlePinHoverEnter,
                      onHoverLeave: handlePinHoverLeave
                    },
                    pin.id
                  );
                }) })
              ] });
            })()
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: overlayMode ? { pointerEvents: "auto" } : void 0, children: [
          enabled && selectedId && (() => {
            const selectedPin = allPagePins.find((p) => p.id === selectedId);
            if (!selectedPin) return null;
            return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "div",
                {
                  style: { position: "fixed", inset: 0, zIndex: 9989 },
                  onClick: handlePanelClose
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                AnnotPanel,
                {
                  pins: allPagePins,
                  selectedId,
                  anchor: (() => {
                    const el = document.getElementById(PIN_LAYER_ID2);
                    const r = el?.getBoundingClientRect();
                    const panelAlign = screenMarkerAlign ?? settings.markerAlign;
                    return {
                      x: r ? r.left + (panelAlign === "center" ? selectedPin.x + r.width / 2 : panelAlign === "right" ? r.width - selectedPin.x : selectedPin.x) : selectedPin.x,
                      y: r ? r.top + selectedPin.y : selectedPin.y
                    };
                  })(),
                  labels,
                  currentAuthor: author,
                  leftBound: 0,
                  rightBound: showDrawer ? DRAWER_W : 0,
                  onClose: handlePanelClose,
                  onUpdate: handleUpdatePin,
                  onDelete: (id) => {
                    deletePin(id);
                    setSelectedId(null);
                  },
                  onManageLabels: () => setShowLabelModal(true),
                  onAddComment: (pinId, text) => {
                    trackEvent("sb_comment_add", { page_id: pageId });
                    addComment(pinId, author, text);
                  },
                  onUpdateComment: updateComment,
                  onDeleteComment: deleteComment,
                  onResolve: handleResolve,
                  onReopen: reopenPin
                }
              )
            ] });
          })(),
          showAuthorModal && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            AuthorModal,
            {
              currentAuthor: author,
              currentDefaultLabelId: defaultLabelId,
              labels,
              onSave: (name, labelId) => {
                setAuthor(name);
                setDefaultLabelId(labelId);
                setShowAuthorModal(false);
              },
              onCancel: () => setShowAuthorModal(false)
            }
          ),
          showLabelModal && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            LabelManagerModal,
            {
              labels,
              pinUsage,
              onAdd: addLabel,
              onUpdate: updateLabel,
              onDelete: deleteLabel,
              onClose: () => setShowLabelModal(false)
            }
          ),
          showGuide && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            OnboardingGuide,
            {
              onClose: (forever) => {
                setShowGuide(false);
                trackEvent("sb_guide_closed", { dismissed_forever: forever });
                if (!forever && !hasShownLogoTip()) {
                  markLogoTipShown();
                  setShowLogoTip(true);
                  setTimeout(() => setShowLogoTip(false), 5e3);
                }
              }
            }
          ),
          viewportToast && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
            "div",
            {
              "data-sb-ui": "true",
              style: {
                position: "fixed",
                bottom: 56,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(15,20,40,.96)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 20,
                padding: "8px 20px",
                fontSize: 12,
                color: "rgba(255,255,255,.85)",
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                boxShadow: "0 4px 20px rgba(0,0,0,.4)",
                zIndex: 10001,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                animation: "sbToastIn .2s ease"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconPin, { size: 12, color: "rgba(255,255,255,.8)", style: { marginRight: 5 } }),
                viewportToast
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("style", { children: `@keyframes sbToastIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}` }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            AnnotationToolbar,
            {
              enabled,
              onToggleEnabled: () => setEnabled((v) => {
                trackFirstToolbarUse("toggle_mode");
                trackEvent("sb_design_mode", { enabled: !v, page_id: pageId });
                return !v;
              }),
              author,
              defaultLabelId,
              onSaveAuthor: (name, labelId) => {
                setAuthor(name);
                setDefaultLabelId(labelId);
              },
              adding,
              onToggleAdd: () => {
                if (!author) {
                  setShowAuthorModal(true);
                  return;
                }
                trackFirstToolbarUse("add_comment");
                trackEvent("sb_toolbar_action", { action: "add_comment", page_id: pageId });
                setAdding((v) => !v);
              },
              pinCount: visiblePins.length,
              showList: showDrawer,
              onToggleList: () => {
                setDrawerDefaultTab("screenSpec");
                trackFirstToolbarUse("toggle_list");
                trackEvent("sb_toolbar_action", { action: "toggle_list", page_id: pageId });
                setShowDrawer((v) => {
                  if (!v) setSelectedId(null);
                  return !v;
                });
              },
              onExportJson: handleExportJson,
              onExportMarkdown: handleExportMarkdown,
              labels,
              latestSdkVersion,
              onShowGuide: () => {
                setShowGuide(true);
                setShowLogoTip(false);
              },
              showLogoTip,
              onAddSpec: enabled ? () => {
                trackFirstToolbarUse("add_spec");
                trackEvent("sb_toolbar_action", { action: "add_spec", page_id: pageId });
                setPickingForElement(true);
              } : void 0,
              addingSpec: pickingForElement,
              currentViewport,
              onViewportChange: handleViewportChange,
              settings,
              onChangeSetting: handleChangeSetting
            }
          )
        ] })
      ]
    }
  );
}

// src/AnnotList.tsx
var import_react17 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
function isMentioned(pin, author) {
  const pat = `@${author}`;
  if (pin.note.includes(pat)) return true;
  return pin.comments.some((c) => c.text.includes(pat));
}
function AnnotList({
  pins,
  labels,
  pageId,
  selectedId,
  hoveredId,
  showResolved,
  resolvedCount,
  currentAuthor,
  onSelect,
  onHover,
  onToggleShowResolved,
  onClose
}) {
  const labelById = new Map(labels.map((l) => [l.id, l]));
  const [authorFilter, setAuthorFilter] = (0, import_react17.useState)(null);
  const [mentionOnly, setMentionOnly] = (0, import_react17.useState)(false);
  const uniqueAuthors = Array.from(new Set(pins.map((p) => p.author).filter((a) => !!a)));
  const byAuthor = authorFilter ? pins.filter((p) => p.author === authorFilter) : pins;
  const filteredPins = mentionOnly && currentAuthor ? byAuthor.filter((p) => isMentioned(p, currentAuthor)) : byAuthor;
  const mentionCount = currentAuthor ? pins.filter((p) => isMentioned(p, currentAuthor)).length : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "div",
    {
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 252,
        background: DARK.bg,
        borderRight: `1px solid ${DARK.brd}`,
        boxShadow: "4px 0 24px rgba(0,0,0,.3)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_FAMILY
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("style", { children: `
        .sb-scroll::-webkit-scrollbar{width:4px;height:4px}
        .sb-scroll::-webkit-scrollbar-track{background:transparent}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:10px}
        .sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26)}
        .sb-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
      ` }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { padding: "14px 16px", background: DARK.bg2, flexShrink: 0, borderBottom: `1px solid ${DARK.brd}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { fontSize: 12, fontWeight: 700, color: DARK.txt, display: "flex", alignItems: "center", gap: 5 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconDocument, { size: 13, color: DARK.txt }),
                " \uBC88\uD638 \uBAA9\uB85D"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { fontSize: 10, color: DARK.txL, marginTop: 2, fontFamily: "monospace" }, children: pageId })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "button",
              {
                onClick: onClose,
                style: {
                  background: "rgba(255,255,255,.08)",
                  border: "none",
                  color: DARK.txS,
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 14
                },
                children: "\xD7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { style: { fontSize: 11, color: DARK.txL }, children: [
              "\uCD1D ",
              filteredPins.length,
              "\uAC1C"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
              currentAuthor && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                "button",
                {
                  onClick: () => mentionCount > 0 && setMentionOnly((v) => !v),
                  title: mentionCount === 0 ? "\uBA58\uC158\uB41C \uD56D\uBAA9 \uC5C6\uC74C" : mentionOnly ? "\uC804\uCCB4 \uBCF4\uAE30" : "\uB0B4\uAC00 \uBA58\uC158\uB41C \uD56D\uBAA9\uB9CC \uBCF4\uAE30",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 8px",
                    borderRadius: 2,
                    border: `1px solid ${mentionOnly ? "rgba(217,119,87,.6)" : DARK.brd}`,
                    background: mentionOnly ? "rgba(217,119,87,.18)" : "rgba(255,255,255,.04)",
                    color: mentionOnly ? "#D97757" : mentionCount === 0 ? DARK.txS : DARK.txL,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: mentionCount > 0 ? "pointer" : "default",
                    transition: "all .15s",
                    opacity: mentionCount === 0 ? 0.5 : 1
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: "@\uBA58\uC158" }),
                    mentionCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: {
                      background: mentionOnly ? "#D97757" : "rgba(217,119,87,.4)",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "0 5px",
                      fontSize: 9,
                      fontWeight: 700,
                      minWidth: 14,
                      textAlign: "center"
                    }, children: mentionCount })
                  ]
                }
              ),
              resolvedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                "button",
                {
                  onClick: onToggleShowResolved,
                  title: showResolved ? "\uD574\uACB0\uB41C \uD56D\uBAA9 \uC228\uAE30\uAE30" : "\uD574\uACB0\uB41C \uD56D\uBAA9 \uBCF4\uAE30",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 8px",
                    borderRadius: 2,
                    border: `1px solid ${showResolved ? "rgba(22,163,74,.5)" : DARK.brd}`,
                    background: showResolved ? "rgba(22,163,74,.15)" : "rgba(255,255,255,.04)",
                    color: showResolved ? "#4ade80" : DARK.txL,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .15s"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { fontSize: 11 }, children: showResolved ? "\u2713" : "\u25CB" }),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
                      "\uD574\uACB0 ",
                      resolvedCount
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
            "select",
            {
              value: authorFilter ?? "",
              onChange: (e) => setAuthorFilter(e.target.value || null),
              disabled: uniqueAuthors.length === 0,
              style: {
                width: "100%",
                padding: "4px 8px",
                background: DARK.bg3,
                border: `1px solid ${authorFilter ? "rgba(59,130,246,.5)" : DARK.brd}`,
                borderRadius: 2,
                color: authorFilter ? DARK.txt : DARK.txL,
                fontSize: 11,
                cursor: uniqueAuthors.length > 0 ? "pointer" : "default",
                outline: "none",
                fontFamily: FONT_FAMILY,
                opacity: uniqueAuthors.length === 0 ? 0.4 : 1
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "", style: { background: DARK.bg3, color: DARK.txL }, children: "\uC804\uCCB4 \uC791\uC131\uC790" }),
                uniqueAuthors.map((a) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: a, style: { background: DARK.bg3, color: DARK.txt }, children: a }, a))
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: 8 }, children: filteredPins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "div",
          {
            style: {
              textAlign: "center",
              color: DARK.txL,
              fontSize: 12,
              marginTop: 36,
              lineHeight: 1.8
            },
            children: mentionOnly ? `@${currentAuthor}\uB85C \uBA58\uC158\uB41C \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.` : authorFilter ? "\uC120\uD0DD\uD55C \uC791\uC131\uC790\uC758 \uD540\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." : /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("br", {}),
              "\uC544\uC9C1 \uCD94\uAC00\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("br", {}),
              "\uD654\uBA74\uC744 \uD074\uB9AD\uD574\uC11C \uCD94\uAC00\uD558\uC138\uC694."
            ] })
          }
        ) : filteredPins.map((p) => {
          const sel = p.id === selectedId;
          const hov = p.id === hoveredId;
          const label = p.labelId ? labelById.get(p.labelId) : void 0;
          const color = label?.color ?? FALLBACK_LABEL_COLOR;
          const resolved = p.status === "resolved";
          return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
            "div",
            {
              onClick: () => onSelect(p.id),
              onMouseEnter: () => onHover?.(p.id),
              onMouseLeave: () => onHover?.(null),
              style: {
                padding: "10px 12px",
                borderRadius: 2,
                marginBottom: 4,
                cursor: "pointer",
                border: `1px solid ${sel ? color : hov ? color : DARK.brd}`,
                background: sel ? `${color}1a` : hov ? `${color}0d` : DARK.bg2,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                transition: "all .12s",
                opacity: resolved ? 0.6 : 1
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                  "div",
                  {
                    style: {
                      position: "relative",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: color,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: [
                      p.num,
                      resolved && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: -3,
                            right: -3,
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#16a34a",
                            color: "#fff",
                            fontSize: 7,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1.5px solid #fff"
                          },
                          children: "\u2713"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: DARK.txt, overflow: "hidden" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      "span",
                      {
                        style: {
                          padding: "1px 7px",
                          borderRadius: 999,
                          background: `${color}22`,
                          color,
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                          textDecoration: resolved ? "line-through" : "none"
                        },
                        children: label?.name ?? "\uBBF8\uBD84\uB958"
                      }
                    ),
                    resolved && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { fontSize: 9, padding: "1px 5px", background: "rgba(22,163,74,.2)", color: "#4ade80", borderRadius: 5, fontWeight: 700, flexShrink: 0 }, children: "\uD574\uACB0" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, marginTop: 2 }, children: [
                    p.author && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { fontSize: 10, color: DARK.txL }, children: p.author }),
                    p.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { style: { fontSize: 9, padding: "1px 5px", background: "rgba(59,130,246,.2)", color: "#93C5FD", borderRadius: 5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(IconChat, { size: 9, color: "#93C5FD" }),
                      " ",
                      p.comments.length
                    ] })
                  ] }),
                  p.note && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { fontSize: 11, color: DARK.txL, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.note })
                ] })
              ]
            },
            p.id
          );
        }) })
      ]
    }
  );
}

// src/httpAdapter.ts
function httpAdapter(options) {
  const base = options.baseUrl.replace(/\/+$/, "");
  const apiKey = options.apiKey;
  if (!apiKey) {
    throw new Error("[specbridge] httpAdapter: apiKey is required");
  }
  const onError = options.onError ?? ((e, ctx) => console.error("[specbridge:http]", ctx, e));
  async function request(method, path, body) {
    const url = `${base}${path}`;
    const init = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-SpecBridge-SDK-Version": SDK_VERSION
      },
      body: body === void 0 ? void 0 : JSON.stringify(body),
      ...options.fetchInit?.(path) ?? {}
    };
    const res = await fetch(url, init);
    if (!res.ok) {
      let detail = "";
      let userMessage;
      try {
        const body2 = await res.json();
        detail = JSON.stringify(body2);
        if (body2?.error) userMessage = body2.error;
      } catch {
        try {
          detail = await res.text();
        } catch {
        }
      }
      const err2 = Object.assign(
        new Error(`${method} ${path} \u2192 ${res.status} ${detail}`),
        { status: res.status, userMessage }
      );
      onError(err2, { method, path });
      throw err2;
    }
    if (res.status === 204) return void 0;
    return await res.json();
  }
  return {
    async loadAnnotations() {
      return request("GET", "/api/annotations");
    },
    async loadLabels() {
      return request("GET", "/api/labels");
    },
    async loadAuthor() {
      try {
        return localStorage.getItem("cs_annot_author") ?? "";
      } catch {
        return "";
      }
    },
    async loadLastLabelId() {
      try {
        return localStorage.getItem("cs_annot_last_label_v1");
      } catch {
        return null;
      }
    },
    async saveAuthor(name) {
      try {
        localStorage.setItem("cs_annot_author", name);
      } catch {
      }
    },
    async saveLastLabelId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_last_label_v1");
        else localStorage.setItem("cs_annot_last_label_v1", id);
      } catch {
      }
    },
    async loadAuthorDefaultLabelId() {
      try {
        return localStorage.getItem("cs_annot_author_default_label");
      } catch {
        return null;
      }
    },
    async saveAuthorDefaultLabelId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_author_default_label");
        else localStorage.setItem("cs_annot_author_default_label", id);
      } catch {
      }
    },
    async createLabel(input) {
      return request("POST", "/api/labels", input);
    },
    async updateLabel(id, patch) {
      return request("PATCH", `/api/labels/${encodeURIComponent(id)}`, patch);
    },
    async deleteLabel(id) {
      await request("DELETE", `/api/labels/${encodeURIComponent(id)}`);
    },
    async createPin(input) {
      return request("POST", "/api/pins", input);
    },
    async updatePin(id, patch) {
      return request("PATCH", `/api/pins/${encodeURIComponent(id)}`, patch);
    },
    async deletePin(id) {
      await request("DELETE", `/api/pins/${encodeURIComponent(id)}`);
    },
    async resolvePin(id, by) {
      return request("POST", `/api/pins/${encodeURIComponent(id)}/resolve`, { by });
    },
    async reopenPin(id) {
      return request("POST", `/api/pins/${encodeURIComponent(id)}/reopen`);
    },
    async addComment(pinId, author, text) {
      return request(
        "POST",
        `/api/pins/${encodeURIComponent(pinId)}/comments`,
        { author, text }
      );
    },
    async updateComment(commentId, text) {
      return request("PATCH", `/api/comments/${encodeURIComponent(commentId)}`, { text });
    },
    async deleteComment(commentId) {
      await request("DELETE", `/api/comments/${encodeURIComponent(commentId)}`);
    },
    // ── Sessions ─────────────────────────────────────────────
    async loadSessions() {
      return request("GET", "/api/sessions");
    },
    async createSession(name, options2) {
      return request("POST", "/api/sessions", { name, ...options2 });
    },
    async updateSession(id, patch) {
      return request("PATCH", `/api/sessions/${encodeURIComponent(id)}`, patch);
    },
    async deleteSession(id) {
      await request("DELETE", `/api/sessions/${encodeURIComponent(id)}`);
    },
    async loadCurrentSessionId() {
      try {
        return localStorage.getItem("cs_annot_current_session");
      } catch {
        return null;
      }
    },
    async saveCurrentSessionId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_current_session");
        else localStorage.setItem("cs_annot_current_session", id);
      } catch {
      }
    },
    // ── 프로젝트 전역 설정 (meta) ──────────────────────────
    async loadSetting(key) {
      try {
        const res = await request("GET", `/api/meta/${encodeURIComponent(key)}`);
        return res.value;
      } catch {
        return null;
      }
    },
    async saveSetting(key, value) {
      await request("PUT", `/api/meta/${encodeURIComponent(key)}`, { value });
    },
    async checkSdkVersion() {
      try {
        const res = await fetch(`${base}/api/sdk/version`, {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) return { latest: null, minimum: null };
        const data = await res.json();
        return { latest: data.latest ?? null, minimum: data.minimum ?? null };
      } catch {
        return { latest: null, minimum: null };
      }
    },
    // ── Page Spec ────────────────────────────────────────────
    async loadPageSpecs(pageId) {
      return request("GET", `/api/page-specs?pageId=${encodeURIComponent(pageId)}`);
    },
    async loadAllPageSpecs() {
      return request("GET", "/api/page-specs");
    },
    // ── Screen Spec ──────────────────────────────────────
    async loadScreenSpecs() {
      return request("GET", "/api/screen-specs");
    },
    async loadScreenSpec(pageId) {
      return request("GET", `/api/screen-specs/${encodeURIComponent(pageId)}`);
    },
    async saveScreenSpec(pageId, data) {
      return request("POST", "/api/screen-specs", { pageId, ...data });
    },
    async deleteScreenSpec(pageId) {
      await request("DELETE", `/api/screen-specs/${encodeURIComponent(pageId)}`);
    },
    async savePageSpec(pageId, elementId, data) {
      return request("POST", "/api/page-specs", {
        pageId,
        elementId,
        ...data
      });
    },
    async deletePageSpec(id) {
      await request("DELETE", `/api/page-specs/${id}`);
    },
    // ── Rule Spec ────────────────────────────────────────────
    async loadRuleSpecs() {
      return request("GET", "/api/rule-specs");
    },
    // ── Changelog ────────────────────────────────────────────
    async loadChangelog() {
      return request("GET", "/api/changelog");
    },
    async addChangelogEntry(content, author, date, version) {
      return request("POST", "/api/changelog", { content, author, date: date ?? null, version: version ?? null });
    },
    async deleteChangelogEntry(id) {
      await request("DELETE", `/api/changelog/${encodeURIComponent(id)}`);
    }
  };
}

// src/whoami.ts
async function whoami(options) {
  const url = `${options.baseUrl.replace(/\/+$/, "")}/api/whoami`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${options.apiKey}`
    }
  });
  if (!res.ok) {
    throw new Error(`whoami failed: ${res.status}`);
  }
  return await res.json();
}
//# sourceMappingURL=index.cjs.map