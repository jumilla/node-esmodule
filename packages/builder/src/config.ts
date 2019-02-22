
import * as json5 from 'json5'
import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

export type ConfigSource = {
    version? : string
    compiler? : string          // undefined or 'typescript' or 'babel'
    source? : string
    include? : string | string[]
    exclude? : string | string[]
    out? : string | { source : string, module : string }
    typescript? : {}
    babel? : {}
}

export enum CompilerKind {
    TypeScript = 'typescript',
    Babel = 'babel',
}

export type Config = {
    version : string
    compiler : CompilerKind
    source : string
    include : string[]
    exclude : string[]
    out : { source : string, module : string }
    typescript : { compilerOptions : {} }
    babel : {}
}

export type Project = {
    baseDirectoryPath : string
    configFilePath? : string
    config : Config
    definitionPath : string
    codePaths : string[]
    moduleSourcePath? : string
    typePath : string
    moduleEsmPath : string
    moduleCjsPath? : string
    sourceMapPath : string
}

const FILENAME = 'esmconfig.json'

const DEFAULT = {
    version : '0.1',
    compiler : CompilerKind.TypeScript,
    source : 'module.ts',
    include : ['*'],
    exclude : [],
    out : { source : '@module.ts', module : 'module.js' },
    typescript : { compilerOptions: {} },
    babel : {},
} as Config

function resolvePath(baseDirectoryPath : string, filename : string) : string {
    return path.normalize(path.join(baseDirectoryPath, filename))
}

function exists(filePath : string) : boolean {
    try {
        fs.accessSync(filePath, fs.constants.R_OK)
        return true
    }
    catch (error) {
        return false
    }
}

function load(configFilePath : string, baseDirectoryPath : string = path.dirname(configFilePath)) : Project {
    const text = fs.readFileSync(configFilePath, {encoding: 'UTF-8'})

    const config = parseConfig(json5.parse(text))

    return {
        baseDirectoryPath,
        configFilePath,
        config,
        definitionPath: baseDirectoryPath + '/' + config.source,
        codePaths : expandFilePatterns(baseDirectoryPath, config),
        moduleSourcePath : resolvePath(baseDirectoryPath, config.out.source),
        typePath : resolvePath(baseDirectoryPath, config.out.module + '.d.ts'),
        moduleEsmPath : resolvePath(baseDirectoryPath, config.out.module + '.mjs'),
        // moduleCjsPath : 'lib/example-1.js',
        sourceMapPath : resolvePath(baseDirectoryPath, config.out.module + '.mjs.map'),
    }
}

function parseConfig(data : ConfigSource) : Config {
    const choiseValue = <T>(defaultValue : T, specifiedValue : any, checker? : (value : any) => T) : T => {
        const value = specifiedValue || defaultValue
        return checker ? checker(value) : value
    }

    const choiseObject = <T extends {}>(defaultValue? : T, specifiedValue? : {}) : T => {
        return Object.assign({}, defaultValue, specifiedValue)
    }

    const version = choiseValue(DEFAULT.version, data.version)
    const compiler = choiseValue(DEFAULT.compiler, data.compiler, (value : string) => {
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
            return { source, module: value }
        }
        else if (typeof value === 'object') {
            return value as { source : string, module : string }
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "out" must need.')
            return { source : '', module: '' }
        }
        else {
            // TODO Error handling
            console.log('Parameter "out" must need.')
            return { source : '', module: '' }
        }
    })
    console.log(version, source, out)
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

function expandFilePatterns(directoryPath : string, config : Config) : string[] {
    const result : string[] = []

    const excludePaths : string[] = []

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
        const matches = glob.sync(resolvePath(directoryPath, pattern))

        for (const match of matches) {
            // exclude ${source} file
            if (match == resolvePath(directoryPath, config.source)) continue

            // exclude ${out.source} file
            if (match == resolvePath(directoryPath, config.out.source)) continue

            // exclude ${exclude} pattern
            if (excludePaths.indexOf(match) != -1) continue

            result.push(path.normalize(match))
        }
    }

    return result
}

export default {
    FILENAME,
    resolvePath,
    exists,
    load,
    expandFilePatterns,
}
