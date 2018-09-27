"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var test;

(function (test) {
  function a() {
    return 99;
  }

  test.a = a;
})(test || (test = {}));

(function (test) {
  function ee() {
    return test.a() + test.b() * 2;
  }

  test.ee = ee;
})(test || (test = {}));

"use strict";

var test;

(function (test) {
  function b() {
    return 55;
  }

  test.b = b;
})(test || (test = {}));

"use strict";

var test;

(function (test) {
  function z() {
    return 246;
  }

  test.z = z;
})(test || (test = {}));

var test;

(function (test) {
  test.version = '1.0.0';
})(test || (test = {}));

var _default = test;
exports.default = _default;