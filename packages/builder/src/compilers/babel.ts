
import { Project } from '../project'
import P from '../platform'
import type BABEL from '@babel/core'



let babel: typeof BABEL



async function build(project: Project) {
	try {
		babel = await import('@babel/core')
		// const result = babel.transformFileSync(project.moduleEsmPath, {
		// 	presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
		// 	plugins: [],
		// })

		// P.writeFile(project.moduleCjsPath, result.code)
		// console.log(result)
	}
	catch (error) {
		throw new Error('Need installing "@babel/core".')
	}
}



export default {
	build,
}