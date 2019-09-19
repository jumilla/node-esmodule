"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var packageInfo = JSON.parse(fs_1.default.readFileSync(__dirname + '/../package.json', { encoding: 'UTF-8' }));
exports.default = {
    version: packageInfo.version,
    program: 'esmc',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsMENBQW1CO0FBRW5CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXBHLGtCQUFlO0lBQ1gsT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPO0lBQzVCLE9BQU8sRUFBRSxNQUFNO0NBQ2xCLENBQUEifQ==