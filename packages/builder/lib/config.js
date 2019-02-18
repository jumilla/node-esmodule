"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json5 = require("json5");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var CompilerKind;
(function (CompilerKind) {
    CompilerKind["TypeScript"] = "typescript";
    CompilerKind["Babel"] = "babel";
})(CompilerKind = exports.CompilerKind || (exports.CompilerKind = {}));
var FILENAME = 'esmconfig.json';
var DEFAULT = {
    version: '0.1',
    compiler: CompilerKind.TypeScript,
    include: [],
    out: '',
    typescript: {
        compilerOptions: {
        //            declaration: true,
        },
    },
    babel: {},
};
function resolvePath(directoryOfFilePath) {
    return directoryOfFilePath + '/' + FILENAME;
}
function exists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.R_OK);
        return true;
    }
    catch (error) {
        return false;
    }
}
function load(configFilePath, baseDirectoryPath) {
    if (baseDirectoryPath === void 0) { baseDirectoryPath = path.dirname(configFilePath); }
    var text = fs.readFileSync(configFilePath, { encoding: 'UTF-8' });
    var config = parseConfig(json5.parse(text));
    console.log(config);
    return {
        baseDirectoryPath: baseDirectoryPath,
        configFilePath: configFilePath,
        config: config,
        sourcePaths: expandFilePatterns(baseDirectoryPath, config.include),
        typePath: config.out + '.d.ts',
        moduleEsmPath: config.out + '.mjs',
        // moduleCjsPath : 'lib/example-1.js',
        sourceMapPath: config.out + '.mjs.map',
    };
}
function parseConfig(data) {
    var choiseValue = function (defaultValue, specifiedValue, checker) {
        var value = specifiedValue || defaultValue;
        return checker ? checker(value) : value;
    };
    var choiseObject = function (defaultValue, specifiedValue) {
        return Object.assign({}, defaultValue, specifiedValue);
    };
    var version = choiseValue(DEFAULT.version, data.version);
    var compiler = choiseValue(DEFAULT.compiler, data.compiler, function (value) {
        var lowerValue = value.toLowerCase();
        if (value == 'typescript')
            return CompilerKind.TypeScript;
        if (value == 'babel')
            return CompilerKind.Babel;
        return CompilerKind.TypeScript;
    });
    var include = choiseValue(DEFAULT.include, data.include);
    var out = choiseValue(undefined, data.out, function (value) {
        if (value === undefined) {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return 'a';
        }
        return value;
    });
    console.log(version, include, out);
    var typescript = choiseObject(DEFAULT.typescript, data.typescript);
    var babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version: version,
        compiler: compiler,
        include: include,
        out: out,
        typescript: typescript,
        babel: babel,
    };
}
function expandFilePatterns(directoryPath, patterns) {
    var result = [];
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var pattern = patterns_1[_i];
        // Add suffix '.ts'
        if (pattern.endsWith('/')) {
            pattern = pattern + '*.ts';
        }
        else if (pattern.endsWith('*')) {
            pattern = pattern + '.ts';
        }
        // const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
        var matches = glob.sync(directoryPath + '/' + pattern);
        for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
            var match = matches_1[_a];
            result.push(path.normalize(match));
        }
    }
    return result;
}
exports.default = {
    FILENAME: FILENAME,
    resolvePath: resolvePath,
    exists: exists,
    load: load,
    expandFilePatterns: expandFilePatterns,
};
