
import meta from '../meta'
import { SourceMapKind } from '../config'
import { Project } from '../project'
import P from '../platform'
import log from 'npmlog'
import type TS from 'typescript'



let ts: typeof TS



type Output = {
	module: string
	moduleMap?: string
	declaration: string
	declarationMap?: string
}

type TranspileResult = Output & TS.EmitResult

async function build(
	project: Project,
) {
	ts = await import('typescript')

	const sourcePath = project.moduleName + '.ts'

	const sourceText = project.sourceMap.sources().map(_ => _.content).join('\n')

	if (project.moduleSourcePath) {
		P.writeFile(project.moduleSourcePath, sourceText)
	}

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
			declarationMap: project.config.out.sourceMap != SourceMapKind.None,
			sourceMap: project.config.out.sourceMap != SourceMapKind.None,
		},

		/* custom compilerOptions */
		project.config.typescript.compilerOptions,
	)

	const parsed = parseConfig(project, [sourcePath], compilerOptions)

	if (parsed.errors.length > 0) {
		displayDiagnostics(project, parsed.errors)
		return
	}

	if (parsed.options.locale) {
		ts.validateLocaleAndSetLanguage(parsed.options.locale, ts.sys, parsed.errors)
	}

	const result = await transpileModule(
		project,
		parsed.options,
		ts.createSourceFile(sourcePath, sourceText, parsed.options.target!),
	)

	log.silly('tsc', result.toString())

	displayDiagnostics(project, result.diagnostics)

	const errorOccurred = result.diagnostics.length > 0

	if (result.diagnostics.length == 0) {
		if (result.moduleMap) {
			result.module += `//# sourceMappingURL=${project.moduleName}.mjs.map`
		}
		writeFile(project, '.mjs', result.module)

		if (result.declarationMap) {
			result.declaration += `//# sourceMappingURL=${project.moduleName}.d.ts.map`
		}
		writeFile(project, '.d.ts', result.declaration)

		if (result.moduleMap) {
			const map = await project.sourceMap.originalSourceMap(JSON.parse(result.moduleMap))
			map.file = project.moduleName + '.mjs'
			writeFile(project, '.mjs.map', JSON.stringify(map))
		}

		if (result.declarationMap) {
			const map = await project.sourceMap.originalSourceMap(JSON.parse(result.declarationMap))
			writeFile(project, '.d.ts.map', JSON.stringify(map))
		}
	}

	const exitCode = errorOccurred ? 1 : 0
	log.silly('tsc', `Process exiting with code '${exitCode}'.`)
}

function parseConfig(
	project: Project,
	sources: string[],
	compilerOptions: {},
): TS.ParsedCommandLine {
	const host: TS.ParseConfigHost = {
		useCaseSensitiveFileNames: false,
		readDirectory: (rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number): string[] => sources,
		fileExists: (path: string): boolean => P.testFileExists(path),
		readFile: (path: string): string | undefined => P.readFile(path),
	}

	return ts.parseJsonConfigFileContent({ include: sources, compilerOptions }, host, project.baseDirectoryPath)
}

async function transpileModule(
	project: Project,
	options: TS.CompilerOptions,
	sourceFile: TS.SourceFile,
): Promise<TranspileResult> {
	const output: Output = {
		module: '',
		declaration: '',
	}

	const compilerHost = ts.createCompilerHost(options)

	const getSourceFileBase = compilerHost.getSourceFile

	compilerHost.getSourceFile =
		(fileName, languageVersion, onError, shouldCreateNewSourceFile) =>
			fileName === sourceFile.fileName
				? sourceFile
				: getSourceFileBase(fileName, languageVersion, onError, shouldCreateNewSourceFile)

	compilerHost.writeFile = async (fileName, text) => {
		if (fileName.endsWith('.js')) {
			// Quick Fix: import 'xx' -> import 'xx.mjs'
			const sourceDir = P.extractDirectoryPath(project.config.out.module)

			text = text.replace(/^\s*(import\s.+)(?:'(.*?)'|"(.*?)")/gm, ($0, $1, $2, $3) => {
				const path = P.joinPath(sourceDir, ($2 || $3) + '.mjs')
				return P.testFileExists(path) ? `${$1}'${$2 || $3}.mjs'` : $0
			})

			text = text.replace(/\/\/#\ssourceMappingURL=.+$/, '')

			output.module = text
		}
		else if (fileName.endsWith('.d.ts')) {
			text = text.replace(/\/\/#\ssourceMappingURL=.+$/, '')

			output.declaration = text
		}
		else if (fileName.endsWith('.js.map')) {
			output.moduleMap = text
		}
		else if (fileName.endsWith('.d.ts.map')) {
			output.declarationMap = text
		}
		else {
			log.warn('esmc', 'Unknown generated file.')
		}
	}

	const program = ts.createProgram([sourceFile.fileName], options, compilerHost)

	const emitResult = program.emit()

	emitResult.diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

	return {
		...output,
		...emitResult,
	}
}

function writeFile(
	project: Project,
	extension: string,
	text: string,
) {
	const path = P.resolvePath(project.baseDirectoryPath, project.config.out.module + extension)

	P.writeFile(P.touchDirectories(path), text)

	log.info(meta.program, `'${path}' generated.`)
}

function displayDiagnostics(
	project: Project,
	diagnostics: ReadonlyArray<TS.Diagnostic>,
) {
	diagnostics.forEach(diagnostic => {
		const loglevel = toLogLevel(diagnostic.category)

		const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

		if (diagnostic.file) {
			const { line: lineOfModule, character: column } = diagnostic.file.getLineAndCharacterOfPosition(
				diagnostic.start!
			)

			const { path, line } = project.sourceMap.getLocation(lineOfModule)

			const location = `${path} (${line + 1},${column + 1})`
			log.log(loglevel, 'tsc', `${location}: ${message}`)
		}
		else {
			log.log(loglevel, 'tsc', message)
		}
	})

	function toLogLevel(
		category: TS.DiagnosticCategory,
	): string {
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
