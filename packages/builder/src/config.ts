
import json5 from 'json5'



export enum CompilerKind {
	TypeScript = 'typescript',
	Babel = 'babel',
}

export enum SourceMapKind {
	None = 'none',
	File = 'file',
	Inline = 'inline',
}

export type Config = {
	version: string
	compiler: CompilerKind
	source: string
	include: string[]
	exclude: string[]
	out: { source?: string, module: string, sourceMap: SourceMapKind }
	typescript: { compilerOptions: {} }
	babel: {}
}

export const FILENAME = 'esmconfig.json'

const DEFAULT = {
	version: '1.0',
	compiler: CompilerKind.TypeScript,
	source: 'module.ts',
	include: ['*'],
	exclude: [],
	out: { module: 'module.js', sourceMap: SourceMapKind.None },
	typescript: {
		compilerOptions: {
			locale: process.env.LANG!.substring(0, 2),
		}
	},
	babel: {},
} as Config

function parse(
	image: string,
): Config {
	const data: Partial<Config> = json5.parse(image)

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
			return { module: value, sourceMap: SourceMapKind.None }
		}
		else if (typeof value === 'object') {
			const sourceMap = choiseValue(DEFAULT.out.sourceMap, value.sourceMap, (value: string) => {
				const lowerValue = value.toLowerCase()
				if (value == 'file') return SourceMapKind.File
				if (value == 'inline') return SourceMapKind.Inline
				return SourceMapKind.None
			})
			// TODO: check
			return {
				source: value.source,
				module: value.module || '',
				sourceMap: sourceMap,
			}
		}
		else if (typeof value === 'undefined') {
			// TODO Error handling
			console.log('Parameter "out" must need.')
			return { module: '', sourceMap: SourceMapKind.None }
		}
		else {
			// TODO Error handling
			console.log('Parameter "out" must need.')
			return { module: '', sourceMap: SourceMapKind.None }
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



export default parse
