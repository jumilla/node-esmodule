"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var json5_1 = __importDefault(require("json5"));
var glob_1 = __importDefault(require("glob"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
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
            locale: process.env.LANG.substring(0, 2),
        } },
    babel: {},
};
function resolvePath(baseDirectoryPath, filename) {
    return path_1.default.normalize(path_1.default.join(baseDirectoryPath, filename));
}
function exists(filePath) {
    try {
        fs_1.default.accessSync(filePath, fs_1.default.constants.R_OK);
        return true;
    }
    catch (error) {
        return false;
    }
}
function load(configFilePath, baseDirectoryPath) {
    if (baseDirectoryPath === void 0) { baseDirectoryPath = path_1.default.dirname(configFilePath); }
    var text = fs_1.default.readFileSync(configFilePath, { encoding: 'UTF-8' });
    var config = parseConfig(json5_1.default.parse(text));
    return {
        baseDirectoryPath: baseDirectoryPath,
        configFilePath: configFilePath,
        config: config,
        definitionPath: resolvePath(baseDirectoryPath, config.source),
        codePaths: expandFilePatterns(baseDirectoryPath, config),
        moduleSourcePath: config.out.source ? resolvePath(baseDirectoryPath, config.out.source) : undefined,
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
            return { module: value };
        }
        else if (typeof value === 'object') {
            // TODO: check
            return value;
        }
        else if (typeof value === 'undefined') {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '' };
        }
        else {
            // TODO Error handling
            console.log('Parameter "out" must need.');
            return { module: '' };
        }
    });
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
        var matches = glob_1.default.sync(directoryPath + '/' + pattern);
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
        var matches = glob_1.default.sync(resolvePath(directoryPath, pattern));
        for (var _d = 0, matches_1 = matches; _d < matches_1.length; _d++) {
            var match = matches_1[_d];
            // exclude ${source} file
            if (match == resolvePath(directoryPath, config.source))
                continue;
            // exclude ${out.source} file
            if (config.out.source) {
                if (match == resolvePath(directoryPath, config.out.source))
                    continue;
            }
            // exclude ${exclude} pattern
            if (excludePaths.indexOf(match) != -1)
                continue;
            result.push(path_1.default.normalize(match));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGdEQUF5QjtBQUN6Qiw4Q0FBdUI7QUFDdkIsMENBQW1CO0FBQ25CLDhDQUF5QjtBQWF6QixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDcEIseUNBQXlCLENBQUE7SUFDekIsK0JBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHdkI7QUEwQkQsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUE7QUFFakMsSUFBTSxPQUFPLEdBQUc7SUFDWixPQUFPLEVBQUcsS0FBSztJQUNmLFFBQVEsRUFBRyxZQUFZLENBQUMsVUFBVTtJQUNsQyxNQUFNLEVBQUcsV0FBVztJQUNwQixPQUFPLEVBQUcsQ0FBQyxHQUFHLENBQUM7SUFDZixPQUFPLEVBQUcsRUFBRTtJQUNaLEdBQUcsRUFBRyxFQUFFLE1BQU0sRUFBRyxZQUFZLEVBQUUsTUFBTSxFQUFHLFdBQVcsRUFBRTtJQUNyRCxVQUFVLEVBQUcsRUFBRSxlQUFlLEVBQUU7WUFDNUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzVDLEVBQUU7SUFDSCxLQUFLLEVBQUcsRUFBRTtDQUNILENBQUE7QUFFWCxTQUFTLFdBQVcsQ0FBQyxpQkFBMEIsRUFBRSxRQUFpQjtJQUM5RCxPQUFPLGNBQU0sQ0FBQyxTQUFTLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxRQUFpQjtJQUM3QixJQUFJO1FBQ0EsWUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsWUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMx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