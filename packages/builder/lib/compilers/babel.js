"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
let babel;
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            babel = yield Promise.resolve().then(() => __importStar(require('@babel/core')));
            // const result = babel.transformFileSync(project.moduleEsmPath, {
            // 	presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
            // 	plugins: [],
            // })
            // P.writeFile(project.moduleCjsPath, result.code)
            // console.log(result)
        }
        catch (error) {
            throw new Error('Need installing "@babel/core".');
        }
    });
}
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLElBQUksS0FBbUIsQ0FBQTtBQUl2QixTQUFlLEtBQUssQ0FBQyxPQUFnQjs7UUFDcEMsSUFBSTtZQUNILEtBQUssR0FBRyx3REFBYSxhQUFhLEdBQUMsQ0FBQTtZQUNuQyxrRUFBa0U7WUFDbEUsOEVBQThFO1lBQzlFLGdCQUFnQjtZQUNoQixLQUFLO1lBRUwsa0RBQWtEO1lBQ2xELHNCQUFzQjtTQUN0QjtRQUNELE9BQU8sS0FBSyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1NBQ2pEO0lBQ0YsQ0FBQztDQUFBO0FBSUQsa0JBQWU7SUFDZCxLQUFLO0NBQ0wsQ0FBQSJ9