"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var fs = require("fs");
function compile(project) {
    // return transpile(project)
    return generate(project);
}
function generate(project) {
    var compilerOptions = {
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
        declaration: true,
        sourceMap: true,
        // inlineSourceMap: true,
        strict: true,
    };
    var emitResult = emit(project, compilerOptions);
    emitResult.diagnostics.forEach(function (diagnostic) {
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.log("" + ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });
    var exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log("Process exiting with code '" + exitCode + "'.");
    var babel = require('@babel/core');
    var result = babel.transformFileSync(project.moduleEsmPath, {
        presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
        plugins: [],
    });
    fs.writeFileSync(project.moduleCjsPath, result.code);
    // console.log(result)
}
function emit(project, compilerOptions) {
    var program = ts.createProgram(project.sourcePaths, compilerOptions);
    var declarationText = '';
    var moduleText = '';
    var sourceMapText = '';
    var emitResult = program.emit(undefined, function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
        console.log('W:', fileName, writeByteOrderMark);
        if (fileName.endsWith('.d.ts')) {
            declarationText += data;
        }
        else if (fileName.endsWith('.js')) {
            moduleText += data;
            moduleText += '\n';
        }
        else if (fileName.endsWith('.js.map')) {
            sourceMapText += data;
        }
    });
    moduleText += '//# sourceMappingURL=' + project.sourceMapPath + '\n';
    fs.writeFileSync(project.typePath, declarationText);
    fs.writeFileSync(project.moduleEsmPath, moduleText);
    fs.writeFileSync(project.sourceMapPath, sourceMapText);
    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    return emitResult;
}
function transpile(project) {
    var compilerOptions = {
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
    };
    var moduleText = '';
    for (var _i = 0, _a = project.sourcePaths; _i < _a.length; _i++) {
        var sourcePath = _a[_i];
        var result = transpileFile(sourcePath, compilerOptions);
        if (result.diagnostics) {
            for (var _b = 0, _c = result.diagnostics; _b < _c.length; _b++) {
                var diagnostic = _c[_b];
                console.debug(diagnostic);
            }
        }
        console.log(result.sourceMapText);
        moduleText += result.outputText;
        moduleText += '\n';
    }
    fs.writeFileSync(project.moduleEsmPath, moduleText);
}
function transpileFile(sourcePath, compilerOptions) {
    var sourceText = loadFile(sourcePath);
    return ts.transpileModule(sourceText, {
        compilerOptions: compilerOptions,
        reportDiagnostics: true,
        fileName: sourcePath,
    });
}
function loadFile(filePath) {
    return fs.readFileSync(filePath, { encoding: 'UTF-8' });
}
exports.default = {
    compile: compile,
    transpile: transpile,
};
