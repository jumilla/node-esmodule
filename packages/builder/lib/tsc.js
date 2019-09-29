"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("./meta"));
var typescript_1 = __importDefault(require("typescript"));
var npmlog_1 = __importDefault(require("npmlog"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function compile(project) {
    // return transpile(project)
    return generate(project);
}
function generate(project) {
    var emitResult = generateModule(project);
    displayDiagnostics(emitResult.diagnostics);
    npmlog_1.default.silly('tsc', emitResult.toString());
    if (!emitResult.emitSkipped) {
        npmlog_1.default.info(meta_1.default.program, "'" + project.moduleEsmPath + "' generated.");
    }
    var exitCode = emitResult.emitSkipped ? 1 : 0;
    npmlog_1.default.silly('tsc', "Process exiting with code '" + exitCode + "'.");
    /*
        const babel = require('@babel/core')
        const result = babel.transformFileSync(project.moduleEsmPath, {
            presets: [[require('@babel/preset-env'), {targets: {'node' : '6.0'}}]],
            plugins: [],
        })
        fs.writeFileSync(project.moduleCjsPath, result.code)
        // console.log(result)
    */
}
function displayDiagnostics(diagnostics) {
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
        fileExists: function (path) { return fs_1.default.existsSync(path); },
        readFile: function (path) { return fs_1.default.readFileSync(path, { encoding: 'UTF-8' }); },
    };
    return typescript_1.default.parseJsonConfigFileContent({ include: sources, compilerOptions: compilerOptions }, host, project.baseDirectoryPath);
}
function readModuleSourceChain(project) {
    var sourceText = '';
    var sourceMaps = [];
    var text = fs_1.default.readFileSync(project.definitionPath, { encoding: 'UTF-8' });
    for (var _i = 0, _a = text.split(/\r\n|\r|\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            for (var _b = 0, _c = project.codePaths; _b < _c.length; _b++) {
                var path = _c[_b];
                sourceText += "/// <source path=\"" + path + "\">" + '\n';
                sourceText += fs_1.default.readFileSync(path, { encoding: 'UTF-8' }) + '\n';
                sourceText += '/// </source>' + '\n\n';
            }
        }
        else {
            sourceText += line + '\n';
        }
    }
    if (project.moduleSourcePath) {
        fs_1.default.writeFileSync(project.moduleSourcePath, sourceText, { encoding: 'UTF-8' });
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
                var sourceDir_1 = path_1.default.dirname(project.moduleEsmPath);
                text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, function ($0, $1, $2, $3) {
                    var path = path_1.default.join(sourceDir_1, ($2 || $3) + '.mjs');
                    return fs_1.default.existsSync(path) ? $1 + "'" + ($2 || $3) + ".mjs'" : $0;
                });
                moduleText = text;
            }
        };
    var program = typescript_1.default.createProgram([sourcePath], parsed.options, compilerHost);
    var emitResult = program.emit();
    // const transpileResult = transpileCode(project)
    emitResult.diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    if (emitResult.diagnostics.length == 0) {
        fs_1.default.writeFileSync(touchDirectories(project.typePath), declarationText);
        fs_1.default.writeFileSync(touchDirectories(project.moduleEsmPath), moduleText);
        fs_1.default.writeFileSync(touchDirectories(project.sourceMapPath), sourceMapText);
    }
    return emitResult;
    function touchDirectories(filepath) {
        var dirpath = path_1.default.dirname(filepath);
        if (!fs_1.default.existsSync(dirpath)) {
            fs_1.default.mkdirSync(dirpath, {
                recursive: true
            });
        }
        return filepath;
    }
}
/*
function transpileCode(project : Project) : TranspileResult {
    const sources = project.codePaths
    const sourceMap = true
    const compilerOptions = Object.assign({}, project.config.typescript.compilerOptions, {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'classic',
        declaration: false,
        // sourceMap: sourceMap,
        inlineSourceMap: sourceMap,
        inlineSources: sourceMap,
        strict: true,
        alwaysStrict: false,
        esModuleInterop: true,
        outFile: project.moduleEsmPath + '.js',
    })

    const parsed = parseConfig(project, sources, compilerOptions)

    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors)

        return {
            diagnostics: parsed.errors
        }
    }

    const program = ts.createProgram(sources, parsed.options)

    let moduleText = ''
    let sourceMapText = ''

    const emitResult = program.emit(undefined, (fileName : string, data : string, writeByteOrderMark : boolean, onError, sourceFiles? : ReadonlyArray<ts.SourceFile>) : void => {
        log.silly('DEBUG: W2:', fileName, writeByteOrderMark, data.length)

        if (fileName.endsWith('.js')) {
            // moduleText += '/// source: ' + fileName +  '\n'
            moduleText += data
            moduleText += '\n'
        }
        else if (fileName.endsWith('.js.map')) {
            sourceMapText += data
        }
    })

    return {
        moduleText,
        sourceMapText,
        diagnostics: ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    }
}
*/
function getNewLineCharacter(options) {
    var carriageReturnLineFeed = '\r\n';
    var lineFeed = '\n';
    switch (options.newLine) {
        case typescript_1.default.NewLineKind.CarriageReturnLineFeed:
            return carriageReturnLineFeed;
        case typescript_1.default.NewLineKind.LineFeed:
            return lineFeed;
    }
    return require('os').EOL;
}
exports.getNewLineCharacter = getNewLineCharacter;
exports.default = {
    compile: compile,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RzYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGdEQUF5QjtBQUV6QiwwREFBMkI7QUFDM0Isa0RBQXdCO0FBQ3hCLDBDQUFtQjtBQUNuQiw4Q0FBeUI7QUFhekIsU0FBUyxPQUFPLENBQUMsT0FBaUI7SUFDOUIsNEJBQTRCO0lBQzVCLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxPQUFpQjtJQUMvQixJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFMUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRTFDLGdCQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRTtRQUN6QixnQkFBRyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLE1BQUksT0FBTyxDQUFDLGFBQWEsaUJBQWMsQ0FBQyxDQUFBO0tBQ2xFO0lBRUQsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDL0MsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdDQUE4QixRQUFRLE9BQUksQ0FBQyxDQUFBO0lBRWhFOzs7Ozs7OztNQVFFO0FBQ0YsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsV0FBMEM7SUFDbEUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7UUFDMUIsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUVoRCxJQUFNLE9BQU8sR0FBRyxvQkFBRSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFN0UsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ1gsSUFBQSxvRUFFTCxFQUZNLGNBQUksRUFBRSx3QkFFWixDQUFBO1lBQ0QsSUFBTSxRQUFRLEdBQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLFdBQUssSUFBSSxHQUFHLENBQUMsV0FBSSxTQUFTLEdBQUcsQ0FBQyxPQUFHLENBQUE7WUFDN0UsZ0JBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBSyxRQUFRLFVBQUssT0FBUyxDQUFDLENBQUE7U0FDdEQ7YUFDSTtZQUNELGdCQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7U0FDcEM7SUFDTCxDQUFDLENBQUMsQ0FBQTtJQUVGLFNBQVMsVUFBVSxDQUFDLFFBQWdDO1FBQ2hELFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSyxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU87Z0JBQzlCLE9BQU8sTUFBTSxDQUFBO1lBQ2pCLEtBQUssb0JBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO2dCQUM1QixPQUFPLE9BQU8sQ0FBQTtZQUNsQixLQUFLLG9CQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBVTtnQkFDakMsT0FBTyxNQUFNLENBQUE7WUFDakIsS0FBSyxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU87Z0JBQzlCLE9BQU8sUUFBUSxDQUFBO1NBQ3RCO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxPQUFpQixFQUFFLE9BQWtCLEVBQUUsZUFBb0I7SUFDNUUsSUFBTSxJQUFJLEdBQXdCO1FBQzlCLHlCQUF5QixFQUFFLEtBQUs7UUFDaEMsYUFBYSxFQUFFLFVBQUMsT0FBZSxFQUFFLFVBQWlDLEVBQUUsUUFBMkMsRUFBRSxRQUErQixFQUFFLEtBQWMsSUFBZSxPQUFBLE9BQU8sRUFBUCxDQUFPO1FBQ3RMLFVBQVUsRUFBRSxVQUFDLElBQVksSUFBYyxPQUFBLFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQW5CLENBQW1CO1FBQzFELFFBQVEsRUFBRSxVQUFDLElBQVksSUFBeUIsT0FBQSxZQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUExQyxDQUEwQztLQUM3RixDQUFBO0lBRUQsT0FBTyxvQkFBRSxDQUFDLDBCQUEwQixDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLGlCQUFBLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDOUcsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsT0FBaUI7SUFDNUMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0lBQ25CLElBQU0sVUFBVSxHQUFHLEVBQWMsQ0FBQTtJQUVqQyxJQUFNLElBQUksR0FBRyxZQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtJQUN6RSxLQUFpQixVQUF3QixFQUF4QixLQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQXhCLGNBQXdCLEVBQXhCLElBQXdCLEVBQUU7UUFBdEMsSUFBSSxJQUFJLFNBQUE7UUFDVCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFDekQsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFtQixVQUFpQixFQUFqQixLQUFBLE9BQU8sQ0FBQyxTQUFTLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCLEVBQUU7Z0JBQWpDLElBQU0sSUFBSSxTQUFBO2dCQUNYLFVBQVUsSUFBSSx3QkFBcUIsSUFBSSxRQUFJLEdBQUcsSUFBSSxDQUFBO2dCQUNsRCxVQUFVLElBQUksWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7Z0JBQy9ELFVBQVUsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFBO2FBQ3pDO1NBQ0o7YUFDSTtZQUNELFVBQVUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBO1NBQzVCO0tBQ0o7SUFFRCxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUMxQixZQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtLQUM5RTtJQUVELE9BQU87UUFDSCxVQUFVLFlBQUE7UUFDVixVQUFVLFlBQUE7S0FDYixDQUFBO0FBQ0wsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLE9BQWlCO0lBQ3JDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFBO0lBRXJFLElBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxNQUFNO0lBQ2pDLDZCQUE2QjtJQUM3QjtRQUNJLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLGdCQUFnQixFQUFFLE1BQU07UUFDeEIsV0FBVyxFQUFFLElBQUk7UUFDakIsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUUsSUFBSTtRQUNsQixlQUFlLEVBQUUsSUFBSTtLQUN4QjtJQUVELDRCQUE0QjtJQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQzVDLENBQUE7SUFFRCxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUE7SUFFbEUsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2pDLGVBQWU7S0FDbEI7SUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLG9CQUFFLENBQUMsNEJBQTRCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsb0JBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2hGO0lBRUQsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFBO0lBQ3hCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQTtJQUNuQixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7SUFFdEIsSUFBTSxNQUFNLEdBQUcscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDN0MsSUFBTSxVQUFVLEdBQW1CLG9CQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFPLENBQUMsQ0FBQTtJQUM3RyxJQUFNLFlBQVksR0FBRyxvQkFBRSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMxRCxJQUFNLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUE7SUFFcEQsWUFBWSxDQUFDLGFBQWEsR0FBRyxVQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixJQUFLLE9BQUEsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsQ0FBQyxFQUF2SCxDQUF1SDtRQUN2TixZQUFZLENBQUMsU0FBUyxHQUFHLFVBQUMsUUFBUSxFQUFFLElBQUk7WUFDcEMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1QixlQUFlLElBQUksSUFBSSxDQUFBO2FBQzFCO2lCQUNJLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDaEMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN4QjtpQkFDSTtnQkFDRCw0Q0FBNEM7Z0JBQzVDLElBQU0sV0FBUyxHQUFHLGNBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO2dCQUN2RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsRUFBRSxVQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBQ3hFLElBQU0sSUFBSSxHQUFHLGNBQU0sQ0FBQyxJQUFJLENBQUMsV0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFBO29CQUN4RCxPQUFPLFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFJLEVBQUUsVUFBSSxFQUFFLElBQUksRUFBRSxXQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDOUQsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsVUFBVSxHQUFHLElBQUksQ0FBQzthQUNyQjtRQUNMLENBQUMsQ0FBQTtJQUVELElBQU0sT0FBTyxHQUFHLG9CQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUU1RSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7SUFFakMsaURBQWlEO0lBRWpELFVBQVUsQ0FBQyxXQUFXLEdBQUcsb0JBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRXpGLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3BDLFlBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBRXJFLFlBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBRXJFLFlBQUUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0tBQzNFO0lBRUQsT0FBTyxVQUFVLENBQUE7SUFFakIsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFpQjtRQUN2QyxJQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXhDLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLFlBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUNsQixTQUFTLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7U0FDTDtRQUNELE9BQU8sUUFBUSxDQUFBO0lBQ25CLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvREU7QUFFRixTQUFnQixtQkFBbUIsQ0FBQyxPQUErQztJQUMvRSxJQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQztJQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdEIsUUFBUSxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQ3JCLEtBQUssb0JBQUUsQ0FBQyxXQUFXLENBQUMsc0JBQXNCO1lBQ3RDLE9BQU8sc0JBQXNCLENBQUM7UUFDbEMsS0FBSyxvQkFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRO1lBQ3hCLE9BQU8sUUFBUSxDQUFDO0tBQ3ZCO0lBQ0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzdCLENBQUM7QUFWRCxrREFVQztBQUVELGtCQUFlO0lBQ1gsT0FBTyxTQUFBO0NBQ1YsQ0FBQSJ9