
import * as json5 from 'json5'
import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

export type ConfigSource = {
    version? : string
    compiler? : string          // undefined or 'typescript' or 'babel'
    include? : string[]
    out? : string
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
    include : string[]
    out : string
    typescript : { compilerOptions : {} }
    babel : {}
}

export type Project = {
    baseDirectoryPath : string
    configFilePath? : string
    config : Config
    sourcePaths : string[]
    typePath : string
    moduleEsmPath : string
    // moduleCjsPath : string
    sourceMapPath : string
}

const FILENAME = 'esmconfig.json'

const DEFAULT = {
    version : '0.1',
    compiler : CompilerKind.TypeScript,
    include : [],
    out : '',
    typescript : {
        compilerOptions : {
            module: 'es2015',
            target: 'es2015',
            lib: ['es2015'],
            moduleResolution: 'node',
//            declaration: true,
        },
    },
    babel : {},
} as Config

function resolvePath(directoryOfFilePath : string) : string {
    return directoryOfFilePath + '/' + FILENAME
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
    console.log(config)

    return {
        baseDirectoryPath,
        configFilePath,
        config,
        sourcePaths : expandFilePatterns(baseDirectoryPath, config.include),
        typePath : config.out + '.d.ts',
        moduleEsmPath : config.out + '.mjs',
        // moduleCjsPath : 'lib/example-1.js',
        sourceMapPath : config.out + '.mjs.map',
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
    const include = choiseValue(DEFAULT.include, data.include)
    const out = choiseValue(undefined, data.out, value => {
        if (value === undefined) {
            // TODO Error handling
            console.log('Parameter "out" must need.')
            return 'a'
        }
        return value
    })
    console.log(version, include, out)
    const typescript = choiseObject(DEFAULT.typescript, data.typescript)
    const babel = choiseObject(DEFAULT.babel, data.babel)

    return {
        version,
        compiler,
        include,
        out,
        typescript,
        babel,
    }
}

function expandFilePatterns(directoryPath : string, patterns : string[]) : string[] {
    const result : string[] = []

    for (let pattern of patterns) {
        // Add suffix '.ts'
        if (pattern.endsWith('/')) {
            pattern = pattern + '*.ts'
        }
        else if (pattern.endsWith('*')) {
            pattern = pattern + '.ts'
        }

        // const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
        const matches = glob.sync(directoryPath + '/' + pattern)

        for (const match of matches) {
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
