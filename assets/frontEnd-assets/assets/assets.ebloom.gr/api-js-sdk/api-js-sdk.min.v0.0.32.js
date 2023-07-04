!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = t())
        : "function" == typeof define && define.amd
        ? define(t)
        : ((e = e || self).ApiJsSdk = t());
})(this, function () {
    "use strict";
    function n(r, o) {
        return function () {
            for (var e = new Array(arguments.length), t = 0; t < e.length; t++)
                e[t] = arguments[t];
            return r.apply(o, e);
        };
    }
    var t = Object.prototype.toString;
    function i(e) {
        return "[object Array]" === t.call(e);
    }
    function r(e) {
        return null !== e && "object" == typeof e;
    }
    function o(e) {
        return "[object Function]" === t.call(e);
    }
    function s(e, t) {
        if (null != e)
            if (("object" != typeof e && (e = [e]), i(e)))
                for (var r = 0, o = e.length; r < o; r++)
                    t.call(null, e[r], r, e);
            else
                for (var n in e)
                    Object.prototype.hasOwnProperty.call(e, n) &&
                        t.call(null, e[n], n, e);
    }
    var p = {
        isArray: i,
        isArrayBuffer: function (e) {
            return "[object ArrayBuffer]" === t.call(e);
        },
        isBuffer: function (e) {
            return (
                null != e &&
                null != e.constructor &&
                "function" == typeof e.constructor.isBuffer &&
                e.constructor.isBuffer(e)
            );
        },
        isFormData: function (e) {
            return "undefined" != typeof FormData && e instanceof FormData;
        },
        isArrayBufferView: function (e) {
            return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
                ? ArrayBuffer.isView(e)
                : e && e.buffer && e.buffer instanceof ArrayBuffer;
        },
        isString: function (e) {
            return "string" == typeof e;
        },
        isNumber: function (e) {
            return "number" == typeof e;
        },
        isObject: r,
        isUndefined: function (e) {
            return void 0 === e;
        },
        isDate: function (e) {
            return "[object Date]" === t.call(e);
        },
        isFile: function (e) {
            return "[object File]" === t.call(e);
        },
        isBlob: function (e) {
            return "[object Blob]" === t.call(e);
        },
        isFunction: o,
        isStream: function (e) {
            return r(e) && o(e.pipe);
        },
        isURLSearchParams: function (e) {
            return (
                "undefined" != typeof URLSearchParams &&
                e instanceof URLSearchParams
            );
        },
        isStandardBrowserEnv: function () {
            return (
                ("undefined" == typeof navigator ||
                    ("ReactNative" !== navigator.product &&
                        "NativeScript" !== navigator.product &&
                        "NS" !== navigator.product)) &&
                "undefined" != typeof window &&
                "undefined" != typeof document
            );
        },
        forEach: s,
        merge: function r() {
            var o = {};
            function e(e, t) {
                "object" == typeof o[t] && "object" == typeof e
                    ? (o[t] = r(o[t], e))
                    : (o[t] = e);
            }
            for (var t = 0, n = arguments.length; t < n; t++)
                s(arguments[t], e);
            return o;
        },
        deepMerge: function r() {
            var o = {};
            function e(e, t) {
                "object" == typeof o[t] && "object" == typeof e
                    ? (o[t] = r(o[t], e))
                    : (o[t] = "object" == typeof e ? r({}, e) : e);
            }
            for (var t = 0, n = arguments.length; t < n; t++)
                s(arguments[t], e);
            return o;
        },
        extend: function (r, e, o) {
            return (
                s(e, function (e, t) {
                    r[t] = o && "function" == typeof e ? n(e, o) : e;
                }),
                r
            );
        },
        trim: function (e) {
            return e.replace(/^\s*/, "").replace(/\s*$/, "");
        },
    };
    function a(e) {
        return encodeURIComponent(e)
            .replace(/%40/gi, "@")
            .replace(/%3A/gi, ":")
            .replace(/%24/g, "$")
            .replace(/%2C/gi, ",")
            .replace(/%20/g, "+")
            .replace(/%5B/gi, "[")
            .replace(/%5D/gi, "]");
    }
    function f(e, t, r) {
        if (!t) return e;
        var o;
        if (r) o = r(t);
        else if (p.isURLSearchParams(t)) o = t.toString();
        else {
            var n = [];
            p.forEach(t, function (e, t) {
                null != e &&
                    (p.isArray(e) ? (t += "[]") : (e = [e]),
                    p.forEach(e, function (e) {
                        p.isDate(e)
                            ? (e = e.toISOString())
                            : p.isObject(e) && (e = JSON.stringify(e)),
                            n.push(a(t) + "=" + a(e));
                    }));
            }),
                (o = n.join("&"));
        }
        if (o) {
            var i = e.indexOf("#");
            -1 !== i && (e = e.slice(0, i)),
                (e += (-1 === e.indexOf("?") ? "?" : "&") + o);
        }
        return e;
    }
    function e() {
        this.handlers = [];
    }
    (e.prototype.use = function (e, t) {
        return (
            this.handlers.push({ fulfilled: e, rejected: t }),
            this.handlers.length - 1
        );
    }),
        (e.prototype.eject = function (e) {
            this.handlers[e] && (this.handlers[e] = null);
        }),
        (e.prototype.forEach = function (t) {
            p.forEach(this.handlers, function (e) {
                null !== e && t(e);
            });
        });
    function u(t, r, e) {
        return (
            p.forEach(e, function (e) {
                t = e(t, r);
            }),
            t
        );
    }
    function c(e) {
        return !(!e || !e.__CANCEL__);
    }
    function d(r, o) {
        p.forEach(r, function (e, t) {
            t !== o &&
                t.toUpperCase() === o.toUpperCase() &&
                ((r[o] = e), delete r[t]);
        });
    }
    function l(e, t, r, o, n) {
        return (function (e, t, r, o, n) {
            return (
                (e.config = t),
                r && (e.code = r),
                (e.request = o),
                (e.response = n),
                (e.isAxiosError = !0),
                (e.toJSON = function () {
                    return {
                        message: this.message,
                        name: this.name,
                        description: this.description,
                        number: this.number,
                        fileName: this.fileName,
                        lineNumber: this.lineNumber,
                        columnNumber: this.columnNumber,
                        stack: this.stack,
                        config: this.config,
                        code: this.code,
                    };
                }),
                e
            );
        })(new Error(e), t, r, o, n);
    }
    var h,
        m,
        g,
        y = e,
        v = [
            "age",
            "authorization",
            "content-length",
            "content-type",
            "etag",
            "expires",
            "from",
            "host",
            "if-modified-since",
            "if-unmodified-since",
            "last-modified",
            "location",
            "max-forwards",
            "proxy-authorization",
            "referer",
            "retry-after",
            "user-agent",
        ],
        b = p.isStandardBrowserEnv()
            ? ((m = /(msie|trident)/i.test(navigator.userAgent)),
              (g = document.createElement("a")),
              (h = w(window.location.href)),
              function (e) {
                  var t = p.isString(e) ? w(e) : e;
                  return t.protocol === h.protocol && t.host === h.host;
              })
            : function () {
                  return !0;
              };
    function w(e) {
        var t = e;
        return (
            m && (g.setAttribute("href", t), (t = g.href)),
            g.setAttribute("href", t),
            {
                href: g.href,
                protocol: g.protocol ? g.protocol.replace(/:$/, "") : "",
                host: g.host,
                search: g.search ? g.search.replace(/^\?/, "") : "",
                hash: g.hash ? g.hash.replace(/^#/, "") : "",
                hostname: g.hostname,
                port: g.port,
                pathname:
                    "/" === g.pathname.charAt(0)
                        ? g.pathname
                        : "/" + g.pathname,
            }
        );
    }
    function j(c) {
        return new Promise(function (r, o) {
            var n = c.data,
                i = c.headers;
            p.isFormData(n) && delete i["Content-Type"];
            var s = new XMLHttpRequest();
            if (c.auth) {
                var e = c.auth.username || "",
                    t = c.auth.password || "";
                i.Authorization = "Basic " + btoa(e + ":" + t);
            }
            if (
                (s.open(
                    c.method.toUpperCase(),
                    f(c.url, c.params, c.paramsSerializer),
                    !0
                ),
                (s.timeout = c.timeout),
                (s.onreadystatechange = function () {
                    if (
                        s &&
                        4 === s.readyState &&
                        (0 !== s.status ||
                            (s.responseURL &&
                                0 === s.responseURL.indexOf("file:")))
                    ) {
                        var e =
                                "getAllResponseHeaders" in s
                                    ? (function (e) {
                                          var t,
                                              r,
                                              o,
                                              n = {};
                                          return (
                                              e &&
                                                  p.forEach(
                                                      e.split("\n"),
                                                      function (e) {
                                                          if (
                                                              ((o = e.indexOf(
                                                                  ":"
                                                              )),
                                                              (t = p
                                                                  .trim(
                                                                      e.substr(
                                                                          0,
                                                                          o
                                                                      )
                                                                  )
                                                                  .toLowerCase()),
                                                              (r = p.trim(
                                                                  e.substr(
                                                                      o + 1
                                                                  )
                                                              )),
                                                              t)
                                                          ) {
                                                              if (
                                                                  n[t] &&
                                                                  0 <=
                                                                      v.indexOf(
                                                                          t
                                                                      )
                                                              )
                                                                  return;
                                                              n[t] =
                                                                  "set-cookie" ===
                                                                  t
                                                                      ? (n[t]
                                                                            ? n[
                                                                                  t
                                                                              ]
                                                                            : []
                                                                        ).concat(
                                                                            [r]
                                                                        )
                                                                      : n[t]
                                                                      ? n[t] +
                                                                        ", " +
                                                                        r
                                                                      : r;
                                                          }
                                                      }
                                                  ),
                                              n
                                          );
                                      })(s.getAllResponseHeaders())
                                    : null,
                            t = {
                                data:
                                    c.responseType && "text" !== c.responseType
                                        ? s.response
                                        : s.responseText,
                                status: s.status,
                                statusText: s.statusText,
                                headers: e,
                                config: c,
                                request: s,
                            };
                        !(function (e, t, r) {
                            var o = r.config.validateStatus;
                            !o || o(r.status)
                                ? e(r)
                                : t(
                                      l(
                                          "Request failed with status code " +
                                              r.status,
                                          r.config,
                                          null,
                                          r.request,
                                          r
                                      )
                                  );
                        })(r, o, t),
                            (s = null);
                    }
                }),
                (s.onabort = function () {
                    s &&
                        (o(l("Request aborted", c, "ECONNABORTED", s)),
                        (s = null));
                }),
                (s.onerror = function () {
                    o(l("Network Error", c, null, s)), (s = null);
                }),
                (s.ontimeout = function () {
                    o(
                        l(
                            "timeout of " + c.timeout + "ms exceeded",
                            c,
                            "ECONNABORTED",
                            s
                        )
                    ),
                        (s = null);
                }),
                p.isStandardBrowserEnv())
            ) {
                var a = S,
                    u =
                        (c.withCredentials || b(c.url)) && c.xsrfCookieName
                            ? a.read(c.xsrfCookieName)
                            : void 0;
                u && (i[c.xsrfHeaderName] = u);
            }
            if (
                ("setRequestHeader" in s &&
                    p.forEach(i, function (e, t) {
                        void 0 === n && "content-type" === t.toLowerCase()
                            ? delete i[t]
                            : s.setRequestHeader(t, e);
                    }),
                c.withCredentials && (s.withCredentials = !0),
                c.responseType)
            )
                try {
                    s.responseType = c.responseType;
                } catch (e) {
                    if ("json" !== c.responseType) throw e;
                }
            "function" == typeof c.onDownloadProgress &&
                s.addEventListener("progress", c.onDownloadProgress),
                "function" == typeof c.onUploadProgress &&
                    s.upload &&
                    s.upload.addEventListener("progress", c.onUploadProgress),
                c.cancelToken &&
                    c.cancelToken.promise.then(function (e) {
                        s && (s.abort(), o(e), (s = null));
                    }),
                void 0 === n && (n = null),
                s.send(n);
        });
    }
    var S = p.isStandardBrowserEnv()
            ? {
                  write: function (e, t, r, o, n, i) {
                      var s = [];
                      s.push(e + "=" + encodeURIComponent(t)),
                          p.isNumber(r) &&
                              s.push("expires=" + new Date(r).toGMTString()),
                          p.isString(o) && s.push("path=" + o),
                          p.isString(n) && s.push("domain=" + n),
                          !0 === i && s.push("secure"),
                          (document.cookie = s.join("; "));
                  },
                  read: function (e) {
                      var t = document.cookie.match(
                          new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
                      );
                      return t ? decodeURIComponent(t[3]) : null;
                  },
                  remove: function (e) {
                      this.write(e, "", Date.now() - 864e5);
                  },
              }
            : {
                  write: function () {},
                  read: function () {
                      return null;
                  },
                  remove: function () {},
              },
        P = { "Content-Type": "application/x-www-form-urlencoded" };
    function A(e, t) {
        !p.isUndefined(e) &&
            p.isUndefined(e["Content-Type"]) &&
            (e["Content-Type"] = t);
    }
    var x,
        C = {
            adapter:
                ("undefined" != typeof process &&
                "[object process]" === Object.prototype.toString.call(process)
                    ? (x = j)
                    : "undefined" != typeof XMLHttpRequest && (x = j),
                x),
            transformRequest: [
                function (e, t) {
                    return (
                        d(t, "Accept"),
                        d(t, "Content-Type"),
                        p.isFormData(e) ||
                        p.isArrayBuffer(e) ||
                        p.isBuffer(e) ||
                        p.isStream(e) ||
                        p.isFile(e) ||
                        p.isBlob(e)
                            ? e
                            : p.isArrayBufferView(e)
                            ? e.buffer
                            : p.isURLSearchParams(e)
                            ? (A(
                                  t,
                                  "application/x-www-form-urlencoded;charset=utf-8"
                              ),
                              e.toString())
                            : p.isObject(e)
                            ? (A(t, "application/json;charset=utf-8"),
                              JSON.stringify(e))
                            : e
                    );
                },
            ],
            transformResponse: [
                function (e) {
                    if ("string" == typeof e)
                        try {
                            e = JSON.parse(e);
                        } catch (e) {}
                    return e;
                },
            ],
            timeout: 0,
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            maxContentLength: -1,
            validateStatus: function (e) {
                return 200 <= e && e < 300;
            },
        };
    (C.headers = { common: { Accept: "application/json, text/plain, */*" } }),
        p.forEach(["delete", "get", "head"], function (e) {
            C.headers[e] = {};
        }),
        p.forEach(["post", "put", "patch"], function (e) {
            C.headers[e] = p.merge(P);
        });
    var E = C;
    function R(e) {
        e.cancelToken && e.cancelToken.throwIfRequested();
    }
    function U(t) {
        return (
            R(t),
            t.baseURL &&
                !(function (e) {
                    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
                })(t.url) &&
                (t.url = (function (e, t) {
                    return t
                        ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "")
                        : e;
                })(t.baseURL, t.url)),
            (t.headers = t.headers || {}),
            (t.data = u(t.data, t.headers, t.transformRequest)),
            (t.headers = p.merge(
                t.headers.common || {},
                t.headers[t.method] || {},
                t.headers || {}
            )),
            p.forEach(
                ["delete", "get", "head", "post", "put", "patch", "common"],
                function (e) {
                    delete t.headers[e];
                }
            ),
            (t.adapter || E.adapter)(t).then(
                function (e) {
                    return (
                        R(t),
                        (e.data = u(e.data, e.headers, t.transformResponse)),
                        e
                    );
                },
                function (e) {
                    return (
                        c(e) ||
                            (R(t),
                            e &&
                                e.response &&
                                (e.response.data = u(
                                    e.response.data,
                                    e.response.headers,
                                    t.transformResponse
                                ))),
                        Promise.reject(e)
                    );
                }
            )
        );
    }
    function N(t, r) {
        r = r || {};
        var o = {};
        return (
            p.forEach(["url", "method", "params", "data"], function (e) {
                void 0 !== r[e] && (o[e] = r[e]);
            }),
            p.forEach(["headers", "auth", "proxy"], function (e) {
                p.isObject(r[e])
                    ? (o[e] = p.deepMerge(t[e], r[e]))
                    : void 0 !== r[e]
                    ? (o[e] = r[e])
                    : p.isObject(t[e])
                    ? (o[e] = p.deepMerge(t[e]))
                    : void 0 !== t[e] && (o[e] = t[e]);
            }),
            p.forEach(
                [
                    "baseURL",
                    "transformRequest",
                    "transformResponse",
                    "paramsSerializer",
                    "timeout",
                    "withCredentials",
                    "adapter",
                    "responseType",
                    "xsrfCookieName",
                    "xsrfHeaderName",
                    "onUploadProgress",
                    "onDownloadProgress",
                    "maxContentLength",
                    "validateStatus",
                    "maxRedirects",
                    "httpAgent",
                    "httpsAgent",
                    "cancelToken",
                    "socketPath",
                ],
                function (e) {
                    void 0 !== r[e]
                        ? (o[e] = r[e])
                        : void 0 !== t[e] && (o[e] = t[e]);
                }
            ),
            o
        );
    }
    function O(e) {
        (this.defaults = e),
            (this.interceptors = { request: new y(), response: new y() });
    }
    (O.prototype.request = function (e, t) {
        "string" == typeof e
            ? ((e = t || {}).url = arguments[0])
            : (e = e || {}),
            ((e = N(this.defaults, e)).method = e.method
                ? e.method.toLowerCase()
                : "get");
        var r = [U, void 0],
            o = Promise.resolve(e);
        for (
            this.interceptors.request.forEach(function (e) {
                r.unshift(e.fulfilled, e.rejected);
            }),
                this.interceptors.response.forEach(function (e) {
                    r.push(e.fulfilled, e.rejected);
                });
            r.length;

        )
            o = o.then(r.shift(), r.shift());
        return o;
    }),
        (O.prototype.getUri = function (e) {
            return (
                (e = N(this.defaults, e)),
                f(e.url, e.params, e.paramsSerializer).replace(/^\?/, "")
            );
        }),
        p.forEach(["delete", "get", "head", "options"], function (r) {
            O.prototype[r] = function (e, t) {
                return this.request(p.merge(t || {}, { method: r, url: e }));
            };
        }),
        p.forEach(["post", "put", "patch"], function (o) {
            O.prototype[o] = function (e, t, r) {
                return this.request(
                    p.merge(r || {}, { method: o, url: e, data: t })
                );
            };
        });
    var k = O;
    function T(e) {
        this.message = e;
    }
    (T.prototype.toString = function () {
        return "Cancel" + (this.message ? ": " + this.message : "");
    }),
        (T.prototype.__CANCEL__ = !0);
    var q = T;
    function B(e) {
        if ("function" != typeof e)
            throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function (e) {
            t = e;
        });
        var r = this;
        e(function (e) {
            r.reason || ((r.reason = new q(e)), t(r.reason));
        });
    }
    (B.prototype.throwIfRequested = function () {
        if (this.reason) throw this.reason;
    }),
        (B.source = function () {
            var t;
            return {
                token: new B(function (e) {
                    t = e;
                }),
                cancel: t,
            };
        });
    var _ = B;
    function L(e) {
        var t = new k(e),
            r = n(k.prototype.request, t);
        return p.extend(r, k.prototype, t), p.extend(r, t), r;
    }
    var D = L(E);
    (D.Axios = k),
        (D.create = function (e) {
            return L(N(D.defaults, e));
        }),
        (D.Cancel = q),
        (D.CancelToken = _),
        (D.isCancel = c),
        (D.all = function (e) {
            return Promise.all(e);
        }),
        (D.spread = function (t) {
            return function (e) {
                return t.apply(null, e);
            };
        });
    var I = D,
        M = D;
    I.default = M;
    var F = I;
    function H(e) {
        return null == e || 0 === e.length;
    }
    var z = {
        errorFormat: function (e) {
            return "[api-js-sdk] " + e;
        },
        error: function (e) {
            return new Error(z.errorFormat(e));
        },
    };
    function X(e) {
        (e = e || {}),
            (this.baseUrl = e.baseUrl || "https://apistg.eBloom.gr"),
            (this.language = e.language || "el"),
            (this.platform = e.platform || "web"),
            (this.version = e.version || "1"),
            (this.userSid = e.userSid || null),
            (this.debug = e.debug || !1),
            this.debug &&
                (console.log(
                    "%csdk::constructor(%coptions%c)",
                    "color: #1e88e5",
                    "color: #f4511e",
                    "color: #1e88e5",
                    e
                ),
                console.log(
                    "%csdk::createAPIInstance(%coptions%c)",
                    "color: #1e88e5",
                    "color: #f4511e",
                    "color: #1e88e5",
                    this.baseUrl,
                    this.language,
                    this.userSid
                )),
            (this.api = (function (e, t, r, o, n) {
                var i = {
                    "Content-Type": "application/json",
                    "Accept-Language": t,
                    "X-core-platform": o,
                    "X-core-version": n,
                };
                r && "" !== r && (i["X-core-session-id"] = r);
                var s = F.create({
                    timeout: 6e4,
                    baseURL: e,
                    headers: i,
                    params: { lang: t },
                });
                return (
                    s.interceptors.response.use(
                        function (e) {
                            return e.data;
                        },
                        function (e) {
                            return console.error(e), Promise.reject(e);
                        }
                    ),
                    s
                );
            })(
                this.baseUrl,
                this.language,
                this.userSid,
                this.platform,
                this.version
            ));
    }
    return (
        (X.prototype.instanceOptions = function () {
            return {
                baseUrl: this.baseUrl,
                language: this.language,
                platform: this.platform,
                version: this.version,
                debug: this.debug,
                userSid: this.userSid,
            };
        }),
        (X.prototype.authenticate = function (e) {
            return new X({
                baseUrl: this.baseUrl,
                language: this.language,
                platform: this.platform,
                version: this.version,
                debug: this.debug,
                userSid: e,
            });
        }),
        (X.prototype.isAuthenticated = function () {
            return (
                this.debug &&
                    console.log(
                        "%csdk.isAuthenticated()",
                        "color: #1e88e5",
                        this.userSid
                    ),
                !H(this.userSid)
            );
        }),
        (X.prototype.provisioning = function () {
            return this.api.get("api/v1/provisioning");
        }),
        (X.prototype.cuisines = function () {
            return this.api.get("v2/cuisines");
        }),
        (X.prototype.login = function (e, t) {
            return H(e) || H(t)
                ? Promise.reject(
                      z.error(
                          "login(email, password): email and password are required"
                      )
                  )
                : this.api.post("api/v1/user/login", { email: e, password: t });
        }),
        (X.prototype.register = function (e, t) {
            return H(e) || H(t)
                ? Promise.reject(
                      z.error(
                          "register(email, password): email and password are required"
                      )
                  )
                : this.api.post("api/v1/user/register", {
                      email: e,
                      email_repeat: e,
                      password: t,
                      password_repeat: t,
                  });
        }),
        (X.prototype.user = function () {
            return this.api.get("api/v1/user/account");
        }),
        (X.prototype.userUpdate = function (e, t, r) {
            return H(e) || H(t) || H(r)
                ? Promise.reject(
                      z.error(
                          "userUpdate(firstName, lastName, cellphone): firstName, lastName and cellphone are required"
                      )
                  )
                : this.api.post("api/v1/user/account", {
                      first_name: e,
                      last_name: t,
                      cellphone: r,
                  });
        }),
        (X.prototype.userConfirm = function () {
            return this.api.post("api/v1/user/confirm");
        }),
        (X.prototype.userAuthenticate = function (e) {
            return H(e)
                ? Promise.reject(
                      z.error("userAuthenticate(code): code is required")
                  )
                : this.api.post("api/v1/user/authenticate", { key: e });
        }),
        (X.prototype.userResetPassword = function (e) {
            return this.api.post("api/v1/user/reset_password", { email: e });
        }),
        (X.prototype.userUpdatePassword = function (e, t) {
            return H(e) || H(t)
                ? Promise.reject(
                      z.error(
                          "userUpdate(currentPassword, newPassword): currentPassword and newPassword are required"
                      )
                  )
                : this.api.post("api/v1/user/account/change_password", {
                      old_password: e,
                      password: t,
                      password_repeat: t,
                  });
        }),
        (X.prototype.reOrder = function (e) {
            return !H(e) && "number" == typeof e && 0 < e
                ? this.api.get("api/v1/order/reorder/" + e)
                : Promise.reject(
                      z.error(
                          "reOrder(orderId): orderId must be a positive number, greater than 0"
                      )
                  );
        }),
        (X.prototype.orderValidate = function (e) {
            return H(e) || "object" != typeof e || Array.isArray(e)
                ? Promise.reject(
                      z.error("orderValidate(cart): cart must be an object")
                  )
                : this.api.post("api/v1/order/validate/", e);
        }),
        (X.prototype.orderSubmit = function (e) {
            return H(e) || "object" != typeof e || Array.isArray(e)
                ? Promise.reject(
                      z.error("orderSubmit(cart): cart must be an object")
                  )
                : this.api.post("api/v1/order/submit", e);
        }),
        (X.prototype.orderSubmitGuest = function (e, t, r) {
            return H(e) || "object" != typeof e || Array.isArray(e)
                ? Promise.reject(
                      z.error("orderSubmit(cart): cart must be an object")
                  )
                : H(t) || "object" != typeof t || Array.isArray(t)
                ? Promise.reject(
                      z.error(
                          "orderSubmit(cart, guest): guest must be an object"
                      )
                  )
                : H(r) || "object" != typeof r || Array.isArray(r)
                ? Promise.reject(
                      z.error(
                          "orderSubmit(cart, guest, address): address must be an object"
                      )
                  )
                : this.api.post("v2/order/submit/guest", {
                      cart: e,
                      guest: t,
                      address: r,
                  });
        }),
        (X.prototype.orderStatus = function (e) {
            return !H(e) && "number" == typeof e && 0 < e
                ? this.api.get("api/v1/order/status/" + e)
                : Promise.reject(
                      z.error(
                          "orderStatus(orderId): orderId must be a positive number, greater than 0"
                      )
                  );
        }),
        (X.prototype.userShopOrders = function (e) {
            return !H(e) && "number" == typeof e && 0 < e
                ? this.api.get("v2/order/restaurant/unique?restaurant_id=" + e)
                : Promise.reject(
                      z.error(
                          "userShopOrders(shopId): shopId must be a positive number, greater than 0"
                      )
                  );
        }),
        (X.prototype.shopById = function (e, t, r) {
            return t
                ? this.api.get("api/v1/business/restaurants/" + e, {
                      params: r,
                  })
                : this.api.get("api/v1/restaurants/" + e, { params: r });
        }),
        (X.prototype.shopByChainSlug = function (e, t, r, o) {
            if (H(e) || H(t) || H(r))
                return Promise.reject(
                    z.error(
                        "shopByChainSlug(chainSlug, latitude, longitude, version?): chainSlug, latitude and longitude are required and must be a string"
                    )
                );
            var n = { chain_slug: e, lat: t, lon: r };
            return (
                H(o) || (n.version = o),
                this.api.get("api/v1/restaurants/single/", { params: n })
            );
        }),
        (X.prototype.shopMenuItem = function (e, t, r) {
            var o = { restaurant_id: e, item_code: t };
            return (
                H(r) || (o.offer_line = r),
                this.api.get("api/v1/restaurants/menuitem/", { params: o })
            );
        }),
        (X.prototype.cartProductPrice = function (e, t) {
            return this.api.post("api/v1/cart/product/price/" + e, t);
        }),
        (X.prototype.pinataOfferList = function (e, t, r) {
            return this.api.get("api/v1/pinata/offer/list", {
                params: { lat: e, lon: t, restaurant_id: r },
            });
        }),
        (X.prototype.pinataOfferReject = function (e) {
            return this.api.get("api/v1/pinata/offer/reject", {
                params: { offer_id: e },
            });
        }),
        (X.prototype.pinataOfferAccept = function (e, t) {
            return this.api.get("api/v1/pinata/offer/accept", {
                params: { offer_id: e, reservation_code: t },
            });
        }),
        (X.prototype.geocode = function (e) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error("geocode(address): address must be a string")
                  )
                : this.api.get("v2/location/geocoding", {
                      params: { address: e },
                  });
        }),
        (X.prototype.reverseGeocode = function (e, t) {
            return H(e) || H(t)
                ? Promise.reject(
                      z.error(
                          "reverseGeocode(latitude, longitude): latitude, longitude are required"
                      )
                  )
                : this.api.get("v2/location/reverseg", {
                      params: { lat: e, lon: t },
                  });
        }),
        (X.prototype.places = function (e) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error("places(address): address must be a string")
                  )
                : this.api.get("v2/location/places", {
                      params: { address: e },
                  });
        }),
        (X.prototype.regionsClients = function () {
            return this.api.get("api/v1/regions/clients");
        }),
        (X.prototype.regions = function () {
            return this.api.get("api/v1/regions");
        }),
        (X.prototype.regionsFind = function (e) {
            return H(e)
                ? Promise.reject(
                      z.error(
                          "regionsFind(slug): slug must not be empty string"
                      )
                  )
                : this.api.get("v3/regions/find", { params: { slug: e } });
        }),
        (X.prototype.notifications = function (e, t) {
            return (
                void 0 === t && (t = {}),
                H(e) || "string" != typeof e
                    ? Promise.reject(
                          z.error(
                              "notifications(view, optionalParameters = {}): view must be a string"
                          )
                      )
                    : this.api.post(
                          "v2/notifications",
                          Object.assign({}, { view: e }, t)
                      )
            );
        }),
        (X.prototype.paymentMethods = function (e) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error(
                          "paymentMethods(gateway): gateway must be a string"
                      )
                  )
                : this.api.get("/api/v1/ext/" + e + "/methods");
        }),
        (X.prototype.paymentMethodInit = function (e) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error(
                          "paymentMethodInit(gateway): gateway must be a string"
                      )
                  )
                : this.api.get("/api/v1/ext/" + e + "/methods/add");
        }),
        (X.prototype.paymentMethodSave = function (e, t) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error(
                          "paymentMethodSave(gateway, nonce): gateway must be a string"
                      )
                  )
                : H(t) || "string" != typeof t
                ? Promise.reject(
                      z.error(
                          "paymentMethodSave(gateway, nonce): nonce must be a string"
                      )
                  )
                : this.api.post("/api/v1/ext/" + e + "/methods/add", {
                      nonce: t,
                  });
        }),
        (X.prototype.paymentMethodDelete = function (e, t) {
            return H(e) || "string" != typeof e
                ? Promise.reject(
                      z.error(
                          "paymentMethodDelete(gateway, token): gateway must be a string"
                      )
                  )
                : H(t) || "string" != typeof t
                ? Promise.reject(
                      z.error(
                          "paymentMethodDelete(gateway, token): token must be a string"
                      )
                  )
                : this.api.post("/api/v1/ext/" + e + "/methods/delete", {
                      token: t,
                  });
        }),
        (X.prototype.categories = function () {
            return this.api.get("v3/categories");
        }),
        (X.prototype.category = function (e) {
            return H(e)
                ? Promise.reject(
                      z.error("category(alias): alias should not be empty")
                  )
                : this.api.get("/v3/categories/" + e);
        }),
        (X.prototype.orderTracking = function (e) {
            return this.api.get("/v3/user/orders/tracking", {
                params: { order_id: e },
            });
        }),
        X
    );
});
//# sourceMappingURL=api-js-sdk.min.VERSION.js.map
