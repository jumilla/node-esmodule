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
    var codePaths = expandFilePatterns(baseDirectoryPath, config);
    var sourceMap = new sourcemap_1.SourceMap();
    for (var _i = 0, codePaths_1 = codePaths; _i < codePaths_1.length; _i++) {
        var path = codePaths_1[_i];
        // sourceMap.addSource(path)
    }
    return {
        baseDirectoryPath: baseDirectoryPath,
        configFilePath: configFilePath,
        config: config,
        definitionPath: platform_1.default.resolvePath(baseDirectoryPath, config.source),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsZ0RBQXlCO0FBQ3pCLG9EQUEwQztBQUMxQyx5Q0FBdUM7QUFDdkMsd0RBQTBCO0FBQzFCLHdEQUFpQztBQUNqQyw0REFBcUM7QUFDckMsa0RBQXdCO0FBQ3hCLDhDQUF1QjtBQUV2QixrQkFBZTtJQUNkLElBQUksTUFBQTtJQUNKLEtBQUssT0FBQTtDQUNMLENBQUE7QUFnQkQsU0FBUyxJQUFJLENBQUMsY0FBc0IsRUFBRSxpQkFBa0U7SUFBbEUsa0NBQUEsRUFBQSxvQkFBNEIsa0JBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7SUFDdkcsSUFBTSxJQUFJLEdBQUcsa0JBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFdkMsSUFBTSxNQUFNLEdBQUcsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFbEMsSUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFL0QsSUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUE7SUFFakMsS0FBbUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTLEVBQUU7UUFBekIsSUFBTSxJQUFJLGtCQUFBO1FBQ2QsNEJBQTRCO0tBQzVCO0lBRUQsT0FBTztRQUNOLGlCQUFpQixtQkFBQTtRQUNqQixjQUFjLGdCQUFBO1FBQ2QsTUFBTSxRQUFBO1FBQ04sY0FBYyxFQUFFLGtCQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDL0QsU0FBUyxXQUFBO1FBQ1QsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixF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