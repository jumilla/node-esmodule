"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("./meta"));
var platform_1 = __importDefault(require("./platform"));
var typescript_1 = __importDefault(require("typescript"));
var npmlog_1 = __importDefault(require("npmlog"));
function build(project) {
    var emitResult = generateModule(project);
    displayDiagnostics(project, emitResult.diagnostics);
    npmlog_1.default.silly('tsc', emitResult.toString());
    if (!emitResult.emitSkipped) {
        npmlog_1.default.info(meta_1.default.program, "'" + project.moduleEsmPath + "' generated.");
    }
    var exitCode = emitResult.emitSkipped ? 1 : 0;
    npmlog_1.default.silly('tsc', "Process exiting with code '" + exitCode + "'.");
}
function displayDiagnostics(project, diagnostics) {
    diagnostics.forEach(function (diagnostic) {
        var loglevel = toLogLevel(diagnostic.category);
        var message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            var location = diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + ")";
            npmlog_1.default.log(loglevel, 'tsc', location + ": " + message);
        }
        else {
            npmlog_1.default.log(loglevel, 'tsc', message);
        }
    });
    function toLogLevel(category) {
        switch (category) {
            case typescript_1.default.DiagnosticCategory.Warning:
                return 'warn';
            case typescript_1.default.DiagnosticCategory.Error:
                return 'error';
            case typescript_1.default.DiagnosticCategory.Suggestion:
                return 'info';
            case typescript_1.default.DiagnosticCategory.Message:
                return 'notice';
        }
    }
}
function parseConfig(project, sources, compilerOptions) {
    var host = {
        useCaseSensitiveFileNames: false,
        readDirectory: function (rootDir, extensions, excludes, includes, depth) { return sources; },
        fileExists: function (path) { return platform_1.default.testFileExists(path); },
        readFile: function (path) { return platform_1.default.readFile(path); },
    };
    return typescript_1.default.parseJsonConfigFileContent({ include: sources, compilerOptions: compilerOptions }, host, project.baseDirectoryPath);
}
function readModuleSourceChain(project) {
    var sourceText = '';
    var sourceMaps = [];
    var text = platform_1.default.readFile(project.definitionPath);
    for (var _i = 0, _a = text.split(/\r\n|\r|\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            for (var _b = 0, _c = project.codePaths; _b < _c.length; _b++) {
                var path = _c[_b];
                sourceText += "/// <source path=\"" + path + "\">" + '\n';
                sourceText += platform_1.default.readFile(path) + '\n';
                sourceText += '/// </source>' + '\n\n';
            }
        }
        else {
            sourceText += line + '\n';
        }
    }
    if (project.moduleSourcePath) {
        platform_1.default.writeFile(project.moduleSourcePath, sourceText);
    }
    return {
        sourceText: sourceText,
        sourceMaps: sourceMaps,
    };
}
function generateModule(project) {
    var sourcePath = project.moduleSourcePath || project.definitionPath;
    var compilerOptions = Object.assign(
    /* default compilerOptions */
    {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true,
        strict: true,
        alwaysStrict: true,
        esModuleInterop: true,
    }, 
    /* custom compilerOptions */
    project.config.typescript.compilerOptions);
    var parsed = parseConfig(project, [sourcePath], compilerOptions);
    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors);
        // TODO: return
    }
    if (parsed.options.locale) {
        typescript_1.default.validateLocaleAndSetLanguage(parsed.options.locale, typescript_1.default.sys, parsed.errors);
    }
    var declarationText = '';
    var moduleText = '';
    var sourceMapText = '';
    var source = readModuleSourceChain(project);
    var sourceFile = typescript_1.default.createSourceFile(sourcePath, source.sourceText, parsed.options.target);
    var compilerHost = typescript_1.default.createCompilerHost(parsed.options);
    var getSourceFileBase = compilerHost.getSourceFile;
    compilerHost.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) { return fileName === sourcePath ? sourceFile : getSourceFileBase(fileName, languageVersion, onError, shouldCreateNewSourceFile); },
        compilerHost.writeFile = function (fileName, text) {
            if (fileName.endsWith('.d.ts')) {
                declarationText += text;
            }
            else if (fileName.endsWith('.map')) {
                sourceMapText = text;
            }
            else {
                // Quick Fix: import 'xx' -> import 'xx.mjs'
                var sourceDir_1 = platform_1.default.extractDirectoryPath(project.moduleEsmPath);
                text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, function ($0, $1, $2, $3) {
                    var path = platform_1.default.joinPath(sourceDir_1, ($2 || $3) + '.mjs');
                    return platform_1.default.testFileExists(path) ? $1 + "'" + ($2 || $3) + ".mjs'" : $0;
                });
                moduleText = text;
            }
        };
    var program = typescript_1.default.createProgram([sourcePath], parsed.options, compilerHost);
    var emitResult = program.emit();
    // const transpileResult = transpileCode(project)
    emitResult.diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    if (emitResult.diagnostics.length == 0) {
        platform_1.default.writeFile(platform_1.default.touchDirectories(project.typePath), declarationText);
        platform_1.default.writeFile(platform_1.default.touchDirectories(project.moduleEsmPath), moduleText);
        platform_1.default.writeFile(platform_1.default.touchDirectories(project.sourceMapPath), sourceMapText);
    }
    return emitResult;
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
    build: build,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RzYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGdEQUF5QjtBQUV6Qix3REFBMEI7QUFDMUIsMERBQTJCO0FBQzNCLGtEQUF3QjtBQWF4QixTQUFTLEtBQUssQ0FBQyxPQUFnQjtJQUM5QixJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFMUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUVuRCxnQkFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFFdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7UUFDNUIsZ0JBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFJLE9BQU8sQ0FBQyxhQUFhLGlCQUFjLENBQUMsQ0FBQTtLQUMvRDtJQUVELElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQy9DLGdCQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQ0FBOEIsUUFBUSxPQUFJLENBQUMsQ0FBQTtBQUM3RCxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxPQUFpQixFQUFFLFdBQXlDO0lBQ3ZGLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO1FBQzdCLElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFaEQsSUFBTSxPQUFPLEdBQUcsb0JBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRTdFLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUEsS0FBc0IsVUFBVSxDQUFDLElBQUksQ0FB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