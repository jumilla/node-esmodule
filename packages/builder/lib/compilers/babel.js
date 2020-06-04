"use strict";
// "@babel/core": "^7.1.0",
// "@babel/preset-env": "^7.1.0"
// "@babel/plugin-transform-modules-commonjs": "^7.1.0",
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        const babel = require('@babel/core');
        // const result = babel.transformFileSync(project.moduleEsmPath, {
        // 	presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
        // 	plugins: [],
        // })
        // P.writeFile(project.moduleCjsPath, result.code)
        // console.log(result)
    });
}
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSwyQkFBMkI7QUFDM0IsZ0NBQWdDO0FBQ2hDLHdEQUF3RDs7Ozs7Ozs7Ozs7QUFPeEQsU0FBZSxLQUFLLENBQUMsT0FBZ0I7O1FBQ3BDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUNwQyxrRUFBa0U7UUFDbEUsOEVBQThFO1FBQzlFLGdCQUFnQjtRQUNoQixLQUFLO1FBRUwsa0RBQWtEO1FBQ2xELHNCQUFzQjtJQUN2QixDQUFDO0NBQUE7QUFJRCxrQkFBZTtJQUNkLEtBQUs7Q0FDTCxDQUFBIn0=