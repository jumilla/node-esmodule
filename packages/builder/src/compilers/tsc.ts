
import meta from '../meta'
import { Project } from '../project'
import P from '../platform'
import ts from 'typescript'
import log from 'npmlog'



type TranspileResult = {
	moduleText?: string
	sourceMapText?: string
	diagnostics: ts.Diagnostic[]
}

type ModuleSource = {
	sourceText: string
	sourceMaps: string[]
}

function build(project: Project): void {
	const emitResult = generateModule(project)

	displayDiagnostics(project, emitResult.diagnostics)

	log.silly('tsc', emitResult.toString())

	if (!emitResult.emitSkipped) {
		log.info(meta.program, `'${project.moduleEsmPath}' generated.`)
	}

	const exitCode = emitResult.emitSkipped ? 1 : 0
	log.silly('tsc', `Process exiting with code '${exitCode}'.`)
}

function displayDiagnostics(project: Project, diagnostics: ReadonlyArray<ts.Diagnostic>) {
	diagnostics.forEach(diagnostic => {
		const loglevel = toLogLevel(diagnostic.category)

		const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

		if (diagnostic.file) {
			const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
				diagnostic.start!
			)
			const location = `${diagnostic.file.fileName} (${line + 1},${character + 1})`
			log.log(loglevel, 'tsc', `${location}: ${message}`)
		}
		else {
			log.log(loglevel, 'tsc', message)
		}
	})

	function toLogLevel(category: ts.DiagnosticCategory): string {
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

function parseConfig(project: Project, sources: string[], compilerOptions: {}): ts.ParsedCommandLine {
	const host: ts.ParseConfigHost = {
		useCaseSensitiveFileNames: false,
		readDirectory: (rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[] => sources,
		fileExists: (path: string): boolean => P.testFileExists(path),
		readFile: (path: string): string | undefined => P.readFile(path),
	}

	return ts.parseJsonConfigFileContent({ include: sources, compilerOptions }, host, project.baseDirectoryPath)
}

function readModuleSourceChain(project: Project): ModuleSource {
	let sourceText = ''
	const sourceMaps = [] as string[]

	const text = P.readFile(project.definitionPath)
	for (let line of text.split(/\r\n|\r|\n/)) {
		const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/)
		if (match) {
			for (const path of project.codePaths) {
				sourceText += `/// <source path="${path}">` + '\n'
				sourceText += P.readFile(path) + '\n'
				sourceText += '/// </source>' + '\n\n'
			}
		}
		else {
			sourceText += line + '\n'
		}
	}

	if (project.moduleSourcePath) {
		P.writeFile(project.moduleSourcePath, sourceText)
	}

	return {
		sourceText,
		sourceMaps,
	}
}

function generateModule(project: Project): ts.EmitResult {
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
		displayDiagnostics(project, parsed.errors)
		// TODO: return
	}

	if (parsed.options.locale) {
		ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors)
	}

	let declarationText = ''
	let moduleText = ''
	let sourceMapText = ''

	const source = readModuleSourceChain(project)
	const sourceFile: ts.SourceFile = ts.createSourceFile(sourcePath, source.sourceText, parsed.options.target!)
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
				const sourceDir = P.extractDirectoryPath(project.moduleEsmPath)
				text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, ($0, $1, $2, $3) => {
					const path = P.joinPath(sourceDir, ($2 || $3) + '.mjs')
					return P.testFileExists(path) ? `${$1}'${$2 || $3}.mjs'` : $0
				})

				moduleText = text;
			}
		}

	const program = ts.createProgram([sourcePath], parsed.options, compilerHost)

	const emitResult = program.emit()

	// const transpileResult = transpileCode(project)

	emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

	if (emitResult.diagnostics.length == 0) {
		P.writeFile(P.touchDirectories(project.typePath), declarationText)

		P.writeFile(P.touchDirectories(project.moduleEsmPath), moduleText)

		P.writeFile(P.touchDirectories(project.sourceMapPath), sourceMapText)
	}

	return emitResult
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

export default {
	build,
}
