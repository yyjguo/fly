(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * author: wendu
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/

var log = console.log;
var adapter = {
    onRequest: function onRequest(request, responseCallBack) {
        log(request);
        responseCallBack({
            responseText: '{"aa":5}',
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
    }
    //trim
};
var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);

        this.requestHeaders = {};
        this.readyState = 0;
        this.timeout = 0; //无超时
        this.responseURL = "";
        self.responseHeaders = {};
        this.onreadystatechange = this.onprogress = this.onload = this.onerror = this.ontimeout = this.onloadend = null;
    }

    _createClass(Ajax, [{
        key: "_changeReadyState",
        value: function _changeReadyState(state) {
            this.readyState = state;
            this.onreadystatechange && this.onreadystatechange();
        }
    }, {
        key: "_end",
        value: function _end() {
            this.onloadend && this.onloadend();
        }
    }, {
        key: "open",
        value: function open(method, url) {
            this.method = method;
            if (!url) {
                url = location.href;
            } else {
                url = url.trim();
                if (url.indexOf("http") !== 0) {
                    //是浏览器环境
                    if (typeof document !== "undefined") {
                        var t = document.createElement("a");
                        t.href = url;
                        url = t.href;
                    }
                }
            }
            this.responseURL = url;
            this._changeReadyState(1);
        }
    }, {
        key: "send",
        value: function send(arg) {
            //log("send", arguments)
            this.requestHeaders.cookie = document.cookie;
            var self = this;
            if (adapter) {
                var request = {
                    method: self.method,
                    url: self.responseURL, //todo url 合并
                    headers: self.requestHeaders,
                    formData: arg
                };
                self._changeReadyState(3);
                var timer;
                if (self.timeout > 0) {
                    timer = setTimeout(function () {
                        if (self.readyState === 3) {
                            self._end();
                            self._changeReadyState(0);
                        }
                    }, self.timeout);
                }
                adapter.onRequest(request, function (response) {
                    //超时了
                    if (self.readyState !== 3) return;
                    clearTimeout(timer);
                    //网络错误
                    self.status = response.statusCode - 0;
                    if (self.status === 0) {
                        self.statusText = response.responseText;
                        self.onerror && self.onerror();
                    } else {
                        var headers = {};
                        for (var field in response.headers) {

                            var value = response.headers[field];
                            var key = field.toLowerCase();
                            //是数组直接赋值
                            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                                headers[key] = value;
                            } else {
                                headers[key] = headers[key] || [];
                                headers[key].push(value);
                            }
                        }
                        var cookies = headers["set-cookie"];
                        if (cookies) {
                            cookies.forEach(function (e) {
                                document.cookie = e.replace(/;\s*httpOnly/g, "");
                            });
                        }
                        self.responseHeaders = headers;
                        //错误码信息,暂且为状态码
                        self.statusText = "" + self.status;
                        if (self.status >= 200 && self.status < 300) {
                            self.response = self.responseText = response.responseText;
                            var contentType = self.getResponseHeader("content-type");
                            //目前只支持json文档自动解析
                            if (contentType && contentType.indexOf('json') !== -1) {
                                self.response = JSON.parse(response.responseText);
                                //log(self.response)
                            }
                            //回调onload
                            self.onload && self.onload();
                        } else {
                            self.onerror && self.onerror();
                        }
                    }
                    self._changeReadyState(4);
                    self._end();
                });
            } else {
                console.error("Ajax require adapter");
            }
        }
    }, {
        key: "setRequestHeader",
        value: function setRequestHeader(key, value) {
            //应该trim一下
            this.requestHeaders[key] = value;
        }
    }, {
        key: "getResponseHeader",
        value: function getResponseHeader(key) {
            return this.responseHeaders[key].toString();
        }
    }, {
        key: "getAllResponseHeaders",
        value: function getAllResponseHeaders() {
            var str = "";
            for (var key in this.responseHeaders) {
                str += key + ":" + this.getResponseHeader(key) + "\r\n";
            }
            return str;
        }
    }, {
        key: "abort",
        value: function abort() {
            this._changeReadyState(0);
            this._end();
        }
    }], [{
        key: "setAdapter",
        value: function setAdapter(requestAdapter) {
            adapter = requestAdapter;
        }
    }]);

    return Ajax;
}();

