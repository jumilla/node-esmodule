"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.default = {
    extractDirectoryPath: extractDirectoryPath,
    joinPath: joinPath,
    resolvePath: resolvePath,
    normalizePath: normalizePath,
    testFileExists: testFileExists,
    readFile: readFile,
    writeFile: writeFile,
    touchDirectories: touchDirectories,
};
function extractDirectoryPath(path) {
    return path_1.default.dirname(path);
}
function joinPath(path1, path2) {
    return path_1.default.join(path1, path2);
}
function resolvePath(baseDirectoryPath, filename) {
    return path_1.default.normalize(path_1.default.join(baseDirectoryPath, filename));
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
    return fs_1.default.writeFileSync(path, content, { encoding: 'utf8' });
}
function touchDirectories(filepath) {
    var dirpath = path_1.default.dirname(filepath);
    if (!fs_1.default.existsSync(dirpath)) {
        fs_1.default.mkdirSync(dirpath, {
            recursive: true
        });
    }
    return filepath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGxhdGZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSwwQ0FBbUI7QUFDbkIsOENBQXlCO0FBRXpCLGtCQUFlO0lBQ2Qsb0JBQW9CLHNCQUFBO0lBQ3BCLFFBQVEsVUFBQTtJQUNSLFdBQVcsYUFBQTtJQUNYLGFBQWEsZUFBQTtJQUNiLGNBQWMsZ0JBQUE7SUFDZCxRQUFRLFVBQUE7SUFDUixTQUFTLFdBQUE7SUFDVCxnQkFBZ0Isa0JBQUE7Q0FDaEIsQ0FBQTtBQUVELFNBQVMsb0JBQW9CLENBQUMsSUFBWTtJQUN6QyxPQUFPLGNBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhO0lBQzdDLE9BQU8sY0FBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDakMsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLGlCQUF5QixFQUFFLFFBQWdCO0lBQy9ELE9BQU8sY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDbEUsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDbEMsT0FBTyxjQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzlCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFZO0lBQ25DLElBQUk7UUFDSCxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RDLE9BQU8sSUFBSSxDQUFBO0tBQ1g7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNiLE9BQU8sS0FBSyxDQUFBO0tBQ1o7QUFDRixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsSUFBWTtJQUM3QixPQUFPLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQVksRUFBRSxPQUFlO0lBQy9DLE9BQU8sWUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsUUFBZ0I7SUFDekMsSUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUV4QyxJQUFJLENBQUMsWUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUM1QixZQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNyQixTQUFTLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQTtLQUNGO0lBRUQsT0FBTyxRQUFRLENBQUE7QUFDaEIsQ0FBQyJ9