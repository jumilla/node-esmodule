"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("./meta");
var ts = require("typescript");
var fs = require("fs");
var log = require("npmlog");
function compile(project) {
    // return transpile(project)
    return generate(project);
}
function generate(project) {
    var emitResult = generateModule(project);
    displayDiagnostics(emitResult.diagnostics);
    log.silly('typescript', emitResult.toString());
    if (!emitResult.emitSkipped) {
        log.info(meta_1.default.program, "'" + project.moduleEsmPath + "' generated.");
    }
    var exitCode = emitResult.emitSkipped ? 1 : 0;
    log.silly('typescript', "Process exiting with code '" + exitCode + "'.");
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
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            log.info('typescript', diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            log.info('typescript', "" + ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
}
function parseConfig(project, sources, compilerOptions) {
    var host = {
        useCaseSensitiveFileNames: false,
        readDirectory: function (rootDir, extensions, excludes, includes, depth) { return sources; },
        fileExists: function (path) { return fs.existsSync(path); },
        readFile: function (path) { return fs.readFileSync(path, { encoding: 'UTF-8' }); },
    };
    return ts.parseJsonConfigFileContent({ include: sources, compilerOptions: compilerOptions }, host, project.baseDirectoryPath);
}
function readModuleSource(project) {
    var sourceText = '';
    var sourceMaps = [];
    var text = fs.readFileSync(project.definitionPath, { encoding: 'UTF-8' });
    for (var _i = 0, _a = text.split(/\r\n|\r|\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            for (var _b = 0, _c = project.codePaths; _b < _c.length; _b++) {
                var path = _c[_b];
                sourceText += "/// <source path=\"" + path + "\">" + '\n';
                var text1 = fs.readFileSync(path, { encoding: 'UTF-8' });
                sourceText += text1 + '\n';
                sourceText += '/// </source>' + '\n\n';
            }
        }
        else {
            sourceText += line + '\n';
        }
    }
    if (project.moduleSourcePath) {
        fs.writeFileSync(project.moduleSourcePath, sourceText, { encoding: 'UTF-8' });
    }
    return {
        sourceText: sourceText,
        sourceMaps: sourceMaps,
    };
}
function generateModule(project) {
    var sourcePath = project.moduleSourcePath || project.definitionPath;
    var compilerOptions = Object.assign({}, project.config.typescript.compilerOptions, {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true,
        strict: true,
        alwaysStrict: true,
    });
    var parsed = parseConfig(project, [sourcePath], compilerOptions);
    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors);
        // return
    }
    if (parsed.options.locale) {
        ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors);
    }
    var declarationText = '';
    var moduleText = '';
    var sourceMapText = '';
    var source = readModuleSource(project);
    var sourceFile = ts.createSourceFile(sourcePath, source.sourceText, parsed.options.target);
    var compilerHost = ts.createCompilerHost(parsed.options);
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
                moduleText = text;
            }
        };
    var program = ts.createProgram([sourcePath], parsed.options, compilerHost);
    var emitResult = program.emit();
    // const transpileResult = transpileCode(project)
    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    if (emitResult.diagnostics.length == 0) {
        fs.writeFileSync(project.typePath, declarationText);
        fs.writeFileSync(project.moduleEsmPath, moduleText);
        fs.writeFileSync(project.sourceMapPath, sourceMapText);
    }
    return emitResult;
}
function transpileCode(project) {
    var sources = project.codePaths;
    var sourceMap = true;
    var compilerOptions = Object.assign({}, project.config.typescript.compilerOptions, {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'classic',
        declaration: false,
        // sourceMap: sourceMap,
        inlineSourceMap: sourceMap,
        inlineSources: sourceMap,
        strict: true,
        alwaysStrict: false,
        outFile: project.moduleEsmPath + '.js',
    });
    var parsed = parseConfig(project, sources, compilerOptions);
    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors);
        return {
            diagnostics: parsed.errors
        };
    }
    var program = ts.createProgram(sources, parsed.options);
    var moduleText = '';
    var sourceMapText = '';
    var emitResult = program.emit(undefined, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
        log.silly('DEBUG: W2:', fileName, writeByteOrderMark, data.length);
        if (fileName.endsWith('.js')) {
            // moduleText += '/// source: ' + fileName +  '\n'
            moduleText += data;
            moduleText += '\n';
        }
        else if (fileName.endsWith('.js.map')) {
            sourceMapText += data;
        }
    });
    return {
        moduleText: moduleText,
        sourceMapText: sourceMapText,
        diagnostics: ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    };
}
function getNewLineCharacter(options) {
    var carriageReturnLineFeed = '\r\n';
    var lineFeed = '\n';
    switch (options.newLine) {
        case ts.NewLineKind.CarriageReturnLineFeed:
            return carriageReturnLineFeed;
        case ts.NewLineKind.LineFeed:
            return lineFeed;
    }
    return require('os').EOL;
}
exports.getNewLineCharacter = getNewLineCharacter;
exports.default = {
    compile: compile,
};