module.exports = Ajax;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(2);

var Fly = function () {
    function Fly() {
        var engine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : XMLHttpRequest;

        _classCallCheck(this, Fly);

        this.engine = engine;
        this.interceptors = {
            response: {
                use: function use(handler, onerror) {
                    this.handler = handler;
                    this.onerror = onerror;
                }
            },
            request: {
                use: function use(handler) {
                    this.handler = handler;
                }
            }
        };
        this.config = {
            method: "GET",
            baseURL: "",
            headers: {},
            timeout: 0,
            withCredentials: false
        };
    }

    _createClass(Fly, [{
        key: "ajax",
        value: function ajax() {
            var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            var _this = this;

            var data = arguments[1];
            var options = arguments[2];

            var xhr = new this.engine();

            var promise = new Promise(function (_resolve, _reject) {
                options = options || {};
                var defaultHeaders = {
                    'Content-type': 'application/x-www-form-urlencoded'
                };
                utils.merge(defaultHeaders, _this.config.headers);
                _this.config.headers = defaultHeaders;
                utils.merge(options, _this.config);
                var rqi = _this.interceptors.request;
                var rpi = _this.interceptors.response;
                options.data = data;
                var abort = false;
                var operate = {
                    reject: function reject(e) {
                        abort = true;
                        _reject(e);
                    }, resolve: function resolve(d) {
                        abort = true;
                        _resolve(d);
                    }
                };
                url = utils.trim(url);
                options.method = options.method.toUpperCase();
                options.url = url;
                if (rqi.handler) {
                    options = rqi.handler(options, operate);
                    if (!options) return;
                }
                if (abort) return;
                url = utils.trim(options.url);
                if (!url) url = location.href;
                var baseUrl = utils.trim(options.baseURL);
                if (url.indexOf("http") !== 0) {
                    if (!baseUrl) {
                        var arr = location.pathname.split("/");
                        arr.pop();
                        baseUrl = location.protocol + "//" + location.host + arr.join("/");
                    }
                    if (baseUrl[baseUrl - 1] !== "/") {
                        baseUrl += '/';
                    }
                    url = baseUrl + (url[0] === "/" ? url.substr(1) : url);
                    if (typeof document !== "undefined") {
                        var t = document.createElement("a");
                        t.href = url;
                        url = t.href;
                    }
                }
                xhr.timeout = options.timeout || 0;
                xhr.withCredentials = !!options.withCredentials;
                if (options.method === "GET") {
                    if (options.data) {
                        data = utils.formatParams(options.data);
                        url += (url.indexOf("?") === -1 ? "?" : "&") + data;
                    }
                    xhr.open("GET", url);
                } else {
                    xhr.open("POST", url);
                }
                if (utils.isObject(options.data)) {
                    options.headers["Content-type"] = 'application/json;charset=utf-8';
                    data = JSON.stringify(options.data);
                }

                for (var k in options.headers) {
                    //删除content-type
                    if (k.toLowerCase() === "content-type" && (utils.isFormData(options.data) || !options.data || options.method === "GET")) {
                        delete options.headers[k]; // Let the browser set it
                    } else {
                        xhr.setRequestHeader(k, options.headers[k]);
                    }
                }

                var onerror = function onerror(e) {
                    if (rpi.onerror) {
                        e = rpi.onerror(e, operate);
                    }
                    return e;
                };

                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var response = xhr.responseText;
                        if (xhr.getResponseHeader("Content-Type").indexOf("json") !== -1) {
                            response = JSON.parse(response);
                        }
                        if (rpi.handler) {
                            response = rpi.handler({ xhr: xhr, request: options, data: response }, operate);
                        }
                        if (abort) return;
                        _resolve(response);
                    } else {
                        var err = new Error(xhr.statusText);
                        err.status = xhr.status;
                        err = onerror(err);
                        if (abort) return;
                        _reject(err);
                    }
                };

                xhr.onerror = function () {
                    var err = new Error("net error");
                    err.status = 0;
                    err = onerror(err);
                    if (abort) return;
                    _reject(err);
                };

                xhr.ontimeout = function () {
                    var err = new Error("timeout[" + xhr.timeout + "ms]");
                    err.status = 1;
                    err = onerror(err);
                    if (abort) return;
                    _reject(err);
                };
                xhr.send(data);
            });

            promise.xhr = xhr;
            return promise;
        }
    }, {
        key: "get",
        value: function get(url, data) {
            return this.ajax(url, data);
        }
    }, {
        key: "post",
        value: function post(url, data) {
            return this.ajax(url, data, { method: "POST" });
        }
    }, {
        key: "all",
        value: function all(promises) {
            return Promise.all(promises);
        }
    }]);

    return Fly;
}();

