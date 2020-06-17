/*es6-promise-auto v4.1.1*/
!(function(t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : (t.ES6Promise = e());
})(this, function() {
  "use strict";
  function t(t) {
    var e = typeof t;
    return null !== t && ("object" === e || "function" === e);
  }
  function e(t) {
    return "function" == typeof t;
  }
  function n(t) {
    I = t;
  }
  function r(t) {
    J = t;
  }
  function o() {
    return function() {
      return process.nextTick(a);
    };
  }
  function i() {
    return "undefined" != typeof H
      ? function() {
          H(a);
        }
      : c();
  }
  function s() {
    var t = 0,
      e = new V(a),
      n = document.createTextNode("");
    return (
      e.observe(n, { characterData: !0 }),
      function() {
        n.data = t = ++t % 2;
      }
    );
  }
  function u() {
    var t = new MessageChannel();
    return (
      (t.port1.onmessage = a),
      function() {
        return t.port2.postMessage(0);
      }
    );
  }
  function c() {
    var t = setTimeout;
    return function() {
      return t(a, 1);
    };
  }
  function a() {
    for (var t = 0; t < G; t += 2) {
      var e = $[t],
        n = $[t + 1];
      e(n), ($[t] = void 0), ($[t + 1] = void 0);
    }
    G = 0;
  }
  function f() {
    try {
      var t = require,
        e = t("vertx");
      return (H = e.runOnLoop || e.runOnContext), i();
    } catch (n) {
      return c();
    }
  }
  function l(t, e) {
    var n = arguments,
      r = this,
      o = new this.constructor(p);
    void 0 === o[et] && k(o);
    var i = r._state;
    return (
      i
        ? !(function() {
            var t = n[i - 1];
            J(function() {
              return x(i, o, t, r._result);
            });
          })()
        : E(r, o, t, e),
      o
    );
  }
  function h(t) {
    var e = this;
    if (t && "object" == typeof t && t.constructor === e) return t;
    var n = new e(p);
    return g(n, t), n;
  }
  function p() {}
  function v() {
    return new TypeError("You cannot resolve a promise with itself");
  }
  function d() {
    return new TypeError(
      "A promises callback cannot return that same promise."
    );
  }
  function _(t) {
    try {
      return t.then;
    } catch (e) {
      return (it.error = e), it;
    }
  }
  function y(t, e, n, r) {
    try {
      t.call(e, n, r);
    } catch (o) {
      return o;
    }
  }
  function m(t, e, n) {
    J(function(t) {
      var r = !1,
        o = y(
          n,
          e,
          function(n) {
            r || ((r = !0), e !== n ? g(t, n) : S(t, n));
          },
          function(e) {
            r || ((r = !0), j(t, e));
          },
          "Settle: " + (t._label || " unknown promise")
        );
      !r && o && ((r = !0), j(t, o));
    }, t);
  }
  function b(t, e) {
    e._state === rt
      ? S(t, e._result)
      : e._state === ot
      ? j(t, e._result)
      : E(
          e,
          void 0,
          function(e) {
            return g(t, e);
          },
          function(e) {
            return j(t, e);
          }
        );
  }
  function w(t, n, r) {
    n.constructor === t.constructor && r === l && n.constructor.resolve === h
      ? b(t, n)
      : r === it
      ? (j(t, it.error), (it.error = null))
      : void 0 === r
      ? S(t, n)
      : e(r)
      ? m(t, n, r)
      : S(t, n);
  }
  function g(e, n) {
    e === n ? j(e, v()) : t(n) ? w(e, n, _(n)) : S(e, n);
  }
  function A(t) {
    t._onerror && t._onerror(t._result), T(t);
  }
  function S(t, e) {
    t._state === nt &&
      ((t._result = e),
      (t._state = rt),
      0 !== t._subscribers.length && J(T, t));
  }
  function j(t, e) {
    t._state === nt && ((t._state = ot), (t._result = e), J(A, t));
  }
  function E(t, e, n, r) {
    var o = t._subscribers,
      i = o.length;
    (t._onerror = null),
      (o[i] = e),
      (o[i + rt] = n),
      (o[i + ot] = r),
      0 === i && t._state && J(T, t);
  }
  function T(t) {
    var e = t._subscribers,
      n = t._state;
    if (0 !== e.length) {
      for (
        var r = void 0, o = void 0, i = t._result, s = 0;
        s < e.length;
        s += 3
      )
        (r = e[s]), (o = e[s + n]), r ? x(n, r, o, i) : o(i);
      t._subscribers.length = 0;
    }
  }
  function M() {
    this.error = null;
  }
  function P(t, e) {
    try {
      return t(e);
    } catch (n) {
      return (st.error = n), st;
    }
  }
  function x(t, n, r, o) {
    var i = e(r),
      s = void 0,
      u = void 0,
      c = void 0,
      a = void 0;
    if (i) {
      if (
        ((s = P(r, o)),
        s === st ? ((a = !0), (u = s.error), (s.error = null)) : (c = !0),
        n === s)
      )
        return void j(n, d());
    } else (s = o), (c = !0);
    n._state !== nt ||
      (i && c
        ? g(n, s)
        : a
        ? j(n, u)
        : t === rt
        ? S(n, s)
        : t === ot && j(n, s));
  }
  function C(t, e) {
    try {
      e(
        function(e) {
          g(t, e);
        },
        function(e) {
          j(t, e);
        }
      );
    } catch (n) {
      j(t, n);
    }
  }
  function O() {
    return ut++;
  }
  function k(t) {
    (t[et] = ut++),
      (t._state = void 0),
      (t._result = void 0),
      (t._subscribers = []);
  }
  function Y(t, e) {
    (this._instanceConstructor = t),
      (this.promise = new t(p)),
      this.promise[et] || k(this.promise),
      B(e)
        ? ((this.length = e.length),
          (this._remaining = e.length),
          (this._result = new Array(this.length)),
          0 === this.length
            ? S(this.promise, this._result)
            : ((this.length = this.length || 0),
              this._enumerate(e),
              0 === this._remaining && S(this.promise, this._result)))
        : j(this.promise, q());
  }
  function q() {
    return new Error("Array Methods must be provided an Array");
  }
  function F(t) {
    return new Y(this, t).promise;
  }
  function D(t) {
    var e = this;
    return new e(
      B(t)
        ? function(n, r) {
            for (var o = t.length, i = 0; i < o; i++)
              e.resolve(t[i]).then(n, r);
          }
        : function(t, e) {
            return e(new TypeError("You must pass an array to race."));
          }
    );
  }
  function K(t) {
    var e = this,
      n = new e(p);
    return j(n, t), n;
  }
  function L() {
    throw new TypeError(
      "You must pass a resolver function as the first argument to the promise constructor"
    );
  }
  function N() {
    throw new TypeError(
      "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
    );
  }
  function U(t) {
    (this[et] = O()),
      (this._result = this._state = void 0),
      (this._subscribers = []),
      p !== t &&
        ("function" != typeof t && L(), this instanceof U ? C(this, t) : N());
  }
  function W() {
    var t = void 0;
    if ("undefined" != typeof global) t = global;
    else if ("undefined" != typeof self) t = self;
    else
      try {
        t = Function("return this")();
      } catch (e) {
        throw new Error(
          "polyfill failed because global object is unavailable in this environment"
        );
      }
    var n = t.Promise;
    if (n) {
      var r = null;
      try {
        r = Object.prototype.toString.call(n.resolve());
      } catch (e) {}
      if ("[object Promise]" === r && !n.cast) return;
    }
    t.Promise = U;
  }
  var z = void 0;
  z = Array.isArray
    ? Array.isArray
    : function(t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      };
  var B = z,
    G = 0,
    H = void 0,
    I = void 0,
    J = function(t, e) {
      ($[G] = t), ($[G + 1] = e), (G += 2), 2 === G && (I ? I(a) : tt());
    },
    Q = "undefined" != typeof window ? window : void 0,
    R = Q || {},
    V = R.MutationObserver || R.WebKitMutationObserver,
    X =
      "undefined" == typeof self &&
      "undefined" != typeof process &&
      "[object process]" === {}.toString.call(process),
    Z =
      "undefined" != typeof Uint8ClampedArray &&
      "undefined" != typeof importScripts &&
      "undefined" != typeof MessageChannel,
    $ = new Array(1e3),
    tt = void 0;
  tt = X
    ? o()
    : V
    ? s()
    : Z
    ? u()
    : void 0 === Q && "function" == typeof require
    ? f()
    : c();
  var et = Math.random()
      .toString(36)
      .substring(16),
    nt = void 0,
    rt = 1,
    ot = 2,
    it = new M(),
    st = new M(),
    ut = 0;
  return (
    (Y.prototype._enumerate = function(t) {
      for (var e = 0; this._state === nt && e < t.length; e++)
        this._eachEntry(t[e], e);
    }),
    (Y.prototype._eachEntry = function(t, e) {
      var n = this._instanceConstructor,
        r = n.resolve;
      if (r === h) {
        var o = _(t);
        if (o === l && t._state !== nt) this._settledAt(t._state, e, t._result);
        else if ("function" != typeof o)
          this._remaining--, (this._result[e] = t);
        else if (n === U) {
          var i = new n(p);
          w(i, t, o), this._willSettleAt(i, e);
        } else
          this._willSettleAt(
            new n(function(e) {
              return e(t);
            }),
            e
          );
      } else this._willSettleAt(r(t), e);
    }),
    (Y.prototype._settledAt = function(t, e, n) {
      var r = this.promise;
      r._state === nt &&
        (this._remaining--, t === ot ? j(r, n) : (this._result[e] = n)),
        0 === this._remaining && S(r, this._result);
    }),
    (Y.prototype._willSettleAt = function(t, e) {
      var n = this;
      E(
        t,
        void 0,
        function(t) {
          return n._settledAt(rt, e, t);
        },
        function(t) {
          return n._settledAt(ot, e, t);
        }
      );
    }),
    (U.all = F),
    (U.race = D),
    (U.resolve = h),
    (U.reject = K),
    (U._setScheduler = n),
    (U._setAsap = r),
    (U._asap = J),
    (U.prototype = {
      constructor: U,
      then: l,
      catch: function(t) {
        return this.then(null, t);
      }
    }),
    (U.polyfill = W),
    (U.Promise = U),
    U.polyfill(),
    U
  );
});

