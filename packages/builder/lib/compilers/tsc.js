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
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), lineOfModule = _a.line, column = _a.character;
            var _b = project.sourceMap.getLocation(lineOfModule), path = _b.path, line = _b.line;
            var location = path + " (" + (line + 1) + "," + (column + 1) + ")";
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
    var sourceText = project.sourceMap.sources().map(function (_) { return _.content; }).join('\n');
    var sourceMaps = [];
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
    compilerHost.getSourceFile =
        function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
            return fileName === sourcePath
                ? sourceFile
                : getSourceFileBase(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBpbGVycy90c2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxpREFBMEI7QUFFMUIseURBQTJCO0FBQzNCLDBEQUEyQjtBQUMzQixrREFBd0I7QUFleEIsU0FBUyxLQUFLLENBQUMsT0FBZ0I7SUFDOUIsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFbkQsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO1FBQzVCLGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsTUFBSSxPQUFPLENBQUMsYUFBYSxpQkFBYyxDQUFDLENBQUE7S0FDL0Q7SUFFRCxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMvQyxnQkFBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsZ0NBQThCLFFBQVEsT0FBSSxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsT0FBZ0IsRUFBRSxXQUF5QztJQUN0RixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtRQUM3QixJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRWhELElBQU0sT0FBTyxHQUFHLG9CQUFFLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUU3RSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFBLG9FQUVMLEVBRk8s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