//build环境定义全局变量


;
//build环境定义全局变量
KEEP("!build", function () {
    module.exports = Fly;
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
    type: function type(ob) {
        return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
    },
    isObject: function isObject(ob, real) {
        if (real) {
            return this.type(ob) === "object";
        } else {
            return ob && (typeof ob === 'undefined' ? 'undefined' : _typeof(ob)) === 'object';
        }
    },
    isFormData: function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
    },
    trim: function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    encode: function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    },
    formatParams: function formatParams(data) {
        var arr = [];
        for (var name in data) {
            var value = data[name];
            if (this.isObject(value)) {
                value = JSON.stringify(value);
            }
            arr.push(this.encode(name) + "=" + this.encode(value));
        }
        return arr.join("&");
    },

    //不覆盖已存在的属性
    merge: function merge(a, b) {
        for (var key in b) {
            if (!a[key]) {
                a[key] = b[key];
            } else if (this.isObject(b[key], 1) && this.isObject(a[key], 1)) {
                this.merge(a[key], b[key]);
            }
        }
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//确保dsBridge初始化
window._dsbridge && _dsbridge.init();
var adapter;
if (window.dsBridge) {
    adapter = {
        onRequest: function onRequest(request, responseCallBack) {
            dsBridge.call("onAjaxRequest", request, function (responseData) {
                responseCallBack(JSON.parse(responseData));
            });
            // responseCallBack({
            //     responseText: '{"aa":5}',
            //     statusCode: 200,
            //     headers: {
            //         "Content-Type": "application/json; charset=UTF-8"
            //     }
            // })
        }
    };
} else {
    console.error("dsBridge is not exist!");
}

module.exports = adapter;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by du on 16/12/10.
 */
var engine = __webpack_require__(0);
var adapter = __webpack_require__(3);
var Fly = __webpack_require__(1);
window.axio = new Fly(engine);
var fly = new Fly();
engine.setAdapter(adapter);

//定义公共headers
fly.config.headers = { xx: 5, bb: 6, dd: 7 };

fly.interceptors.request.use(function (config, promise) {
    //可以通过promise.reject／resolve直接中止请求
    console.log("interceptors.request", config);
    config.headers["X-Tag"] = "fly.js";
    return config;
});

fly.interceptors.response.use(function (response, promise) {
    console.log("interceptors.response", response);
    return response.data;
}, function (err, promise) {
    //promise.resolve("ssss")
});

fly.get("../package.json", { aa: 8, bb: 9, tt: { xx: 5 } }).then(function (d) {
    console.log("get result:", d);
}).catch(function (e) {
    return console.log("error", e);
});

fly.post("../package.json", { aa: 8, bb: 9, tt: { xx: 5 } }).then(function (d) {
    console.log("post result:", d);
}).catch(function (e) {
    return console.log("error", e);
});

fly.ajax("../package.json", { hh: 5 }, {
    method: "post"
}).then(function (d) {
    console.log("ajax result:", d);
});

/***/ })
/******/ ]);
});