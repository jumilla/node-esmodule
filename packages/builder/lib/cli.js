"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = __importDefault(require("./meta"));
const config_1 = require("./config");
const project_1 = __importDefault(require("./project"));
const platform_1 = __importDefault(require("./platform"));
const chalk_1 = __importDefault(require("chalk"));
const npmlog_1 = __importDefault(require("npmlog"));
{
    const program = {
        directoryPath: '.'
    };
    // log.level = 'silly'
    if (process.argv.length >= 3) {
        program.directoryPath = process.argv[2];
    }
    launch(program);
}
function launch(program) {
    const configFilePath = platform_1.default.resolvePath(program.directoryPath, config_1.FILENAME);
    if (!platform_1.default.testFileExists(configFilePath)) {
        npmlog_1.default.error(meta_1.default.program, chalk_1.default.red('No config'));
        process.exit();
    }
    npmlog_1.default.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
    npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
    const project = project_1.default.load(configFilePath);
    npmlog_1.default.verbose(meta_1.default.program, "...config loaded");
    npmlog_1.default.silly(meta_1.default.program, project.config.toString());
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), configFilePath);
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
    project_1.default.build(project);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUF5QjtBQUN6QixxQ0FBc0Q7QUFDdEQsd0RBQWdDO0FBQ2hDLDBEQUEwQjtBQUMxQixrREFBeUI7QUFDekIsb0RBQXdCO0FBUXhCO0lBQ0MsTUFBTSxPQUFPLEdBQVk7UUFDeEIsYUFBYSxFQUFFLEdBQUc7S0FDbEIsQ0FBQTtJQUVELHNCQUFzQjtJQUV0QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUM3QixPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDdkM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7Q0FDZjtBQUVELFNBQVMsTUFBTSxDQUNkLE9BQWdCO0lBRWhCLE1BQU0sY0FBYyxHQUFHLGtCQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsaUJBQWUsQ0FBQyxDQUFBO0lBRTVFLElBQUksQ0FBQyxrQkFBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUN0QyxnQkFBRyxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtRQUMvQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDZDtJQUVELGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7SUFDeEQsZ0JBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVoRSxNQUFNLE9BQU8sR0FBRyxpQkFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUU3QyxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUE7SUFFN0MsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFFbEQsZ0JBQUcsQ0FBQyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQ2pFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzVFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFckUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDeEIsQ0FBQyJ9