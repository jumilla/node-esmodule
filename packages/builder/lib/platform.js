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
    testDirectoryExists,
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
function testDirectoryExists(path) {
    try {
        const stat = fs_1.default.statSync(path);
        return stat.isDirectory();
    }
    catch (_a) {
        return false;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGxhdGZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0Q0FBbUI7QUFDbkIsZ0RBQXlCO0FBRXpCLGtCQUFlO0lBQ2Qsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixRQUFRO0lBQ1IsV0FBVztJQUNYLFlBQVk7SUFDWixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxRQUFRO0lBQ1IsU0FBUztJQUNULGdCQUFnQjtDQUNoQixDQUFBO0FBRUQsU0FBUyxvQkFBb0IsQ0FDNUIsSUFBWTtJQUVaLE9BQU8sY0FBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FDNUIsSUFBWSxFQUNaLFNBQWtCO0lBRWxCLE9BQU8sY0FBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDeEMsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUNoQixHQUFHLEtBQWU7SUFFbEIsT0FBTyxjQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUE7QUFDN0IsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUNuQixHQUFHLEtBQWU7SUFFbEIsT0FBTyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBQy9DLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FDcEIsaUJBQXlCLEVBQ3pCLElBQVk7SUFFWixPQUFPLGNBQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDaEQsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUNyQixJQUFZO0lBRVosT0FBTyxjQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzlCLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUMzQixJQUFZO0lBRVosSUFBSTtRQUNILE1BQU0sSUFBSSxHQUFHLFlBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDOUIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7S0FDekI7SUFDRCxXQUFNO1FBQ0wsT0FBTyxLQUFLLENBQUE7S0FDWjtBQUNGLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FDdEIsSUFBWTtJQUVaLElBQUk7UUFDSCxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RDLE9BQU8sSUFBSSxDQUFBO0tBQ1g7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNiLE9BQU8sS0FBSyxDQUFBO0tBQ1o7QUFDRixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQ2hCLElBQVk7SUFFWixPQUFPLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUNqQixJQUFZLEVBQ1osT0FBZTtJQUVmLE9BQU8sWUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUMvRSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FDeEIsUUFBZ0I7SUFFaEIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUV4QyxJQUFJLENBQUMsWUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUM1QixZQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNyQixTQUFTLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQTtLQUNGO0lBRUQsT0FBTyxRQUFRLENBQUE7QUFDaEIsQ0FBQyJ9