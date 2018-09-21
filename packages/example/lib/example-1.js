"use strict";
var test;
(function (test) {
    test.c = class CC {
        static hoge() {
            return 'hoge'
        }
    }
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
//# sourceMappingURL=a.js.map
"use strict";
var test;
(function (test) {
    function b() {
        return 55;
    }
    test.b = b;
})(test || (test = {}));
//# sourceMappingURL=b.js.map
"use strict";
var test;
(function (test) {
    function z() {
        return 246;
    }
    test.z = z;
})(test || (test = {}));
//# sourceMappingURL=z.js.map
var test;
(function (test) {
    test.version = '1.0.0';
})(test || (test = {}));
export default test;
//# sourceMappingURL=export.js.map
//# sourceMappingURL=lib/example-1.mjs.map
