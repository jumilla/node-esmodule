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
            { targets: { 'node': 'current' }, modules: false },
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
        options.presets = (options.presets || []).map(preset => {
            var _a;
            const envOptions = { modules: false };
            if (typeof preset == 'string') {
                preset = normalizePresetName(preset);
                if (testNameIsPresetEnv(preset)) {
                    return ['@babel/preset-env', envOptions];
                }
            }
            else if (Array.isArray(preset) && preset.length >= 1) {
                preset[0] = normalizePresetName(preset[0]);
                if (testNameIsPresetEnv(preset[0])) {
                    return ['@babel/preset-env', Object.assign(Object.assign({}, (_a = preset[1]) !== null && _a !== void 0 ? _a : {}), envOptions)];
                }
            }
            return preset;
            function normalizePresetName(name) {
                if (typeof name == 'string') {
                    if (name.match(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/))
                        name = '@babel/preset-' + name;
                }
                return name;
            }
            function testNameIsPresetEnv(name) {
                if (name === '@babel/preset-env')
                    return true;
                return false;
            }
        });
        if (project.config.debug.outputSource) {
            platform_1.default.writeFile(platform_1.default.joinPath(project.baseDirectoryPath, project.config.debug.outputSource, 'module.js'), sourceText);
            platform_1.default.writeFile(platform_1.default.joinPath(project.baseDirectoryPath, project.config.debug.outputSource, 'babel.config.json'), JSON.stringify(options, null, '\t'));
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
            displayError(project, error);
            throw error;
        }
    });
}
function writeFile(project, extension, text) {
    const path = platform_1.default.resolvePath(project.modulePathWithoutExtension + extension);
    platform_1.default.writeFile(path, text);
    npmlog_1.default.info(meta_1.default.program, `'${path}' generated.`);
}
function displayError(project, error) {
    // console.log(error.loc, error.pos, error.code, error.message)
    switch (error.code) {
        case 'BABEL_PARSE_ERROR':
            const d = parseBabelParseError(error);
            const { path, line } = project.sourceMap.getLocation(d.line);
            const location = `${path} (${line + 1},${d.column + 1})`;
            npmlog_1.default.error(meta_1.default.program, `${location}: ${d.message}`);
            if (d.additionalMessage) {
                npmlog_1.default.error(meta_1.default.program, d.additionalMessage);
            }
            break;
        default:
            npmlog_1.default.error(meta_1.default.program, error.message);
    }
}
function parseBabelParseError(error) {
    const result = error.message.match(/^(.*?):(.+)\(\d+:\d+\):?\n(.*)$/sm);
    // if (!result) {
    //     console.log(error.message)
    // }
    return {
        source: result ? result[1] : '',
        line: error.loc.line,
        column: error.loc.column,
        message: result ? result[2].trim() : error.message,
        additionalMessage: result ? result[3] : '',
    };
}
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcGlsZXJzL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFDM0IsbURBQTBCO0FBQzFCLG9EQUF3QjtBQUl4QixNQUFNLG9CQUFvQixHQUFHO0lBQzVCLE9BQU8sRUFBRTtRQUNSO1lBQ0MsbUJBQW1CO1lBQ25CLEVBQUUsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7U0FDbEQ7S0FDRDtJQUVELE9BQU8sRUFBRSxFQUFFO0NBQ1gsQ0FBQTtBQUlELElBQUksS0FBbUIsQ0FBQTtBQUl2QixTQUFlLEtBQUssQ0FDbkIsT0FBZ0I7O1FBRWhCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWCxJQUFJO2dCQUNILEtBQUssR0FBRyx3REFBYSxhQUFhLEdBQUMsQ0FBQTthQUNuQztZQUNELE9BQU8sS0FBSyxFQUFFO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTthQUNqRDtTQUNEO1FBRUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQTtRQUU3RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBRW5ELE1BQU0sT0FBTyxpREFFVCxvQkFBb0IsR0FHcEI7WUFDRix5REFBeUQ7WUFDekQsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxzQkFBYSxDQUFDLElBQUk7U0FDaEUsR0FHRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDdkIsQ0FBQTtRQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FB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