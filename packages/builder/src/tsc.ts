
import meta from './meta'
import {Project} from './config'
import ts from 'typescript'
import log from 'npmlog'
import fs from 'fs'
import fspath from 'path'

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

    log.silly('tsc', emitResult.toString())
    if (!emitResult.emitSkipped) {
        log.info(meta.program, `'${project.moduleEsmPath}' generated.`)
    }

    const exitCode = emitResult.emitSkipped ? 1 : 0
    log.silly('tsc', `Process exiting with code '${exitCode}'.`)

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
        const loglevel = toLogLevel(diagnostic.category)

        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

        if (diagnostic.file) {
            const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            )
            const location = `${diagnostic.file.fileName} (${line + 1},${character + 1})`
            log.log(loglevel, 'tsc', `${location}: ${message}`)
        }
        else {
            log.log(loglevel, 'tsc', message)
        }
    })

    function toLogLevel(category : ts.DiagnosticCategory) : string {
        switch (category) {
            case ts.DiagnosticCategory.Warning:
                return 'warn'
            case ts.DiagnosticCategory.Error:
                return 'error'
            case ts.DiagnosticCategory.Suggestion:
                return 'info'
            case ts.DiagnosticCategory.Message:
                return 'notice'
        }
    }
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

function readModuleSourceChain(project : Project) : ModuleSource {
    let sourceText = ''
    const sourceMaps = [] as string[]

    const text = fs.readFileSync(project.definitionPath, {encoding: 'UTF-8'})
    for (let line of text.split(/\r\n|\r|\n/)) {
        const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/)
        if (match) {
            for (const path of project.codePaths) {
                sourceText += `/// <source path="${path}">` + '\n'
                sourceText += fs.readFileSync(path, {encoding: 'UTF-8'}) + '\n'
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
        },

        /* custom compilerOptions */
        project.config.typescript.compilerOptions,
    )

    const parsed = parseConfig(project, [sourcePath], compilerOptions)

    if (parsed.errors.length > 0) {
        displayDiagnostics(parsed.errors)
        // TODO: return
    }

    if (parsed.options.locale) {
        ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors)
    }

    let declarationText = ''
    let moduleText = ''
    let sourceMapText = ''

    const source = readModuleSourceChain(project)
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
            // Quick Fix: import 'xx' -> import 'xx.mjs'
            const sourceDir = fspath.dirname(project.moduleEsmPath)
            text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, ($0, $1, $2, $3) => {
                const path = fspath.join(sourceDir, ($2 || $3) + '.mjs')
                return fs.existsSync(path) ? `${$1}'${$2 || $3}.mjs'` : $0
            })

            moduleText = text;
        }
    }

    const program = ts.createProgram([sourcePath], parsed.options, compilerHost)

    const emitResult = program.emit()

    // const transpileResult = transpileCode(project)

    emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

    if (emitResult.diagnostics.length == 0) {
        fs.writeFileSync(touchDirectories(project.typePath), declarationText)

        fs.writeFileSync(touchDirectories(project.moduleEsmPath), moduleText)

        fs.writeFileSync(touchDirectories(project.sourceMapPath), sourceMapText)
    }

    return emitResult

    function touchDirectories(filepath : string) : string {
        const dirpath = fspath.dirname(filepath)

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, {
                recursive: true
            })
        }
        return filepath
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
