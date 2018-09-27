
import * as json5 from 'json5'
import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

export type Config = {
    version : string
    compiler? : string        // null or 'typescript' or 'babel'
    include : string[]
}

export type Project = {
    baseDirectoryPath : string
    configFilePath? : string
    config : Config
    sourcePaths : string[]
    typePath : string
    moduleEsmPath : string
    moduleCjsPath : string
    sourceMapPath : string
}

const FILENAME = 'esmconfig.json'

const DEFAULT = {
    version : '0.1',
    compiler : null,
    include : [],
}

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

    const config = Object.assign({}, DEFAULT, json5.parse(text))

    return {
        baseDirectoryPath,
        configFilePath,
        config,
        sourcePaths : expandFilePatterns(baseDirectoryPath, config.include),
        typePath : 'lib/example-1.d.ts',
        moduleEsmPath : 'lib/example-1.mjs',
        moduleCjsPath : 'lib/example-1.js',
        sourceMapPath : 'lib/example-1.mjs.map',
    }
}

function expandFilePatterns(directoryPath : string, patterns : string[]) : string[] {
    const result : string[] = []

    for (const pattern of patterns) {
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
