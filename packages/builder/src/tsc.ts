
import {Project} from './config'
import * as ts from 'typescript'
import * as fs from 'fs'

function compile(project : Project) {
    // return transpile(project)
    return generate(project)
}

function generate(project : Project) {
    const compilerOptions = {
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
        declaration: true,
        sourceMap: true,
        // inlineSourceMap: true,

        strict: true,   // noImplicitAny=true, noImplicitThis=true, alwaysStrict=true, strictNullChecks=true
    }

    let emitResult = emit(project, compilerOptions)

    emitResult.diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            )
            let message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            )
            console.log(
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            )
        }
        else {
            console.log(
                `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
            )
        }
    })
  
    let exitCode = emitResult.emitSkipped ? 1 : 0
    console.log(`Process exiting with code '${exitCode}'.`)

    const babel = require('@babel/core')
    const result = babel.transformFileSync(project.moduleEsmPath, {
        presets: [[require('@babel/preset-env'), {targets: {'node' : '6.0'}}]],
        plugins: [],
    })
    fs.writeFileSync(project.moduleCjsPath, result.code)
    // console.log(result)
}

function emit(project : Project, compilerOptions : ts.CompilerOptions) : ts.EmitResult {
    let program = ts.createProgram(project.sourcePaths, compilerOptions)

    let declarationText = ''
    let moduleText = ''
    let sourceMapText = ''

    let emitResult = program.emit(undefined, (fileName : string, data : string, writeByteOrderMark : boolean, onError, sourceFiles? : ReadonlyArray<ts.SourceFile>) : void => {
        console.log('W:', fileName, writeByteOrderMark)

        if (fileName.endsWith('.d.ts')) {
            declarationText += data
        }
        else if (fileName.endsWith('.js')) {
            moduleText += data
            moduleText += '\n'
        }
        else if (fileName.endsWith('.js.map')) {
            sourceMapText += data
        }
    })

    moduleText += '//# sourceMappingURL=' + project.sourceMapPath + '\n'

    fs.writeFileSync(project.typePath, declarationText)
    fs.writeFileSync(project.moduleEsmPath, moduleText)
    fs.writeFileSync(project.sourceMapPath, sourceMapText)

    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    return emitResult
}

function transpile(project : Project) {
    const compilerOptions = {
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
        // sourceMap: true,
    }

    let moduleText : string = ''

    for (const sourcePath of project.sourcePaths) {
        const result = transpileFile(sourcePath, compilerOptions)

        if (result.diagnostics) {
            for (const diagnostic of result.diagnostics) {
                console.debug(diagnostic)
            }
        }
        console.log(result.sourceMapText)

        moduleText += result.outputText
        moduleText += '\n'
    }

    fs.writeFileSync(project.moduleEsmPath, moduleText)
}

function transpileFile(sourcePath : string, compilerOptions : ts.CompilerOptions) : ts.TranspileOutput {
    const sourceText = loadFile(sourcePath)

    return ts.transpileModule(
        sourceText,
        {
            compilerOptions,
            reportDiagnostics: true,
            fileName: sourcePath,
//            moduleName: filePath,
        }
    )
}

function loadFile(filePath : string) : string {
    return fs.readFileSync(filePath, {encoding: 'UTF-8'})
}

export default {
    compile,
    transpile,
}
