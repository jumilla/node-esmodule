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
exports.run = exports.processCommandLine = void 0;
const meta_1 = __importDefault(require("./meta"));
const config_1 = require("./config");
const project_1 = require("./project");
const platform_1 = __importDefault(require("./platform"));
const chalk_1 = __importDefault(require("chalk"));
const npmlog_1 = __importDefault(require("npmlog"));
const commander_1 = __importDefault(require("commander"));
const LOG_LEVELS = [
    "silly",
    "verbose",
    "info",
    //	"timing",
    //	"http",
    "notice",
    "warn",
    "error",
    "silent",
];
function processCommandLine(args) {
    commander_1.default
        .version(meta_1.default.version, '-v, --version')
        .arguments('[config]')
        .action(config => {
        commander_1.default.config = config !== null && config !== void 0 ? config : '.';
    })
        .option('-l, --log <level>', 'Log level', value => {
        value = value.toLowerCase();
        if (!LOG_LEVELS.includes(value)) {
            npmlog_1.default.warn(meta_1.default.program, chalk_1.default.red('invalid log-level:'), chalk_1.default.white.bgRed(value));
            value = 'info';
        }
        return value;
    })
        .parse(args);
    const configFilePath = platform_1.default.testDirectoryExists(commander_1.default.config)
        ? platform_1.default.joinPath(commander_1.default.config, config_1.FILENAME)
        : commander_1.default.config;
    return {
        configFilePath,
        logLevel: commander_1.default.log,
    };
}
exports.processCommandLine = processCommandLine;
function run(program) {
    return __awaiter(this, void 0, void 0, function* () {
        npmlog_1.default.level = program.logLevel || 'info';
        const configFilePath = platform_1.default.resolvePath(program.configFilePath);
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('CWD: ') + process.cwd());
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Config: ') + configFilePath);
        if (!platform_1.default.testFileExists(configFilePath)) {
            npmlog_1.default.error(meta_1.default.program, chalk_1.default.red('Config file not found:'), chalk_1.default.white.bgRed(configFilePath));
            throw new Error();
        }
        const project = project_1.load(configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, "...config loaded");
        npmlog_1.default.silly(meta_1.default.program, JSON.stringify(project.config, null, 2));
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
        yield project_1.build(project);
    });
}
exports.run = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBeUI7QUFDekIscUNBQXNEO0FBQ3RELHVDQUFzRTtBQUN0RSwwREFBMEI7QUFDMUIsa0RBQXlCO0FBQ3pCLG9EQUF3QjtBQUN4QiwwREFBOEM7QUFTOUMsTUFBTSxVQUFVLEdBQUc7SUFDbEIsT0FBTztJQUNQLFNBQVM7SUFDVCxNQUFNO0lBQ04sWUFBWTtJQUNaLFVBQVU7SUFDVixRQUFRO0lBQ1IsTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0NBQ1IsQ0FBQTtBQUVELFNBQWdCLGtCQUFrQixDQUNqQyxJQUFjO0lBRWQsbUJBQVM7U0FDUCxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7U0FDdEMsU0FBUyxDQUFDLFVBQVUsQ0FBQztTQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDaEIsbUJBQVMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxhQUFOLE1BQU0sY0FBTixNQUFNLEdBQUksR0FBRyxDQUFBO0lBQ2pDLENBQUMsQ0FBQztTQUNELE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDakQsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNoQyxnQkFBRyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSxlQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1lBQ2pGLEtBQUssR0FBRyxNQUFNLENBQUE7U0FDZDtRQUNELE9BQU8sS0FBSyxDQUFBO0lBQ2IsQ0FBQyxDQUFDO1NBQ0QsS0FB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