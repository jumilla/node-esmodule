"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.load = void 0;
const meta_1 = __importDefault(require("./meta"));
const config_1 = __importDefault(require("./config"));
const sourcemap_1 = __importDefault(require("./sourcemap"));
const platform_1 = __importDefault(require("./platform"));
const tsc_1 = __importDefault(require("./compilers/tsc"));
const babel_1 = __importDefault(require("./compilers/babel"));
const chalk_1 = __importDefault(require("chalk"));
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
    if (!platform_1.default.testFileExists(entryPath)) {
        npmlog_1.default.error(meta_1.default.program, chalk_1.default.red('Source file not found:'), chalk_1.default.white.bgRed(entryPath));
        throw new Error();
    }
    const codePaths = expandFilePatterns(baseDirectoryPath, config);
    const sourceMap = createSourceMap(entryPath, codePaths);
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
exports.load = load;
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
function createSourceMap(entryPath, codePaths) {
    const sourceMap = new sourcemap_1.default();
    let afterPartLineIndex = 0;
    const lines = readFile(entryPath);
    for (let index = 0; index < lines.length; ++index) {
        const line = lines[index];
        const match = line.match(/^\s*\/\/\/\s*<\s*source\s*\/>/);
        if (match) {
            // 1. before part
            sourceMap.addSource(entryPath, lines.slice(0, index), 1);
            afterPartLineIndex = index + 1;
            // 2. source part
            for (const path of codePaths) {
                const lines = readFile(path);
                const count = lines.length;
                sourceMap.addSource(path, lines, 1);
            }
            break;
        }
    }
    // 3. after part
    sourceMap.addSource(entryPath, lines.slice(afterPartLineIndex), 1 + afterPartLineIndex);
    return sourceMap;
}
function readFile(path) {
    const content = platform_1.default.readFile(path);
    return (content.match(/[\n]$/g) ? content.substring(0, content.length - 1) : content)
        .split(/\r\n|\n/);
}
function build(project) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (project.config.compiler) {
            case 'typescript':
                yield tsc_1.default.build(project);
                break;
            case 'babel':
                yield babel_1.default.build(project);
                break;
            default:
                npmlog_1.default.error(meta_1.default.program, 'Invalid compiler specified.');
        }
    });
}
exports.build = build;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGtEQUF5QjtBQUN6QixzREFBOEM7QUFDOUMsNERBQW1DO0FBQ25DLDBEQUEwQjtBQUMxQiwwREFBaUM7QUFDakMsOERBQXFDO0FBQ3JDLGtEQUF5QjtBQUN6QixvREFBd0I7QUFDeEIsZ0RBQXVCO0FBRXZCLGtCQUFlO0lBQ2QsSUFBSTtJQUNKLEtBQUs7Q0FDTCxDQUFBO0FBYUQsU0FBZ0IsSUFBSSxDQUNuQixjQUFzQixFQUN0QixvQkFBNEIsa0JBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7SUFFbEUsTUFBTSxJQUFJLEdBQUcsa0JBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFdkMsTUFBTSxNQUFNLEdBQUcsZ0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUVoQyxNQUFNLFNBQVMsR0FBRyxrQkFBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhHLElBQUksQ0FBQyxrQkFBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNqQyxnQkFBRyxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsRUFBRSxlQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzFGLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQTtLQUNqQjtJQUVELE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBRS9ELE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsU0FB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