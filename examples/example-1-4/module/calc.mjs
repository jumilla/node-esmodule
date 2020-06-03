var calc;
(function (calc) {
    calc.add = function (a,b) {
        return a + b;
    }
})(calc || (calc = {}));
export default calc;