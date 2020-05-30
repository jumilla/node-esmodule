"use strict";
// "@babel/core": "^7.1.0",
// "@babel/preset-env": "^7.1.0"
// "@babel/plugin-transform-modules-commonjs": "^7.1.0",
Object.defineProperty(exports, "__esModule", { value: true });
function build(project) {
    var babel = require('@babel/core');
    var result = babel.transformFileSync(project.moduleEsmPath, {
        presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
        plugins: [],
    });
    // P.writeFile(project.moduleCjsPath, result.code)
    // console.log(result)
}
exports.default = {
    build: build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwyQkFBMkI7QUFDM0IsZ0NBQWdDO0FBQ2hDLHdEQUF3RDs7QUFLeEQsU0FBUyxLQUFLLENBQUMsT0FBZ0I7SUFDOUIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1FBQzdELE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sRUFBRSxFQUFFO0tBQ1gsQ0FBQyxDQUFBO0lBRUYsa0RBQWtEO0lBQ2xELHNCQUFzQjtBQUN2QixDQUFDO0FBSUQsa0JBQWU7SUFDZCxLQUFLLE9BQUE7Q0FDTCxDQUFBIn0=