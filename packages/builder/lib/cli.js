"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("./meta");
var config_1 = require("./config");
var chalk_1 = require("chalk");
var log = require("npmlog");
var tsc_1 = require("./tsc");
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
