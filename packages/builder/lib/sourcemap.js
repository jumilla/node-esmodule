"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMap = void 0;
var Source = /** @class */ (function () {
    function Source(path, content) {
        this._path = path;
        this._content = content;
        this._lineCount = calcLineCount(content);
    }
    Source.prototype.path = function () {
        return this._path;
    };
    Source.prototype.content = function () {
        return this._content;
    };
    Source.prototype.lineCount = function () {
        return this._lineCount;
    };
    return Source;
}());
function calcLineCount(content) {
    var count = 0;
    count = content.split(/\r\n|\n/).length;
    return count;
}
var SourceMap = /** @class */ (function () {
    function SourceMap() {
        this._sources = [];
    }
    SourceMap.prototype.addSource = function (path, lineStartNo, content) {
        this._sources.push(new Source(path, content));
    };
    SourceMap.prototype.getLocation = function (wholeLineNo) {
        var remain = wholeLineNo;
        for (var _i = 0, _a = this._sources; _i < _a.length; _i++) {
            var source = _a[_i];
            if (source.lineCount() >= remain) {
                remain -= source.lineCount();
                continue;
            }
            return {
                path: source.path(),
                line: remain,
            };
        }
        throw new Error('wholeLineNo is out of range.');
    };
    return SourceMap;
}());
exports.SourceMap = SourceMap;
exports.default = SourceMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvdXJjZW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQTtJQUNDLGdCQUFZLElBQVksRUFBRSxPQUFlO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pDLENBQUM7SUFFRCxxQkFBSSxHQUFKO1FBQ0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO0lBQ2xCLENBQUM7SUFFRCx3QkFBTyxHQUFQO1FBQ0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3JCLENBQUM7SUFFRCwwQkFBUyxHQUFUO1FBQ0MsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0lBQ3ZCLENBQUM7SUFLRixhQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQUVELFNBQVMsYUFBYSxDQUFDLE9BQWU7SUFDckMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0lBRWIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFBO0lBRXZDLE9BQU8sS0FBSyxDQUFBO0FBQ2IsQ0FBQztBQUVEO0lBQUE7UUF1QlMsYUFBUSxHQUFhLEVBQUUsQ0FBQTtJQUNoQyxDQUFDO0lBdkJBLDZCQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxPQUFlO1FBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksV0FBbUI7UUFDOUIsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFBO1FBRXhCLEtBQXFCLFVBQWEsRUFBYixLQUFBLElBQUksQ0FBQyxRQUFRLEVBQWIsY0FBYSxFQUFiLElBQWEsRUFBRTtZQUEvQixJQUFNLE1BQU0sU0FBQTtZQUNoQixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxNQUFNLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7Z0JBQzVCLFNBQVE7YUFDUjtZQUVELE9BQU87Z0JBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxNQUFNO2FBQ1osQ0FBQTtTQUNEO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFHRixnQkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4QlksOEJBQVM7QUEwQnRCLGtCQUFlLFNBQVMsQ0FBQSJ9