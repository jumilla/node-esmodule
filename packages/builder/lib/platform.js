"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = {
    extractDirectoryPath,
    extractFileTitlePath,
    joinPath,
    resolvePath,
    relativePath,
    normalizePath,
    testFileExists,
    readFile,
    writeFile,
    touchDirectories,
};
function extractDirectoryPath(path) {
    return path_1.default.dirname(path);
}
function extractFileTitlePath(path, extension) {
    return path_1.default.basename(path, extension);
}
function joinPath(...paths) {
    return path_1.default.join(...paths);
}
function resolvePath(...paths) {
    return path_1.default.normalize(path_1.default.join(...paths));
}
function relativePath(baseDirectoryPath, path) {
    return path_1.default.relative(baseDirectoryPath, path);
}
function normalizePath(path) {
    return path_1.default.normalize(path);
}
function testFileExists(path) {
    try {
        fs_1.default.accessSync(path, fs_1.default.constants.R_OK);
        return true;
    }
    catch (error) {
        return false;
    }
}
function readFile(path) {
    return fs_1.default.readFileSync(path, { encoding: 'utf8' });
}
function writeFile(path, content) {
    return fs_1.default.writeFileSync(touchDirectories(path), content, { encoding: 'utf8' });
}
function touchDirectories(filepath) {
    const dirpath = path_1.default.dirname(filepath);
    if (!fs_1.default.existsSync(dirpath)) {
        fs_1.default.mkdirSync(dirpath, {
            recursive: true
        });
    }
    return filepath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGxhdGZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0Q0FBbUI7QUFDbkIsZ0RBQXlCO0FBRXpCLGtCQUFlO0lBQ2Qsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixRQUFRO0lBQ1IsV0FBVztJQUNYLFlBQVk7SUFDWixhQUFhO0lBQ2IsY0FBYztJQUNkLFFBQVE7SUFDUixTQUFTO0lBQ1QsZ0JBQWdCO0NBQ2hCLENBQUE7QUFFRCxTQUFTLG9CQUFvQixDQUM1QixJQUFZO0lBRVosT0FBTyxjQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVCLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUM1QixJQUFZLEVBQ1osU0FBa0I7SUFFbEIsT0FBTyxjQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUN4QyxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQ2hCLEdBQUcsS0FBZTtJQUVsQixPQUFPLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQ25CLEdBQUcsS0FBZTtJQUVsQixPQUFPLGNBQU0sQ0FBQyxTQUFTLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDL0MsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUNwQixpQkFBeUIsRUFDekIsSUFBWTtJQUVaLE9BQU8sY0FBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNoRCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQ3JCLElBQVk7SUFFWixPQUFPLGNBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDOUIsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUN0QixJQUFZO0lBRVosSUFBSTtRQUNILFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdEMsT0FBTyxJQUFJLENBQUE7S0FDWDtJQUNELE9BQU8sS0FBSyxFQUFFO1FBQ2IsT0FBTyxLQUFLLENBQUE7S0FDWjtBQUNGLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDaEIsSUFBWTtJQUVaLE9BQU8sWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUNuRCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQ2pCLElBQVksRUFDWixPQUFlO0lBRWYsT0FBTyxZQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQy9FLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUN4QixRQUFnQjtJQUVoQixNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRXhDLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVCLFlBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQ3JCLFNBQVMsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFBO0tBQ0Y7SUFFRCxPQUFPLFFBQVEsQ0FBQTtBQUNoQixDQUFDIn0=