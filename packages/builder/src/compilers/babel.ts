
import { Config, SourceMapKind } from '../config'
import { Project } from '../project'
import P from '../platform'
import meta from '../meta'
import log from 'npmlog'
import type BABEL from '@babel/core'


const DEFAULT_BABEL_CONFIG = {
	presets: [
		[
			'@babel/preset-env',
			// { targets: { 'esmodules': true }, modules: false },
			{ targets: { 'node': '14.0' }, modules: false },
		],
	],

	plugins: [],
}



let babel: typeof BABEL



async function build(
	project: Project,
) {
	if (!babel) {
		try {
			babel = await import('@babel/core')
		}
		catch (error) {
			throw new Error('Need installing "@babel/core".')
		}
	}

	const sourcePath = project.modulePathWithoutExtension + '.js'

	const sourceText = project.sourceMap.wholeContent()

	const options: BABEL.TransformOptions = {
		/* default compilerOptions */
		...DEFAULT_BABEL_CONFIG,

		/* project compilerOptions */
		...{
			// include: project.sourceMap.sources().map(_ => _.path),
			sourceMap: project.config.module.sourceMap != SourceMapKind.None,
		},

		/* custom compilerOptions */
		...project.config.babel,
	}

	for (const preset of options.presets!) {
		if (Array.isArray(preset) && preset.length >= 2 && preset[1]) {
			(preset[1] as { [name: string]: any }).modules = false
		}
	}

	try {
		const result = babel.transformSync(sourceText, options)

		if (!result) {
			throw new Error('transform failed.')
		}

		if (result.code) {
			if (project.config.module.sourceMap == SourceMapKind.None) {
				writeFile(project, '.mjs', result.code)
			}
			else {
				const moduleMap = await project.sourceMap.originalSourceMap(result.map!)

				moduleMap.file = P.extractFileTitlePath(project.modulePathWithoutExtension) + '.js'

				switch (project.config.module.sourceMap) {
					case SourceMapKind.File:
						result.code += '\n' + project.sourceMap.createFileComment(moduleMap)
						break
					case SourceMapKind.Inline:
						result.code += '\n' + project.sourceMap.createInlineComment(moduleMap)
						break
				}

				writeFile(project, '.mjs', result.code)
				if (project.config.module.sourceMap == SourceMapKind.File) {
					writeFile(project, '.mjs.map', JSON.stringify(moduleMap))
				}
			}
		}
	}
	catch (error) {
		// console.log(345, error.toString())
		// console.log(Object.keys(error.prototype))

		// console.log(error.loc, error.pos, error.code, error.message)

		throw error
	}

	// console.log(result)
}

function writeFile(
	project: Project,
	extension: string,
	text: string,
) {
	const path = P.resolvePath(project.modulePathWithoutExtension + extension)

	P.writeFile(path, text)

	log.info(meta.program, `'${path}' generated.`)
}



export default {
	build,
}