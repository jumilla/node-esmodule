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
const meta_1 = __importDefault(require("../meta"));
const npmlog_1 = __importDefault(require("npmlog"));
const DEFAULT_BABEL_CONFIG = {
    presets: [
        [
            '@babel/preset-env',
            // { targets: { 'esmodules': true }, modules: false },
            { targets: { 'node': '14.0' }, modules: false },
        ],
    ],
    plugins: [],
};
let babel;
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!babel) {
            try {
                babel = yield Promise.resolve().then(() => __importStar(require('@babel/core')));
            }
            catch (error) {
                throw new Error('Need installing "@babel/core".');
            }
        }
        const sourcePath = project.modulePathWithoutExtension + '.js';
        const sourceText = project.sourceMap.wholeContent();
        const options = Object.assign(Object.assign(Object.assign({}, DEFAULT_BABEL_CONFIG), {
            // include: project.sourceMap.sources().map(_ => _.path),
            sourceMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
        }), project.config.babel);
        for (const preset of options.presets) {
            if (Array.isArray(preset) && preset.length >= 2 && preset[1]) {
                preset[1].modules = false;
            }
        }
        try {
            const result = babel.transformSync(sourceText, options);
            if (!result) {
                throw new Error('transform failed.');
            }
            if (result.code) {
                if (project.config.module.sourceMap == config_1.SourceMapKind.None) {
                    writeFile(project, '.mjs', result.code);
                }
                else {
                    const moduleMap = yield project.sourceMap.originalSourceMap(result.map);
                    moduleMap.file = platform_1.default.extractFileTitlePath(project.modulePathWithoutExtension) + '.js';
                    switch (project.config.module.sourceMap) {
                        case config_1.SourceMapKind.File:
                            result.code += '\n' + project.sourceMap.createFileComment(moduleMap);
                            break;
                        case config_1.SourceMapKind.Inline:
                            result.code += '\n' + project.sourceMap.createInlineComment(moduleMap);
                            break;
                    }
                    writeFile(project, '.mjs', result.code);
                    if (project.config.module.sourceMap == config_1.SourceMapKind.File) {
                        writeFile(project, '.mjs.map', JSON.stringify(moduleMap));
                    }
                }
            }
        }
        catch (error) {
            // console.log(345, error.toString())
            // console.log(Object.keys(error.prototype))
            // console.log(error.loc, error.pos, error.code, error.message)
            throw error;
        }
        // console.log(result)
    });
}
function writeFile(project, extension, text) {
    const path = platform_1.default.resolvePath(project.modulePathWithoutExtension + extension);
    platform_1.default.writeFile(path, text);
    npmlog_1.default.info(meta_1.default.program, `'${path}' generated.`);
}
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFDM0IsbURBQTBCO0FBQzFCLG9EQUF3QjtBQUl4QixNQUFNLG9CQUFvQixHQUFHO0lBQzVCLE9BQU8sRUFBRTtRQUNSO1lBQ0MsbUJBQW1CO1lBQ25CLHNEQUFzRDtZQUN0RCxFQUFFLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1NBQy9DO0tBQ0Q7SUFFRCxPQUFPLEVBQUUsRUFBRTtDQUNYLENBQUE7QUFJRCxJQUFJLEtBQW1CLENBQUE7QUFJdkIsU0FBZSxLQUFLLENBQ25CLE9BQWdCOztRQUVoQixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1gsSUFBSTtnQkFDSCxLQUFLLEdBQUcsd0RBQWEsYUFBYSxHQUFDLENBQUE7YUFDbkM7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7YUFDakQ7U0FDRDtRQUVELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUE7UUFFN0QsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUVuRCxNQUFNLE9BQU8saURBRVQsb0JBQW9CLEdBR3BCO1lBQ0YseURBQXlEO1lBQ3pELFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksc0JBQWEsQ0FBQyxJQUFJO1NBQ2hFLEdBR0UsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ3ZCLENBQUE7UUFFRCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFRLEVBQUU7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