"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("../meta"));
var platform_1 = __importDefault(require("../platform"));
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
        displayDiagnostics(project, parsed.errors);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBpbGVycy90c2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxpREFBMEI7QUFFMUIseURBQTJCO0FBQzNCLDBEQUEyQjtBQUMzQixrREFBd0I7QUFleEIsU0FBUyxLQUFLLENBQUMsT0FBZ0I7SUFDOUIsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFbkQsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO1FBQzVCLGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsTUFBSSxPQUFPLENBQUMsYUFBYSxpQkFBYyxDQUFDLENBQUE7S0FDL0Q7SUFFRCxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMvQyxnQkFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsZ0NBQThCLFFBQVEsT0FBSSxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsT0FBZ0IsRUFBRSxXQUF5QztJQUN0RixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtRQUM3QixJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRWhELElBQU0sT0FBTyxHQUFHLG9CQUFFLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUU3RSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFBLEtBQXNCLFVBQVUs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