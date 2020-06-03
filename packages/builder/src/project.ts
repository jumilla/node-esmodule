
import meta from './meta'
import parseConfig, { Config } from './config'
import SourceMap from './sourcemap'
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
	entryPath: string
	codePaths: string[]
	moduleDirectoryPath: string
	modulePathWithoutExtension: string
	sourceMap: SourceMap
}

function load(
	configFilePath: string,
	baseDirectoryPath: string = P.extractDirectoryPath(configFilePath),
): Project {
	const text = P.readFile(configFilePath)

	const config = parseConfig(text)

	const entryPath = P.resolvePath(baseDirectoryPath, config.source.directory, config.source.entry)

	const codePaths = expandFilePatterns(baseDirectoryPath, config)

	const sourceMap = makeSourceMap(entryPath, codePaths)

	return {
		baseDirectoryPath,
		configFilePath,
		config,
		entryPath,
		codePaths,
		moduleDirectoryPath: config.module.directory,
		modulePathWithoutExtension: P.resolvePath(baseDirectoryPath, config.module.directory, config.module.name),
		sourceMap,
	}
}

function expandFilePatterns(directoryPath: string, config: Config): string[] {
	const result: string[] = []

	const excludePaths: string[] = []

	for (let pattern of config.source.exclude) {
		const matches = glob.sync(P.resolvePath(directoryPath, config.source.directory, pattern))

		excludePaths.push(...matches)
	}

	for (let pattern of config.source.include) {
		// Add suffix '.ts'
		if (pattern.endsWith('/')) {
			pattern = pattern + '*.ts'
		}
		else if (pattern.endsWith('*')) {
			pattern = pattern + '.ts'
		}

		// const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
		const matches = glob.sync(P.resolvePath(directoryPath, config.source.directory, pattern))

		for (const match of matches) {
			// exclude ${source.entry} file
			if (match == P.resolvePath(directoryPath, config.source.directory, config.source.entry)) continue

			// exclude ${exclude} pattern
			if (excludePaths.indexOf(match) != -1) continue

			result.push(P.normalizePath(match))
		}
	}

	return result
}

function makeSourceMap(
	entryPath: string,
	codePaths: string[],
): SourceMap {
	const sourceMap = new SourceMap()

	let afterPartLineIndex = 0

	const lines = P.readFile(entryPath).split(/\r\n|\n/)

	for (let index = 0; index < lines.length; ++index) {
		const line = lines[index]

		const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/)

		if (match) {
			// 1. before part
			sourceMap.addSource(entryPath, lines.slice(0, index).join('\n'), 0, index)

			afterPartLineIndex = index + 1

			// 2. source part
			for (const path of codePaths) {
				const lines = P.readFile(path).split(/\r\n|\n/)

				sourceMap.addSource(path, lines.join('\n'), 0, lines.length)
			}

			break
		}
	}

	// 3. after part
	sourceMap.addSource(entryPath, lines.slice(afterPartLineIndex).join('\n'), afterPartLineIndex, lines.length - afterPartLineIndex)

	return sourceMap
}

async function build(
	project: Project,
) {
	switch (project.config.compiler) {
		case 'typescript':
			await tsc.build(project)
			break

		case 'babel':
			await babel.build(project)
			break

		default:
			log.error(meta.program, 'Invalid compiler specified.')
	}
}
