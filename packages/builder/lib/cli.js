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
        // log.level = 'silly'
        const configFilePath = platform_1.default.resolvePath(program.directoryPath, config_1.FILENAME);
        if (!platform_1.default.testFileExists(configFilePath)) {
            npmlog_1.default.error(meta_1.default.program, chalk_1.default.red('No config'));
            throw new Error();
        }
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.green('ES Module builder'));
        npmlog_1.default.info(meta_1.default.program, chalk_1.default.yellow('Version: ') + meta_1.default.version);
        const project = project_1.default.load(configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, "...config loaded");
        npmlog_1.default.silly(meta_1.default.program, project.config.toString());
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Path: '), configFilePath);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Version: '), project.config.version);
        npmlog_1.default.verbose(meta_1.default.program, chalk_1.default.yellow('Files: '), project.codePaths);
        yield project_1.default.build(project);
    });
}
exports.launch = launch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBeUI7QUFDekIscUNBQXNEO0FBQ3RELHdEQUFnQztBQUNoQywwREFBMEI7QUFDMUIsa0RBQXlCO0FBQ3pCLG9EQUF3QjtBQVF4QixTQUFzQixNQUFNLENBQzNCLE9BQWdCOztRQUVoQixzQkFBc0I7UUFFdEIsTUFBTSxjQUFjLEdBQUcsa0JBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxpQkFBZSxDQUFDLENBQUE7UUFFNUUsSUFBSSxDQUFDLGtCQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3RDLGdCQUFHLENBQUMsS0FBSyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQTtTQUNqQjtRQUVELGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7UUFDeEQsZ0JBQUcsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVoRSxNQUFNLE9BQU8sR0FBRyxpQkFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUU3QyxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUE7UUFFN0MsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFFbEQsZ0JBQUcsQ0FBQyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ2pFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzVFLGdCQUFHLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFckUsTUFBTSxpQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDO0NBQUE7QUExQkQsd0JBMEJDIn0=