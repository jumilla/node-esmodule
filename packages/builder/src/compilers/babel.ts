
import { Config, SourceMapKind } from '../config'
import { Project } from '../project'
import P from '../platform'
import type BABEL from '@babel/core'



let babel: typeof BABEL



async function build(project: Project) {
	try {
		babel = await import('@babel/core')

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
			if (project.config.module.sourceMap == SourceMapKind.Inline) {
				// TODO
			}
			P.writeFile(project.modulePathWithoutExtension + '.mjs', result.code)
		}

		if (result.map) {
			delete result.map.sourcesContent

			if (project.config.module.sourceMap == SourceMapKind.File) {
				P.writeFile(project.modulePathWithoutExtension + '.mjs.map', JSON.stringify(result.map))
			}
		}
		// console.log(result)
	}
	catch (error) {
		throw new Error('Need installing "@babel/core".')
	}
}



export default {
	build,
}