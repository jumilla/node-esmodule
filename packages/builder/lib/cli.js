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
exports.launch = void 0;
const meta_1 = __importDefault(require("./meta"));
const config_1 = require("./config");
const project_1 = __importDefault(require("./project"));
const platform_1 = __importDefault(require("./platform"));
const chalk_1 = __importDefault(require("chalk"));
const npmlog_1 = __importDefault(require("npmlog"));
function launch(program) {
    return __awaiter(this, void 0, void 0, function* () {
        npmlog_1.default.level = program.logLevel || 'info';
        const configFilePath = platform_1.default.resolvePath(program.directoryPath, config_1.FILENAME);
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('CWD: ') + process.cwd());
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Config: ') + configFilePath);
        if (!platform_1.default.testFileExists(configFilePath)) {
            npmlog_1.default.error(meta_1.default.program, chalk_1.default.red(`Config file not found: ${configFilePath}`));
            throw new Error();
        }
        const project = project_1.default.load(configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, "...config loaded");
        npmlog_1.default.silly(meta_1.default.program, JSON.stringify(project.config, null, 2));
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
        yield project_1.default.build(project);
    });
}
exports.launch = launch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBeUI7QUFDekIscUNBQXNEO0FBQ3RELHdEQUFnQztBQUNoQywwREFBMEI7QUFDMUIsa0RBQXlCO0FBQ3pCLG9EQUF3QjtBQVN4QixTQUFzQixNQUFNLENBQzNCLE9BQWdCOztRQUVoQixnQkFBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQTtRQUV0QyxNQUFNLGNBQWMsR0FBRyxrQkFBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGlCQUFlLENBQUMsQ0FBQTtRQUU1RSxnQkFBRyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBO1FBQ3hELGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEUsZ0JBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQzdELGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQTtRQUVqRSxJQUFJLENBQUMsa0JBQUMsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDdEMsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsR0FBRyxDQUFDLDBCQUEwQixjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDOUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFBO1NBQ2pCO1FBRUQsTUFBTSxPQUFPLEdBQUcsaUJBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFN0MsZ0JBQUcsQ0FBQyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO1FBRTdDLGdCQUFHLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRWhFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNqRSxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM1RSxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRXJFLE1BQU0saUJBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDOUIsQ0FBQztDQUFBO0FBNUJELHdCQTRCQyJ9