
import P from './platform'
import json5 from 'json5'



type ConfigSource = {
	version?: string
	compiler?: string          // undefined or 'typescript' or 'babel'
	source?: string
	include?: string | string[]
	exclude?: string | string[]
	out?: string | { source?: string, module?: string }
	typescript?: {}
	babel?: {}
}

export enum CompilerKind {
	TypeScript = 'typescript',
	Babel = 'babel',
}

export type Config = {
	version: string
	compiler: CompilerKind
	source: string
	include: string[]
	exclude: string[]
	out: { source?: string, module: string }
	typescript: { compilerOptions: {} }
	babel: {}
}

const FILENAME = 'esmconfig.json'

const DEFAULT = {
	version: '0.1',
	compiler: CompilerKind.TypeScript,
	source: 'module.ts',
	include: ['*'],
	exclude: [],
	out: { source: '@module.ts', module: 'module.js' },
	typescript: {
		compilerOptions: {
			locale: process.env.LANG!.substring(0, 2),
		}
	},
	babel: {},
} as Config

function parse(image: string): Config {
	const data = json5.parse(image)

	const choiseValue = <T>(defaultValue: T, specifiedValue: any, checker?: (value: any) => T): T => {
		const value = specifiedValue || defaultValue
		return checker ? checker(value) : value
	}

	const choiseObject = <T extends {}>(defaultValue?: T, specifiedValue?: {}): T => {
		return Object.assign({}, defaultValue, specifiedValue)
	}

	const version = choiseValue(DEFAULT.version, data.version)
	const compiler = choiseValue(DEFAULT.compiler, data.compiler, (value: string) => {
		const lowerValue = value.toLowerCase()
		if (value == 'typescript') return CompilerKind.TypeScript
		if (value == 'babel') return CompilerKind.Babel
		return CompilerKind.TypeScript
	})
	const source = choiseValue(DEFAULT.source, data.source)
	const include = choiseValue(DEFAULT.include, typeof data.include === 'string' ? [data.include] : data.include)
	const exclude = choiseValue(DEFAULT.exclude, typeof data.exclude === 'string' ? [data.exclude] : data.exclude)
	const out = choiseValue(DEFAULT.out, data.out, value => {
		if (typeof value === 'string') {
			return { module: value }
		}
		else if (typeof value === 'object') {
			// TODO: check
			return value
		}
		else if (typeof value === 'undefined') {
			// TODO Error handling
			console.log('Parameter "out" must need.')
			return { module: '' }
		}
		else {
			// TODO Error handling
			console.log('Parameter "out" must need.')
			return { module: '' }
		}
	})
	const typescript = choiseObject(DEFAULT.typescript, data.typescript)
	const babel = choiseObject(DEFAULT.babel, data.babel)

	return {
		version,
		compiler,
		source,
		include,
		exclude,
		out,
		typescript,
		babel,
	}
}



export default {
	FILENAME,
	parse,
}
