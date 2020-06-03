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
    const entryPath = platform_1.default.resolvePath(baseDirectoryPath, config.source.directory, config.source.entry);
    const codePaths = expandFilePatterns(baseDirectoryPath, config);
    const sourceMap = makeSourceMap(entryPath, codePaths);
    return {
        baseDirectoryPath,
        configFilePath,
        config,
        entryPath,
        codePaths,
        moduleDirectoryPath: config.module.directory,
        modulePathWithoutExtension: platform_1.default.resolvePath(baseDirectoryPath, config.module.directory, config.module.name),
        sourceMap,
    };
}
function expandFilePatterns(directoryPath, config) {
    const result = [];
    const excludePaths = [];
    for (let pattern of config.source.exclude) {
        const matches = glob_1.default.sync(platform_1.default.resolvePath(directoryPath, config.source.directory, pattern));
        excludePaths.push(...matches);
    }
    for (let pattern of config.source.include) {
        // Add suffix '.ts'
        if (pattern.endsWith('/')) {
            pattern = pattern + '*.ts';
        }
        else if (pattern.endsWith('*')) {
            pattern = pattern + '.ts';
        }
        // const matches = glob.sync(fs.realpathSync(directoryPath) + '/' + pattern)
        const matches = glob_1.default.sync(platform_1.default.resolvePath(directoryPath, config.source.directory, pattern));
        for (const match of matches) {
            // exclude ${source.entry} file
            if (match == platform_1.default.resolvePath(directoryPath, config.source.directory, config.source.entry))
                continue;
            // exclude ${exclude} pattern
            if (excludePaths.indexOf(match) != -1)
                continue;
            result.push(platform_1.default.normalizePath(match));
        }
    }
    return result;
}
function makeSourceMap(entryPath, codePaths) {
    const sourceMap = new sourcemap_1.default();
    let afterPartLineIndex = 0;
    const lines = platform_1.default.readFile(entryPath).split(/\r\n|\n/);
    for (let index = 0; index < lines.length; ++index) {
        const line = lines[index];
        const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            // 1. before part
            sourceMap.addSource(entryPath, lines.slice(0, index).join('\n'), 0, index);
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
    sourceMap.addSource(entryPath, lines.slice(afterPartLineIndex).join('\n'), afterPartLineIndex, lines.length - afterPartLineIndex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQXlCO0FBQ3pCLHNEQUE4QztBQUM5Qyw0REFBbUM7QUFDbkMsMERBQTBCO0FBQzFCLDBEQUFpQztBQUNqQyw4REFBcUM7QUFDckMsb0RBQXdCO0FBQ3hCLGdEQUF1QjtBQUV2QixrQkFBZTtJQUNkLElBQUk7SUFDSixLQUFLO0NBQ0wsQ0FBQTtBQWFELFNBQVMsSUFBSSxDQUNaLGNBQXNCLEVBQ3RCLG9CQUE0QixrQkFBQyxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQztJQUVsRSxNQUFNLElBQUksR0FBRyxrQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUV2QyxNQUFNLE1BQU0sR0FBRyxnQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRWhDLE1BQU0sU0FBUyxHQUFHLGtCQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEcsTUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFL0QsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUVyRCxPQUFPO1FBQ04saUJBQWlCO1FBQ2pCLGNBQWM7UUFDZCxNQUFNO1FBQ04sU0FBUztRQUNULFNBQVM7UUFDVCxtQkFBbUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVM7UUFDNUMsMEJBQTBCLEVBQUUsa0JBQUMsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDekcsU0FBUztLQUNULENB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