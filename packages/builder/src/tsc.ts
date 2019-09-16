
import {Project} from './config'
import * as ts from 'typescript'
import * as fs from 'fs'
import { emit } from 'cluster';

type TranspileResult = {
    moduleText? : string
    sourceMapText? : string
    diagnostics : ts.Diagnostic[]
}

type ModuleSource = {
    sourceText : string
    sourceMaps : string[]
}

function compile(project : Project) {
    // return transpile(project)
    return generate(project)
}

function generate(project : Project) {
    const emitResult = generateModule(project)

    displayDiagnostics(emitResult.diagnostics)

    const exitCode = emitResult.emitSkipped ? 1 : 0
    console.log(`Process exiting with code '${exitCode}'.`)

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

function displayDiagnostics(diagnostics : ReadonlyArray<ts.Diagnostic>) {
    diagnostics.forEach(diagnostic => {
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
}

function parseConfig(project : Project, sources : string[], compilerOptions : {}) : ts.ParsedCommandLine {
    const host : ts.ParseConfigHost = {
        useCaseSensitiveFileNames: false,
        readDirectory: (rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[] => sources,
        fileExists: (path: string): boolean => fs.existsSync(path),
        readFile: (path: string): string | undefined => fs.readFileSync(path, {encoding: 'UTF-8'}),
    }

    return ts.parseJsonConfigFileContent({include: sources, compilerOptions}, host, project.baseDirectoryPath)
}

function readModuleSource(project : Project) : ModuleSource {
    let sourceText = ''
    const sourceMaps = [] as string[]

    const text = fs.readFileSync(project.definitionPath, {encoding: 'UTF-8'})
    for (let line of text.split(/\r\n|\r|\n/)) {
        const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/)
        if (match) {
            for (const path of project.codePaths) {
                sourceText += `/// <source path="${path}">` + '\n'
                const text1 = fs.readFileSync(path, {encoding: 'UTF-8'})
                sourceText += text1 + '\n'
                sourceText += '/// </source>' + '\n\n'
            }
        }
        else {
            sourceText += line + '\n'
        }
    }

    if (project.moduleSourcePath) {
        fs.writeFileSync(project.moduleSourcePath, sourceText, {encoding: 'UTF-8'})
    }

    return {
        sourceText,
        sourceMaps,
    }
}

function generateModule(project : Project) : ts.EmitResult {
    const sourcePath = project.moduleSourcePath || project.definitionPath
    const compilerOptions = Object.assign({}, project.config.typescript.compilerOptions, {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true,
        strict: true,
        alwaysStrict: true,
    })

    const parsed = parseConfig(project, [sourcePath], compilerOptions)

    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors)
        // return
    }

    if (parsed.options.locale) {
        ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors)
    }

    let declarationText = ''
    let moduleText = ''
    let sourceMapText = ''

    const source = readModuleSource(project)
    const sourceFile : ts.SourceFile = ts.createSourceFile(sourcePath, source.sourceText, parsed.options.target!)

    const compilerHost = ts.createCompilerHost(parsed.options)
    const getSourceFileBase = compilerHost.getSourceFile
    compilerHost.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => fileName === sourcePath ? sourceFile : getSourceFileBase(fileName, languageVersion, onError, shouldCreateNewSourceFile),
    compilerHost.writeFile = (fileName, text) => {
        if (fileName.endsWith('.d.ts')) {
            declarationText += text
        }
        else if (fileName.endsWith('.map')) {
            sourceMapText = text;
        }
        else {
            moduleText = text;
        }
    }

    const program = ts.createProgram([sourcePath], parsed.options, compilerHost)

    const emitResult = program.emit()

    // const transpileResult = transpileCode(project)

    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    if (emitResult.diagnostics.length == 0) {
        fs.writeFileSync(project.typePath, declarationText)
        fs.writeFileSync(project.moduleEsmPath, moduleText)
        fs.writeFileSync(project.sourceMapPath, sourceMapText)
    }

    return emitResult
}

function transpileCode(project : Project) : TranspileResult {
    const sources = project.codePaths
    const sourceMap = true
    const compilerOptions = Object.assign({}, project.config.typescript.compilerOptions, {
        target: 'es2015',
        module: 'es2015',
        moduleResolution: 'classic',
        declaration: false,
        // sourceMap: sourceMap,
        inlineSourceMap: sourceMap,
        inlineSources: sourceMap,
        strict: true,
        alwaysStrict: false,
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
        console.log('DEBUG: W2:', fileName, writeByteOrderMark, data.length)

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

export function getNewLineCharacter(options: ts.CompilerOptions | ts.PrinterOptions): string {
    const carriageReturnLineFeed = '\r\n';
    const lineFeed = '\n';
    switch (options.newLine) {
        case ts.NewLineKind.CarriageReturnLineFeed:
            return carriageReturnLineFeed;
        case ts.NewLineKind.LineFeed:
            return lineFeed;
    }
    return require('os').EOL;
}

export default {
    compile,
}
