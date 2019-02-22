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
    source: 'module.ts',
    include: ['*'],
    exclude: [],
    out: { source: '@module.ts', module: 'module.js' },
    typescript: { compilerOptions: {
            locale: process.env.LANG,
        } },
    babel: {},
};
function resolvePath(baseDirectoryPath, filename) {
    return path.normalize(path.join(baseDirectoryPath, filename));
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
    return {
        baseDirectoryPath: baseDirectoryPath,
        configFilePath: configFilePath,
        config: config,
        definitionPath: baseDirectoryPath + '/' + config.source,
        codePaths: expandFilePatterns(baseDirectoryPath, config),
        moduleSourcePath: resolvePath(baseDirectoryPath, config.out.source),
        typePath: resolvePath(baseDirectoryPath, config.out.module + '.d.ts'),
        moduleEsmPath: resolvePath(baseDirectoryPath, config.out.module + '.mjs'),
        // moduleCjsPath : 'lib/example-1.js',
        sourceMapPath: resolvePath(baseDirectoryPath, config.out.module + '.mjs.map'),
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
    var source = choiseValue(DEFAULT.source, data.source);
    var include = choiseValue(DEFAULT.include, typeof data.include === 'string' ? [data.include] : data.include);
    var exclude = choiseValue(DEFAULT.exclude, typeof data.exclude === 'string' ? [data.exclude] : data.exclude);
    var out = choiseValue(DEFAULT.out, data.out, function (value) {
        if (typeof value === 'string') {
            return { source: source, module: value };
        }
        else if (typeof value === 'object') {
            return value;
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { source: '', module: '' };
        }
        else {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { source: '', module: '' };
        }
    });
    console.log(version, source, out);
    var typescript = choiseObject(DEFAULT.typescript, data.typescript);
    var babel = choiseObject(DEFAULT.babel, data.babel);
    return {
        version: version,
        compiler: compiler,
        source: source,
        include: include,
        exclude: exclude,
        out: out,
        typescript: typescript,
        babel: babel,
    };
}
function expandFilePatterns(directoryPath, config) {
    var result = [];
    var excludePaths = [];
    for (var _i = 0, _a = config.exclude; _i < _a.length; _i++) {
        var pattern = _a[_i];
        var matches = glob.sync(directoryPath + '/' + pattern);
        excludePaths.push.apply(excludePaths, matches);
    }
    for (var _b = 0, _c = config.include; _b < _c.length; _b++) {
        var pattern = _c[_b];
        // Add suffix '.ts'
        if (pattern.endsWith('/')) {
            pattern = pattern + '*.ts';
        }
        else if (pattern.endsWith('*')) {
            pattern = pattern + '.ts';
        }
        // const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
        var matches = glob.sync(resolvePath(directoryPath, pattern));
        for (var _d = 0, matches_1 = matches; _d < matches_1.length; _d++) {
            var match = matches_1[_d];
            // exclude ${source} file
            if (match == resolvePath(directoryPath, config.source))
                continue;
            // exclude ${out.source} file
            if (match == resolvePath(directoryPath, config.out.source))
                continue;
            // exclude ${exclude} pattern
            if (excludePaths.indexOf(match) != -1)
                continue;
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
