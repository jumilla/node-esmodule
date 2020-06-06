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
const meta_1 = __importDefault(require("../meta"));
const config_1 = require("../config");
const platform_1 = __importDefault(require("../platform"));
const npmlog_1 = __importDefault(require("npmlog"));
let ts;
const defaultCompilerOptions = {
    target: 'esnext',
    //lib: ['esnext'],
    module: 'esnext',
    moduleResolution: 'node',
    esModuleInterop: true,
    strict: true,
    alwaysStrict: true,
    declaration: true,
};
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ts = yield Promise.resolve().then(() => __importStar(require('typescript')));
        }
        catch (error) {
            throw new Error('Need installing "typescript".');
        }
        const sourcePath = project.modulePathWithoutExtension + '.ts';
        const sourceText = project.sourceMap.wholeContent();
        const compilerOptions = Object.assign(
        /* default compilerOptions */
        defaultCompilerOptions, 
        /* optional compilerOptions */
        {
            sourceMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
            declarationMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
        }, 
        /* custom compilerOptions */
        project.config.typescript.compilerOptions);
        if (project.config.debug.outputSource) {
            platform_1.default.writeFile(platform_1.default.joinPath(project.baseDirectoryPath, project.config.debug.outputSource, 'module.ts'), sourceText);
            platform_1.default.writeFile(platform_1.default.joinPath(project.baseDirectoryPath, project.config.debug.outputSource, 'tsconfig.json'), createTSConfigImage(project.config, compilerOptions));
        }
        const parsed = parseConfig(project, [sourcePath], compilerOptions);
        if (parsed.errors.length > 0) {
            displayDiagnostics(project, parsed.errors);
            return;
        }
        if (parsed.options.locale) {
            ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors);
        }
        const result = yield transpileModule(project, parsed.options, ts.createSourceFile(sourcePath, sourceText, parsed.options.target));
        npmlog_1.default.silly('tsc', result.toString());
        displayDiagnostics(project, result.diagnostics);
        const errorOccurred = result.diagnostics.length > 0;
        if (result.diagnostics.length == 0) {
            const moduleName = platform_1.default.extractFileTitlePath(project.modulePathWithoutExtension);
            if (result.moduleMap) {
                result.module += `//# sourceMappingURL=${moduleName}.mjs.map`;
            }
            writeFile(project, '.mjs', result.module);
            if (result.declarationMap) {
                result.declaration += `//# sourceMappingURL=${moduleName}.d.ts.map`;
            }
            writeFile(project, '.d.ts', result.declaration);
            if (result.moduleMap) {
                const map = yield project.sourceMap.originalSourceMap(JSON.parse(result.moduleMap));
                map.file = moduleName + '.mjs';
                writeFile(project, '.mjs.map', JSON.stringify(map));
            }
            if (result.declarationMap) {
                const map = yield project.sourceMap.originalSourceMap(JSON.parse(result.declarationMap));
                writeFile(project, '.d.ts.map', JSON.stringify(map));
            }
        }
        const exitCode = errorOccurred ? 1 : 0;
        npmlog_1.default.silly('tsc', `Process exiting with code '${exitCode}'.`);
    });
}
function createTSConfigImage(esmc, compilerOptions) {
    const config = {
        compilerOptions,
        include: esmc.source.include,
        exclude: esmc.source.exclude,
    };
    return JSON.stringify(config, null, '\t');
}
function parseConfig(project, sources, compilerOptions) {
    const host = {
        useCaseSensitiveFileNames: false,
        readDirectory: (rootDir, extensions, excludes, includes, depth) => sources,
        fileExists: (path) => platform_1.default.testFileExists(path),
        readFile: (path) => platform_1.default.readFile(path),
    };
    return ts.parseJsonConfigFileContent({ include: sources, compilerOptions }, host, project.baseDirectoryPath);
}
function transpileModule(project, options, sourceFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = {
            module: '',
            declaration: '',
        };
        const compilerHost = ts.createCompilerHost(options);
        const getSourceFileBase = compilerHost.getSourceFile;
        compilerHost.getSourceFile =
            (fileName, languageVersion, onError, shouldCreateNewSourceFile) => fileName === sourceFile.fileName
                ? sourceFile
                : getSourceFileBase(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        compilerHost.writeFile = (fileName, text) => __awaiter(this, void 0, void 0, function* () {
            if (fileName.endsWith('.js')) {
                // Quick Fix: import 'xx' -> import 'xx.mjs'
                const sourceDir = project.moduleDirectoryPath;
                text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, ($0, $1, $2, $3) => {
                    const path = platform_1.default.joinPath(sourceDir, ($2 || $3) + '.mjs');
                    return platform_1.default.testFileExists(path) ? `${$1}'${$2 || $3}.mjs'` : $0;
                });
                text = text.replace(/\/\/#\ssourceMappingURL=.+$/, '');
                output.module = text;
            }
            else if (fileName.endsWith('.d.ts')) {
                text = text.replace(/\/\/#\ssourceMappingURL=.+$/, '');
                output.declaration = text;
            }
            else if (fileName.endsWith('.js.map')) {
                output.moduleMap = text;
            }
            else if (fileName.endsWith('.d.ts.map')) {
                output.declarationMap = text;
            }
            else {
                npmlog_1.default.warn('esmc', 'Unknown generated file.');
            }
        });
        const program = ts.createProgram([sourceFile.fileName], options, compilerHost);
        const emitResult = program.emit();
        emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        return Object.assign(Object.assign({}, output), emitResult);
    });
}
function writeFile(project, extension, text) {
    const path = platform_1.default.resolvePath(project.modulePathWithoutExtension + extension);
    platform_1.default.writeFile(path, text);
    npmlog_1.default.info(meta_1.default.program, `'${path}' generated.`);
}
function displayDiagnostics(project, diagnostics) {
    diagnostics.forEach(diagnostic => {
        const loglevel = toLogLevel(diagnostic.category);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
            const { line: lineOfModule, character: column } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            if (diagnostic.file.fileName == (project.modulePathWithoutExtension + '.ts')) {
                const { path, line } = project.sourceMap.getLocation(lineOfModule);
                const location = `${path} (${line + 1},${column + 1})`;
                npmlog_1.default.log(loglevel, 'tsc', `${location}: ${message}`);
            }
            else {
                const path = platform_1.default.relativePath(project.baseDirectoryPath, diagnostic.file.fileName);
                const line = lineOfModule;
                const location = `${path} (${line + 1},${column + 1})`;
                npmlog_1.default.log(loglevel, 'tsc', `${location}: ${message}`);
            }
        }
        else {
            npmlog_1.default.log(loglevel, 'tsc', message);
        }
    });
    function toLogLevel(category) {
        switch (category) {
            case ts.DiagnosticCategory.Warning:
                return 'warn';
            case ts.DiagnosticCategory.Error:
                return 'error';
            case ts.DiagnosticCategory.Suggestion:
                return 'info';
            case ts.DiagnosticCategory.Message:
                return 'notice';
        }
    }
}
// function getNewLineCharacter(options: ts.CompilerOptions | ts.PrinterOptions): string {
//     const carriageReturnLineFeed = '\r\n';
//     const lineFeed = '\n';
//     switch (options.newLine) {
//         case ts.NewLineKind.CarriageReturnLineFeed:
//             return carriageReturnLineFeed;
//         case ts.NewLineKind.LineFeed:
//             return lineFeed;
//     }
//     return require('os').EOL;
// }
exports.default = {
    build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBpbGVycy90c2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQTBCO0FBQzFCLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFDM0Isb0RBQXdCO0FBS3hCLElBQUksRUFBYSxDQUFBO0FBSWpCLE1BQU0sc0JBQXNCLEdBQUc7SUFDOUIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsa0JBQWtCO0lBQ2xCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGdCQUFnQixFQUFFLE1BQU07SUFDeEIsZUFBZSxFQUFFLElBQUk7SUFDckIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtJQUNsQixXQUFXLEVBQUUsSUFBSTtDQUNqQixDQUFBO0FBWUQsU0FBZSxLQUFLLENBQ25CLE9BQWdCOztRQUVoQixJQUFJO1lBQ0gsRUFBRSxHQUFHLHdEQUFhLFlBQVksR0FBQyxDQUFBO1NBQy9CO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7U0FDaEQ7UUFFRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLEdBQUcsS0FBSyxDQUFBO1FBRTdELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7UUFFbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDcEMsNkJBQTZCO1FBQzdCLHNCQUFzQjtRQUV0Qiw4QkFBOEI7UUFDOUI7WUFDQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSTtZQUNoRSxjQUFjLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLHNCQUFhLENBQUMsSUFBSTtTQUNyRTtRQUVE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