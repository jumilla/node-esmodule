"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("./meta");
var config_1 = require("./config");
var chalk_1 = require("chalk");
var tsc_1 = require("./tsc");
console.log(chalk_1.default.green('ES Module builder'));
console.log(chalk_1.default.yellow('Version: ') + meta_1.default.version);
var directoryPath = process.cwd();
if (process.argv.length >= 3) {
    directoryPath = process.argv[2];
}
if (!config_1.default.exists(config_1.default.resolvePath(directoryPath, config_1.default.FILENAME))) {
    console.log(chalk_1.default.red('Error: No config'));
    process.exit();
}
console.log("...config loaded");
var project = config_1.default.load(config_1.default.resolvePath(directoryPath, config_1.default.FILENAME));
console.log(chalk_1.default.yellow('Path: '), config_1.default.resolvePath(directoryPath, config_1.default.FILENAME));
console.log(chalk_1.default.yellow('Version: '), project.config.version);
console.log(chalk_1.default.yellow('Files: '), project.codePaths);
console.log(project);
switch (project.config.compiler) {
    case 'typescript':
        tsc_1.default.compile(project);
        break;
    default:
        console.error('Invalid compiler specified.');
}
