
import { Config, SourceMapKind } from '../config'
import { Project } from '../project'
import P from '../platform'
import meta from '../meta'
import log from 'npmlog'
import type BABEL from '@babel/core'



let babel: typeof BABEL



async function build(project: Project) {
	try {
		if (!babel) {
			babel = await import('@babel/core')
		}
	}
	catch (error) {
		throw new Error('Need installing "@babel/core".')
	}

	const preset = await import('@babel/preset-env')

	const sourcePath = project.modulePathWithoutExtension + '.js'

	const sourceText = project.sourceMap.wholeContent()

	const options = {
		/* default compilerOptions */
		...{
			presets: [
				[
					require('@babel/preset-env'),
					// { targets: { 'node': '6.0' } },
				],
			],
			plugins: [],
		},

		/* project compilerOptions */
		...{
			// include: project.sourceMap.sources().map(_ => _.path),
			sourceMap: project.config.module.sourceMap != SourceMapKind.None,
		},

		/* custom compilerOptions */
		...project.config.babel,
	}

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