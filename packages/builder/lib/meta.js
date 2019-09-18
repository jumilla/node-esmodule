"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var packageInfo = JSON.parse(fs.readFileSync(__dirname + '/../package.json', { encoding: 'UTF-8' }));
exports.default = {
    version: packageInfo.version,
    program: 'esmodule-builder',
};
