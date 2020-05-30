"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = __importDefault(require("./platform"));
var packageInfo = JSON.parse(platform_1.default.readFile(__dirname + '/../package.json'));
exports.default = {
    version: packageInfo.version,
    program: 'esmc',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esd0RBQTBCO0FBSTFCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtBQUUxRSxrQkFBZTtJQUNkLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztJQUM1QixPQUFPLEVBQUUsTUFBTTtDQUNmLENBQUEifQ==