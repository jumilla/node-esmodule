
import meta from './meta'
import config_, { Config } from './config'
import { SourceMap } from './sourcemap'
import P from './platform'
import tsc from './compilers/tsc'
import babel from './compilers/babel'
import log from 'npmlog'
import glob from 'glob'

export default {
	load,
	build,
}

export type Project = {
	baseDirectoryPath: string
	configFilePath?: string
	config: Config
	definitionPath: string
	codePaths: string[]
	moduleSourcePath?: string
	typePath: string
	moduleEsmPath: string
	moduleCjsPath?: string
	sourceMapPath: string
	sourceMap: SourceMap
}

function load(configFilePath: string, baseDirectoryPath: string = P.extractDirectoryPath(configFilePath)): Project {
	const text = P.readFile(configFilePath)

	const config = config_.parse(text)

	const codePaths = expandFilePatterns(baseDirectoryPath, config)

	const sourceMap = new SourceMap()

	for (const path of codePaths) {
		// sourceMap.addSource(path)
	}

	return {
		baseDirectoryPath,
		configFilePath,
		config,
		definitionPath: P.resolvePath(baseDirectoryPath, config.source),
		codePaths,
		moduleSourcePath: config.out.source ? P.resolvePath(baseDirectoryPath, config.out.source) : undefined,
		typePath: P.resolvePath(baseDirectoryPath, config.out.module + '.d.ts'),
		moduleEsmPath: P.resolvePath(baseDirectoryPath, config.out.module + '.mjs'),
		// moduleCjsPath : 'lib/example-1.js',
		sourceMapPath: P.resolvePath(baseDirectoryPath, config.out.module + '.mjs.map'),
		sourceMap,
	}
}

function expandFilePatterns(directoryPath: string, config: Config): string[] {
	const result: string[] = []

	const excludePaths: string[] = []

	for (let pattern of config.exclude) {
		const matches = glob.sync(directoryPath + '/' + pattern)

		excludePaths.push(...matches)
	}

	for (let pattern of config.include) {
		// Add suffix '.ts'
		if (pattern.endsWith('/')) {
			pattern = pattern + '*.ts'
		}
		else if (pattern.endsWith('*')) {
			pattern = pattern + '.ts'
		}

		// const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
		const matches = glob.sync(P.resolvePath(directoryPath, pattern))

		for (const match of matches) {
			// exclude ${source} file
			if (match == P.resolvePath(directoryPath, config.source)) continue

			// exclude ${out.source} file
			if (config.out.source) {
				if (match == P.resolvePath(directoryPath, config.out.source)) continue
			}

			// exclude ${exclude} pattern
			if (excludePaths.indexOf(match) != -1) continue

			result.push(P.normalizePath(match))
		}
	}

	return result
}

function build(project: Project): void {
	switch (project.config.compiler) {
		case 'typescript':
			tsc.build(project)
			break

		case 'babel':
			babel.build(project)
			break

		default:
			log.error(meta.program, 'Invalid compiler specified.')
	}
}
