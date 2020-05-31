"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = __importDefault(require("./meta"));
const config_1 = __importDefault(require("./config"));
const sourcemap_1 = __importDefault(require("./sourcemap"));
const platform_1 = __importDefault(require("./platform"));
const tsc_1 = __importDefault(require("./compilers/tsc"));
const babel_1 = __importDefault(require("./compilers/babel"));
const npmlog_1 = __importDefault(require("npmlog"));
const glob_1 = __importDefault(require("glob"));
exports.default = {
    load,
    build,
};
function load(configFilePath, baseDirectoryPath = platform_1.default.extractDirectoryPath(configFilePath)) {
    const text = platform_1.default.readFile(configFilePath);
    const config = config_1.default(text);
    const definitionPath = platform_1.default.resolvePath(baseDirectoryPath, config.source);
    const codePaths = expandFilePatterns(baseDirectoryPath, config);
    const sourceMap = makeSourceMap(definitionPath, codePaths);
    return {
        baseDirectoryPath,
        configFilePath,
        config,
        definitionPath,
        codePaths,
        moduleSourcePath: config.out.source ? platform_1.default.resolvePath(baseDirectoryPath, config.out.source) : undefined,
        moduleName: platform_1.default.extractFileTitlePath(config.out.module),
        sourceMap,
    };
}
function expandFilePatterns(directoryPath, config) {
    const result = [];
    const excludePaths = [];
    for (let pattern of config.exclude) {
        const matches = glob_1.default.sync(directoryPath + '/' + pattern);
        excludePaths.push(...matches);
    }
    for (let pattern of config.include) {
        // Add suffix '.ts'
        if (pattern.endsWith('/')) {
            pattern = pattern + '*.ts';
        }
        else if (pattern.endsWith('*')) {
            pattern = pattern + '.ts';
        }
        // const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
        const matches = glob_1.default.sync(platform_1.default.resolvePath(directoryPath, pattern));
        for (const match of matches) {
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
    const sourceMap = new sourcemap_1.default();
    let afterPartLineIndex = 0;
    const lines = platform_1.default.readFile(definitionPath).split(/\r\n|\n/);
    for (let index = 0; index < lines.length; ++index) {
        const line = lines[index];
        const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            // 1. before part
            sourceMap.addSource(definitionPath, lines.slice(0, index).join('\n'), 0, index);
            afterPartLineIndex = index + 1;
            // 2. source part
            for (const path of codePaths) {
                const lines = platform_1.default.readFile(path).split(/\r\n|\n/);
                sourceMap.addSource(path, lines.join('\n'), 0, lines.length);
            }
            break;
        }
    }
    // 3. after part
    sourceMap.addSource(definitionPath, lines.slice(afterPartLineIndex).join('\n'), afterPartLineIndex, lines.length - afterPartLineIndex);
    return sourceMap;
}
async function build(project) {
    switch (project.config.compiler) {
        case 'typescript':
            await tsc_1.default.build(project);
            break;
        case 'babel':
            await babel_1.default.build(project);
            break;
        default:
            npmlog_1.default.error(meta_1.default.program, 'Invalid compiler specified.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQXlCO0FBQ3pCLHNEQUE4QztBQUM5Qyw0REFBbUM7QUFDbkMsMERBQTBCO0FBQzFCLDBEQUFpQztBQUNqQyw4REFBcUM7QUFDckMsb0RBQXdCO0FBQ3hCLGdEQUF1QjtBQUV2QixrQkFBZTtJQUNkLElBQUk7SUFDSixLQUFLO0NBQ0wsQ0FBQTtBQWFELFNBQVMsSUFBSSxDQUNaLGNBQXNCLEVBQ3RCLG9CQUE0QixrQkFBQyxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQztJQUVsRSxNQUFNLElBQUksR0FBRyxrQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUV2QyxNQUFNLE1BQU0sR0FBRyxnQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRWhDLE1BQU0sY0FBYyxHQUFHLGtCQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUV0RSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUUvRCxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBRTFELE9BQU87UUFDTixpQkFBaUI7UUFDakIsY0FBYztRQUNkLE1BQU07UUFDTixjQUFjO1FBQ2QsU0FBUztRQUNULGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3JHLFVBQVUsRUFBRSxrQkFBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FB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