/*fetch-polyfill v2.0.4*/
!(function(t) {
  "use strict";
  if (!t.fetch) {
    var s = {
      searchParams: "URLSearchParams" in t,
      iterable: "Symbol" in t && "iterator" in Symbol,
      blob:
        "FileReader" in t &&
        "Blob" in t &&
        (function() {
          try {
            return new Blob(), !0;
          } catch (t) {
            return !1;
          }
        })(),
      formData: "FormData" in t,
      arrayBuffer: "ArrayBuffer" in t
    };
    if (s.arrayBuffer)
      var e = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ],
        r = function(t) {
          return t && DataView.prototype.isPrototypeOf(t);
        },
        o =
          ArrayBuffer.isView ||
          function(t) {
            return t && -1 < e.indexOf(Object.prototype.toString.call(t));
          };
    (f.prototype.append = function(t, e) {
      (t = a(t)), (e = h(e));
      var r = this.map[t];
      this.map[t] = r ? r + "," + e : e;
    }),
      (f.prototype.delete = function(t) {
        delete this.map[a(t)];
      }),
      (f.prototype.get = function(t) {
        return (t = a(t)), this.has(t) ? this.map[t] : null;
      }),
      (f.prototype.has = function(t) {
        return this.map.hasOwnProperty(a(t));
      }),
      (f.prototype.set = function(t, e) {
        this.map[a(t)] = h(e);
      }),
      (f.prototype.forEach = function(t, e) {
        for (var r in this.map)
          this.map.hasOwnProperty(r) && t.call(e, this.map[r], r, this);
      }),
      (f.prototype.keys = function() {
        var r = [];
        return (
          this.forEach(function(t, e) {
            r.push(e);
          }),
          u(r)
        );
      }),
      (f.prototype.values = function() {
        var e = [];
        return (
          this.forEach(function(t) {
            e.push(t);
          }),
          u(e)
        );
      }),
      (f.prototype.entries = function() {
        var r = [];
        return (
          this.forEach(function(t, e) {
            r.push([e, t]);
          }),
          u(r)
        );
      }),
      s.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
    var i = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
    (b.prototype.clone = function() {
      return new b(this, { body: this._bodyInit });
    }),
      c.call(b.prototype),
      c.call(w.prototype),
      (w.prototype.clone = function() {
        return new w(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }),
      (w.error = function() {
        var t = new w(null, { status: 0, statusText: "" });
        return (t.type = "error"), t;
      });
    var n = [301, 302, 303, 307, 308];
    (w.redirect = function(t, e) {
      if (-1 === n.indexOf(e)) throw new RangeError("Invalid status code");
      return new w(null, { status: e, headers: { location: t } });
    }),
      (t.Headers = f),
      (t.Request = b),
      (t.Response = w),
      (t.fetch = function(r, n) {
        return new Promise(function(o, t) {
          var e = new b(r, n),
            i = new XMLHttpRequest();
          (i.onload = function() {
            var t,
              n,
              e = {
                status: i.status,
                statusText: i.statusText,
                headers:
                  ((t = i.getAllResponseHeaders() || ""),
                  (n = new f()),
                  t
                    .replace(/\r?\n[\t ]+/g, " ")
                    .split(/\r?\n/)
                    .forEach(function(t) {
                      var e = t.split(":"),
                        r = e.shift().trim();
                      if (r) {
                        var o = e.join(":").trim();
                        n.append(r, o);
                      }
                    }),
                  n)
              };
            e.url =
              "responseURL" in i
                ? i.responseURL
                : e.headers.get("X-Request-URL");
            var r = "response" in i ? i.response : i.responseText;
            o(new w(r, e));
          }),
            (i.onerror = function() {
              t(new TypeError("Network request failed"));
            }),
            (i.ontimeout = function() {
              t(new TypeError("Network request failed"));
            }),
            i.open(e.method, e.url, !0),
            "include" === e.credentials
              ? (i.withCredentials = !0)
              : "omit" === e.credentials && (i.withCredentials = !1),
            "responseType" in i && s.blob && (i.responseType = "blob"),
            e.headers.forEach(function(t, e) {
              i.setRequestHeader(e, t);
            }),
            i.send(void 0 === e._bodyInit ? null : e._bodyInit);
        });
      }),
      (t.fetch.polyfill = !0);
  }
  function a(t) {
    if (
      ("string" != typeof t && (t = String(t)),
      /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))
    )
      throw new TypeError("Invalid character in header field name");
    return t.toLowerCase();
  }
  function h(t) {
    return "string" != typeof t && (t = String(t)), t;
  }
  function u(e) {
    var t = {
      next: function() {
        var t = e.shift();
        return { done: void 0 === t, value: t };
      }
    };
    return (
      s.iterable &&
        (t[Symbol.iterator] = function() {
          return t;
        }),
      t
    );
  }
  function f(e) {
    (this.map = {}),
      e instanceof f
        ? e.forEach(function(t, e) {
            this.append(e, t);
          }, this)
        : Array.isArray(e)
        ? e.forEach(function(t) {
            this.append(t[0], t[1]);
          }, this)
        : e &&
          Object.getOwnPropertyNames(e).forEach(function(t) {
            this.append(t, e[t]);
          }, this);
  }
  function d(t) {
    if (t.bodyUsed) return Promise.reject(new TypeError("Already read"));
    t.bodyUsed = !0;
  }
  function y(r) {
    return new Promise(function(t, e) {
      (r.onload = function() {
        t(r.result);
      }),
        (r.onerror = function() {
          e(r.error);
        });
    });
  }
  function l(t) {
    var e = new FileReader(),
      r = y(e);
    return e.readAsArrayBuffer(t), r;
  }
  function p(t) {
    if (t.slice) return t.slice(0);
    var e = new Uint8Array(t.byteLength);
    return e.set(new Uint8Array(t)), e.buffer;
  }
  function c() {
    return (
      (this.bodyUsed = !1),
      (this._initBody = function(t) {
        if ((this._bodyInit = t))
          if ("string" == typeof t) this._bodyText = t;
          else if (s.blob && Blob.prototype.isPrototypeOf(t))
            this._bodyBlob = t;
          else if (s.formData && FormData.prototype.isPrototypeOf(t))
            this._bodyFormData = t;
          else if (s.searchParams && URLSearchParams.prototype.isPrototypeOf(t))
            this._bodyText = t.toString();
          else if (s.arrayBuffer && s.blob && r(t))
            (this._bodyArrayBuffer = p(t.buffer)),
              (this._bodyInit = new Blob([this._bodyArrayBuffer]));
          else {
            if (
              !s.arrayBuffer ||
              (!ArrayBuffer.prototype.isPrototypeOf(t) && !o(t))
            )
              throw new Error("unsupported BodyInit type");
            this._bodyArrayBuffer = p(t);
          }
        else this._bodyText = "";
        this.headers.get("content-type") ||
          ("string" == typeof t
            ? this.headers.set("content-type", "text/plain;charset=UTF-8")
            : this._bodyBlob && this._bodyBlob.type
            ? this.headers.set("content-type", this._bodyBlob.type)
            : s.searchParams &&
              URLSearchParams.prototype.isPrototypeOf(t) &&
              this.headers.set(
                "content-type",
                "application/x-www-form-urlencoded;charset=UTF-8"
              ));
      }),
      s.blob &&
        ((this.blob = function() {
          var t = d(this);
          if (t) return t;
          if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }),
        (this.arrayBuffer = function() {
          return this._bodyArrayBuffer
            ? d(this) || Promise.resolve(this._bodyArrayBuffer)
            : this.blob().then(l);
        })),
      (this.text = function() {
        var t,
          e,
          r,
          o = d(this);
        if (o) return o;
        if (this._bodyBlob)
          return (
            (t = this._bodyBlob),
            (e = new FileReader()),
            (r = y(e)),
            e.readAsText(t),
            r
          );
        if (this._bodyArrayBuffer)
          return Promise.resolve(
            (function(t) {
              for (
                var e = new Uint8Array(t), r = new Array(e.length), o = 0;
                o < e.length;
                o++
              )
                r[o] = String.fromCharCode(e[o]);
              return r.join("");
            })(this._bodyArrayBuffer)
          );
        if (this._bodyFormData)
          throw new Error("could not read FormData body as text");
        return Promise.resolve(this._bodyText);
      }),
      s.formData &&
        (this.formData = function() {
          return this.text().then(m);
        }),
      (this.json = function() {
        return this.text().then(JSON.parse);
      }),
      this
    );
  }
  function b(t, e) {
    var r,
      o,
      n = (e = e || {}).body;
    if (t instanceof b) {
      if (t.bodyUsed) throw new TypeError("Already read");
      (this.url = t.url),
        (this.credentials = t.credentials),
        e.headers || (this.headers = new f(t.headers)),
        (this.method = t.method),
        (this.mode = t.mode),
        n || null == t._bodyInit || ((n = t._bodyInit), (t.bodyUsed = !0));
    } else this.url = String(t);
    if (
      ((this.credentials = e.credentials || this.credentials || "omit"),
      (!e.headers && this.headers) || (this.headers = new f(e.headers)),
      (this.method =
        ((r = e.method || this.method || "GET"),
        (o = r.toUpperCase()),
        -1 < i.indexOf(o) ? o : r)),
      (this.mode = e.mode || this.mode || null),
      (this.referrer = null),
      ("GET" === this.method || "HEAD" === this.method) && n)
    )
      throw new TypeError("Body not allowed for GET or HEAD requests");
    this._initBody(n);
  }
  function m(t) {
    var n = new FormData();
    return (
      t
        .trim()
        .split("&")
        .forEach(function(t) {
          if (t) {
            var e = t.split("="),
              r = e.shift().replace(/\+/g, " "),
              o = e.join("=").replace(/\+/g, " ");
            n.append(decodeURIComponent(r), decodeURIComponent(o));
          }
        }),
      n
    );
  }
  function w(t, e) {
    e || (e = {}),
      (this.type = "default"),
      (this.status = void 0 === e.status ? 200 : e.status),
      (this.ok = 200 <= this.status && this.status < 300),
      (this.statusText = "statusText" in e ? e.statusText : "OK"),
      (this.headers = new f(e.headers)),
      (this.url = e.url || ""),
      this._initBody(t);
  }
})("undefined" != typeof self ? self : this);
