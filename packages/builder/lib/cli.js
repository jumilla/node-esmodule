"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("./meta"));
var config_1 = __importDefault(require("./config"));
var project_1 = __importDefault(require("./project"));
var platform_1 = __importDefault(require("./platform"));
var chalk_1 = __importDefault(require("chalk"));
var npmlog_1 = __importDefault(require("npmlog"));
(function () {
    var program = {
        directoryPath: '.'
    };
    // log.level = 'silly'
    if (process.argv.length >= 3) {
        program.directoryPath = process.argv[2];
    }
    launch(program);
})();
function launch(program) {
    var configFilePath = platform_1.default.resolvePath(program.directoryPath, config_1.default.FILENAME);
    if (!platform_1.default.testFileExists(configFilePath)) {
        npmlog_1.default.error(meta_1.default.program, chalk_1.default.red('No config'));
        process.exit();
    }
    npmlog_1.default.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
    npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
    var project = project_1.default.load(configFilePath);
    npmlog_1.default.verbose(meta_1.default.program, "...config loaded");
    npmlog_1.default.silly(meta_1.default.program, project.config.toString());
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), configFilePath);
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
    npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
    project_1.default.build(project);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGdEQUF5QjtBQUN6QixvREFBNkI7QUFDN0Isc0RBQWdDO0FBQ2hDLHdEQUEwQjtBQUMxQixnREFBeUI7QUFDekIsa0RBQXdCO0FBU3hCLENBQUM7SUFDQSxJQUFNLE9BQU8sR0FBWTtRQUN4QixhQUFhLEVBQUUsR0FBRztLQUNsQixDQUFBO0lBRUQsc0JBQXNCO0lBRXRCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQzdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN2QztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNoQixDQUFDLENBQUMsRUFBRSxDQUFBO0FBRUosU0FBUyxNQUFNLENBQUMsT0FBZ0I7SUFDL0IsSUFBTSxjQUFjLEdBQUcsa0JBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRTVFLElBQUksQ0FBQyxrQkFBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUN0QyxnQkFBRyxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtRQUMvQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDZDtJQUVELGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7SUFDeEQsZ0JBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVoRSxJQUFNLE9BQU8sR0FBRyxpQkFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUU3QyxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUE7SUFFN0MsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFFbEQsZ0JBQUcsQ0FBQyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQ2pFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzVFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFckUsaUJBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDeEIsQ0FBQyJ9