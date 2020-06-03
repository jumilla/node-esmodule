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
    const sourcePath = project.modulePathWithoutExtension + '.ts';
    const sourceText = project.sourceMap.sources().map(_ => _.content).join('\n');
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
        declarationMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
        sourceMap: project.config.module.sourceMap != config_1.SourceMapKind.None,
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
    const result = await transpileModule(project, parsed.options, ts.createSourceFile(sourcePath, sourceText, parsed.options.target));
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
            const map = await project.sourceMap.originalSourceMap(JSON.parse(result.moduleMap));
            map.file = moduleName + '.mjs';
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
    };
    const program = ts.createProgram([sourceFile.fileName], options, compilerHost);
    const emitResult = program.emit();
    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    return Object.assign(Object.assign({}, output), emitResult);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBpbGVycy90c2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQTBCO0FBQzFCLHNDQUFpRDtBQUVqRCwyREFBMkI7QUFDM0Isb0RBQXdCO0FBS3hCLElBQUksRUFBYSxDQUFBO0FBYWpCLEtBQUssVUFBVSxLQUFLLENBQ25CLE9BQWdCO0lBRWhCLEVBQUUsR0FBRyx3REFBYSxZQUFZLEdBQUMsQ0FBQTtJQUUvQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLEdBQUcsS0FBSyxDQUFBO0lBRTdELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUU3RSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTTtJQUNwQyw2QkFBNkI7SUFDN0I7UUFDQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsUUFBUTtRQUNoQixnQkFBZ0IsRUFBRSxNQUFNO1FBQ3hCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLE1BQU0sRUFBRSxJQUFJO1FBQ1osWUFBWSxFQUFFLElBQUk7UUFDbEIsZUFBZSxFQUFFLElBQUk7UUFDckIsY0FBYyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxzQkFBYSxDQUFDLElBQUk7UUFDckUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxzQkFBYSxDQUFDLElBQUk7S0FDaEU7SUFFRCw0QkFBNEI7SUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUN6QyxDQUFBO0lBRUQsSUFBSSxPQUFPLENBQUMs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