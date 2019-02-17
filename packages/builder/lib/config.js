"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json5 = require("json5");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var FILENAME = 'esmconfig.json';
var DEFAULT = {
    version: '0.1',
    compiler: null,
    include: [],
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
    var config = Object.assign({}, DEFAULT, json5.parse(text));
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
function expandFilePatterns(directoryPath, patterns) {
    var result = [];
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var pattern = patterns_1[_i];
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
