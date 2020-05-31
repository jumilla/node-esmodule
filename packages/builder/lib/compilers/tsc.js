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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
async function build(project) {
    ts = await Promise.resolve().then(() => __importStar(require('typescript')));
    const sourcePath = project.moduleName + '.ts';
    const sourceText = project.sourceMap.sources().map(_ => _.content).join('\n');
    if (project.moduleSourcePath) {
        platform_1.default.writeFile(project.moduleSourcePath, sourceText);
    }
    const compilerOptions = Object.assign(
    /* default compilerOptions */
    {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true,
        strict: true,
        alwaysStrict: true,
        esModuleInterop: true,
        declarationMap: project.config.out.sourceMap != config_1.SourceMapKind.None,
        sourceMap: project.config.out.sourceMap != config_1.SourceMapKind.None,
    }, 
    /* custom compilerOptions */
    project.config.typescript.compilerOptions);
    const parsed = parseConfig(project, [sourcePath], compilerOptions);
    if (parsed.errors.length > 0) {
        displayDiagnostics(project, parsed.errors);
        return;
    }
    if (parsed.options.locale) {
        ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors);
    }
    const result = await transpileModule(project, parsed.options, ts.createSourceFile(sourcePath, sourceText, parsed.options.target));
    npmlog_1.default.silly('tsc', result.toString());
    displayDiagnostics(project, result.diagnostics);
    const errorOccurred = result.diagnostics.length > 0;
    if (result.diagnostics.length == 0) {
        if (result.moduleMap) {
            result.module += `//# sourceMappingURL=${project.moduleName}.mjs.map`;
        }
        writeFile(project, '.mjs', result.module);
        if (result.declarationMap) {
            result.declaration += `//# sourceMappingURL=${project.moduleName}.d.ts.map`;
        }
        writeFile(project, '.d.ts', result.declaration);
        if (result.moduleMap) {
            const map = await project.sourceMap.originalSourceMap(JSON.parse(result.moduleMap));
            map.file = project.moduleName + '.mjs';
            writeFile(project, '.mjs.map', JSON.stringify(map));
        }
        if (result.declarationMap) {
            const map = await project.sourceMap.originalSourceMap(JSON.parse(result.declarationMap));
            writeFile(project, '.d.ts.map', JSON.stringify(map));
        }
    }
    const exitCode = errorOccurred ? 1 : 0;
    npmlog_1.default.silly('tsc', `Process exiting with code '${exitCode}'.`);
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
async function transpileModule(project, options, sourceFile) {
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
    compilerHost.writeFile = async (fileName, text) => {
        if (fileName.endsWith('.js')) {
            // Quick Fix: import 'xx' -> import 'xx.mjs'
            const sourceDir = platform_1.default.extractDirectoryPath(project.config.out.module);
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
    };
    const program = ts.createProgram([sourceFile.fileName], options, compilerHost);
    const emitResult = program.emit();
    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    return Object.assign(Object.assign({}, output), emitResult);
}
function writeFile(project, extension, text) {
    const path = platform_1.default.resolvePath(project.baseDirectoryPath, project.config.out.module + extension);
    platform_1.default.writeFile(platform_1.default.touchDirectories(path), text);
    npmlog_1.default.info(meta_1.default.program, `'${path}' generated.`);
}
function displayDiagnostics(project, diagnostics) {
    diagnostics.forEach(diagnostic => {
        const loglevel = toLogLevel(diagnostic.category);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
            const { line: lineOfModule, character: column } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const { path, line } = project.sourceMap.getLocation(lineOfModule);
            const location = `${path} (${line + 1},${column + 1})`;
            npmlog_1.default.log(loglevel, 'tsc', `${location}: ${message}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBpbGVycy90c2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQTBCO0FBQzFCLHNDQUF5QztBQUV6QywyREFBMkI7QUFDM0Isb0RBQXdCO0FBS3hCLElBQUksRUFBYSxDQUFBO0FBYWpCLEtBQUssVUFBVSxLQUFLLENBQ25CLE9BQWdCO0lBRWhCLEVBQUUsR0FBRyx3REFBYSxZQUFZLEdBQUMsQ0FBQTtJQUUvQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtJQUU3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFN0UsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDN0Isa0JBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFBO0tBQ2pEO0lBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU07SUFDcEMsNkJBQTZCO0lBQzdCO1FBQ0MsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsZ0JBQWdCLEVBQUUsTUFBTTtRQUN4QixXQUFXLEVBQUUsSUFBSTtRQUNqQixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxJQUFJO1FBQ2xCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLGNBQWMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksc0JBQWEsQ0FBQyxJQUFJO1FBQ2xFLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksc0JBQWEs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