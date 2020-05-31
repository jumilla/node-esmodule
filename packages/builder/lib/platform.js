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
    const dirpath = path_1.default.dirname(filepath);
    if (!fs_1.default.existsSync(dirpath)) {
        fs_1.default.mkdirSync(dirpath, {
            recursive: true
        });
    }
    return filepath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGxhdGZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0Q0FBbUI7QUFDbkIsZ0RBQXlCO0FBRXpCLGtCQUFlO0lBQ2Qsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixRQUFRO0lBQ1IsV0FBVztJQUNYLGFBQWE7SUFDYixjQUFjO0lBQ2QsUUFBUTtJQUNSLFNBQVM7SUFDVCxnQkFBZ0I7Q0FDaEIsQ0FBQTtBQUVELFNBQVMsb0JBQW9CLENBQzVCLElBQVk7SUFFWixPQUFPLGNBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQzVCLElBQVksRUFDWixTQUFrQjtJQUVsQixPQUFPLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3hDLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDaEIsS0FBYSxFQUNiLEtBQWE7SUFFYixPQUFPLGNBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ2pDLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FDbkIsaUJBQXlCLEVBQ3pCLFFBQWdCO0lBRWhCLE9BQU8sY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDbEUsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUNyQixJQUFZO0lBRVosT0FBTyxjQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzlCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FDdEIsSUFBWTtJQUVaLElBQUk7UUFDSCxZQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RDLE9BQU8sSUFBSSxDQUFBO0tBQ1g7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNiLE9BQU8sS0FBSyxDQUFBO0tBQ1o7QUFDRixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQ2hCLElBQVk7SUFFWixPQUFPLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUNqQixJQUFZLEVBQ1osT0FBZTtJQUVmLE9BQU8sWUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQ3hCLFFBQWdCO0lBRWhCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFFeEMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDNUIsWUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDckIsU0FBUyxFQUFFLElBQUk7U0FDZixDQUFDLENBQUE7S0FDRjtJQUVELE9BQU8sUUFBUSxDQUFBO0FBQ2hCLENBQUMifQ==