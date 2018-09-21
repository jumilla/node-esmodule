"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MIMETYPES = {
    '.txt': 'text/plain',
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
};
exports.MIMETYPES = MIMETYPES;
var DEFAULT_MIMETYPE = 'application/octet-stream';
function mimetype(extension) {
    return MIMETYPES[extension] || DEFAULT_MIMETYPE;
}
exports.default = mimetype;
