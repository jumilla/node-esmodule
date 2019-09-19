"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __importDefault(require("./meta"));
var config_1 = __importDefault(require("./config"));
var chalk_1 = __importDefault(require("chalk"));
var log = __importStar(require("npmlog"));
var tsc_1 = __importDefault(require("./tsc"));
// log.level = 'silly'
var directoryPath = '.';
if (process.argv.length >= 3) {
    directoryPath = process.argv[2];
}
if (!config_1.default.exists(config_1.default.resolvePath(directoryPath, config_1.default.FILENAME))) {
    log.error(meta_1.default.program, chalk_1.default.red('No config'));
    process.exit();
}
log.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
log.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
var project = config_1.default.load(config_1.default.resolvePath(directoryPath, config_1.default.FILENAME));
log.verbose(meta_1.default.program, "...config loaded");
log.silly(meta_1.default.program, project.config.toString());
log.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), config_1.default.resolvePath(directoryPath, config_1.default.FILENAME));
log.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
log.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
switch (project.config.compiler) {
    case 'typescript':
        tsc_1.default.compile(project);
        break;
    default:
        log.error(meta_1.default.program, 'Invalid compiler specified.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxnREFBeUI7QUFDekIsb0RBQTZCO0FBQzdCLGdEQUF5QjtBQUN6QiwwQ0FBNkI7QUFDN0IsOENBQXVCO0FBRXZCLHNCQUFzQjtBQUV0QixJQUFJLGFBQWEsR0FBRyxHQUFHLENBQUE7QUFFdkIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7SUFDMUIsYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDbEM7QUFFRCxJQUFJLENBQUMsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtJQUNwRSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0lBQy9DLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtDQUNqQjtBQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtBQUN4RCxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFFaEUsSUFBTSxPQUFPLEdBQUcsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUMvRSxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUM3QyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0FBQ2xELEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDckcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1RSxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFJckUsUUFBUSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUM3QixLQUFLLFlBQVk7UUFDYixhQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3BCLE1BQUs7SUFFVDtRQUNJLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSw2QkFBNkIsQ0FBQyxDQUFBO0NBQzdEIn0=