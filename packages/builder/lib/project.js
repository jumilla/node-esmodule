"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("./meta"));
var config_1 = __importDefault(require("./config"));
var sourcemap_1 = require("./sourcemap");
var platform_1 = __importDefault(require("./platform"));
var tsc_1 = __importDefault(require("./compilers/tsc"));
var babel_1 = __importDefault(require("./compilers/babel"));
var npmlog_1 = __importDefault(require("npmlog"));
var glob_1 = __importDefault(require("glob"));
exports.default = {
    load: load,
    build: build,
};
function load(configFilePath, baseDirectoryPath) {
    if (baseDirectoryPath === void 0) { baseDirectoryPath = platform_1.default.extractDirectoryPath(configFilePath); }
    var text = platform_1.default.readFile(configFilePath);
    var config = config_1.default.parse(text);
    var definitionPath = platform_1.default.resolvePath(baseDirectoryPath, config.source);
    var codePaths = expandFilePatterns(baseDirectoryPath, config);
    var sourceMap = makeSourceMap(definitionPath, codePaths);
    return {
        baseDirectoryPath: baseDirectoryPath,
        configFilePath: configFilePath,
        config: config,
        definitionPath: definitionPath,
        codePaths: codePaths,
        moduleSourcePath: config.out.source ? platform_1.default.resolvePath(baseDirectoryPath, config.out.source) : undefined,
        typePath: platform_1.default.resolvePath(baseDirectoryPath, config.out.module + '.d.ts'),
        moduleEsmPath: platform_1.default.resolvePath(baseDirectoryPath, config.out.module + '.mjs'),
        // moduleCjsPath : 'lib/example-1.js',
        sourceMapPath: platform_1.default.resolvePath(baseDirectoryPath, config.out.module + '.mjs.map'),
        sourceMap: sourceMap,
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
        var matches = glob_1.default.sync(platform_1.default.resolvePath(directoryPath, pattern));
        for (var _d = 0, matches_1 = matches; _d < matches_1.length; _d++) {
            var match = matches_1[_d];
            // exclude ${source} file
            if (match == platform_1.default.resolvePath(directoryPath, config.source))
                continue;
            // exclude ${out.source} file
            if (config.out.source) {
                if (match == platform_1.default.resolvePath(directoryPath, config.out.source))
                    continue;
            }
            // exclude ${exclude} pattern
            if (excludePaths.indexOf(match) != -1)
                continue;
            result.push(platform_1.default.normalizePath(match));
        }
    }
    return result;
}
function makeSourceMap(definitionPath, codePaths) {
    var sourceMap = new sourcemap_1.SourceMap();
    var afterPartLineIndex = 0;
    var lines = platform_1.default.readFile(definitionPath).split(/\r\n|\n/);
    for (var index = 0; index < lines.length; ++index) {
        var line = lines[index];
        var match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            // 1. before part
            sourceMap.addSource(definitionPath, lines.slice(0, index).join('\n'), 0, index);
            afterPartLineIndex = index;
            // 2. source part
            for (var _i = 0, codePaths_1 = codePaths; _i < codePaths_1.length; _i++) {
                var path = codePaths_1[_i];
                var lines_1 = platform_1.default.readFile(path).split(/\r\n|\n/);
                sourceMap.addSource(path, lines_1.join('\n'), 0, lines_1.length);
            }
            break;
        }
    }
    // 3. after part
    sourceMap.addSource(definitionPath, lines.slice(afterPartLineIndex).join('\n'), afterPartLineIndex, lines.length - afterPartLineIndex);
    return sourceMap;
}
function build(project) {
    switch (project.config.compiler) {
        case 'typescript':
            tsc_1.default.build(project);
            break;
        case 'babel':
            babel_1.default.build(project);
            break;
        default:
            npmlog_1.default.error(meta_1.default.program, 'Invalid compiler specified.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsZ0RBQXlCO0FBQ3pCLG9EQUEwQztBQUMxQyx5Q0FBdUM7QUFDdkMsd0RBQTBCO0FBQzFCLHdEQUFpQztBQUNqQyw0REFBcUM7QUFDckMsa0RBQXdCO0FBQ3hCLDhDQUF1QjtBQUV2QixrQkFBZTtJQUNkLElBQUksTUFBQTtJQUNKLEtBQUssT0FBQTtDQUNMLENBQUE7QUFnQkQsU0FBUyxJQUFJLENBQUMsY0FBc0IsRUFBRSxpQkFBa0U7SUFBbEUsa0NBQUEsRUFBQSxvQkFBNEIsa0JBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7SUFDdkcsSUFBTSxJQUFJLEdBQUcsa0JBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFdkMsSUFBTSxNQUFNLEdBQUcsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFbEMsSUFBTSxjQUFjLEdBQUcsa0JBQUMsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRXRFLElBQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBRS9ELElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFFMUQsT0FBTztRQUNOLGlCQUFpQixtQkFBQTtRQUNqQixjQUFjLGdCQUFBO1FBQ2QsTUFBTSxRQUFBO1FBQ04sY0FBYyxnQkFBQTtRQUNkLFNBQVMsV0FBQTtRQUNULGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFT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