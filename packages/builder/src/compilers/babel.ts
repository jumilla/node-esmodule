
// "@babel/core": "^7.1.0",
// "@babel/preset-env": "^7.1.0"
// "@babel/plugin-transform-modules-commonjs": "^7.1.0",

import { Project } from '../project'
import P from '../platform'

function build(project: Project): void {
	const babel = require('@babel/core')
	const result = babel.transformFileSync(project.moduleEsmPath, {
		presets: [[require('@babel/preset-env'), { targets: { 'node': '6.0' } }]],
		plugins: [],
	})

	// P.writeFile(project.moduleCjsPath, result.code)
	// console.log(result)
}



export default {
	build,
}