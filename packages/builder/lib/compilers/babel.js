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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const platform_1 = __importDefault(require("../platform"));
let babel;
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            babel = yield Promise.resolve().then(() => __importStar(require('@babel/core')));
            const preset = yield Promise.resolve().then(() => __importStar(require('@babel/preset-env')));
            const sourcePath = project.modulePathWithoutExtension + '.js';
            const sourceText = project.sourceMap.wholeContent();
            const options = Object.assign(Object.assign({
                presets: [
                    [
                        require('@babel/preset-env'),
                    ],
                ],
                plugins: [],
            }, {
                // include: project.sourceMap.sources().map(_ => _.path),
                sourceMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
            }), project.config.babel);
            const result = babel.transformSync(sourceText, options);
            if (!result) {
                throw new Error('transform failed.');
            }
            if (result.code) {
                if (project.config.module.sourceMap == config_1.SourceMapKind.Inline) {
                    // TODO
                }
                platform_1.default.writeFile(project.modulePathWithoutExtension + '.mjs', result.code);
            }
            if (result.map) {
                delete result.map.sourcesContent;
                if (project.config.module.sourceMap == config_1.SourceMapKind.File) {
                    platform_1.default.writeFile(project.modulePathWithoutExtension + '.mjs.map', JSON.stringify(result.map));
                }
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFLM0IsSUFBSSxLQUFtQixDQUFBO0FBSXZCLFNBQWUsS0FBSyxDQUFDLE9BQWdCOztRQUNwQyxJQUFJO1lBQ0gsS0FBSyxHQUFHLHdEQUFhLGFBQWEsR0FBQyxDQUFBO1lBRW5DLE1BQU0sTUFBTSxHQUFHLHdEQUFhLG1CQUFtQixHQUFDLENBQUE7WUFFaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQTtZQUU3RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFBO1lBRW5ELE1BQU0sT0FBTywrQkFFVDtnQkFDRixPQUFPLEVBQUU7b0JBQ1I7d0JBQ0MsT0FBTyxDQUFDLG1CQUFtQixDQUFDO3FCQUU1QjtpQkFDRDtnQkFDRCxPQUFPLEVBQUUsRUFBRTthQUNYLEVBR0U7Z0JBQ0YseURBQXlEO2dCQUN6RCxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSTthQUNoRSxHQUdFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUN2QixDQUFBO1lBRUQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFdkQsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7YUFDcEM7WUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsTUFBTSxFQUFFO29CQUM1RCxPQUFPO2lCQUNQO2dCQUNELGtCQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsR0FBRyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3JFO1lBRUQsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNmLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUE7Z0JBRWhDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSSxFQUFFO29CQUMxRCxrQkFBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7aUJBQ3hGO2FBQ0Q7WUFDRCxzQkFBc0I7U0FDdEI7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtTQUNqRDtJQUNGLENBQUM7Q0FBQTtBQUlELGtCQUFlO0lBQ2QsS0FBSztDQUNMLENBQUEifQ==