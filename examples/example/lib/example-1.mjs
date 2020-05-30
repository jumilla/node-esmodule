// import * as json5 from 'json5'
var test;
(function (test) {
    test.version = '1.0.0';
    // const bbb = json5
})(test || (test = {}));
var abc = 10;
(function (test) {
    function a() {
        return 99;
    }
    test.a = a;
})(test || (test = {}));
(function (test) {
    function ee() {
        return test.a() + test.b() * 2; //+ keyof()
    }
    test.ee = ee;
})(test || (test = {}));
(function (test) {
    function b() {
        return 55 + abc;
    }
    test.b = b;
})(test || (test = {}));
(function (test) {
    function z() {
        return 246;
    }
    test.z = z;
})(test || (test = {}));
/// <source/>
export default test;
export { test };
