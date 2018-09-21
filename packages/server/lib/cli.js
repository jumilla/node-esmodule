"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("./meta");
var mimetype_1 = require("./mimetype");
var http = require("http2");
var fs = require("fs");
var filepath = require("path");
var chalk_1 = require("chalk");
var document_root_path = process.cwd();
console.log(chalk_1.default.green('ES Module server'));
console.log(chalk_1.default.yellow('Version: ') + meta_1.default.version);
console.log(chalk_1.default.yellow('Document Root: ') + document_root_path);
var cert_1 = require("./cert");
cert_1.default.generateCertificate()
    .then(function (credentials) {
    startServer(credentials);
})
    .catch(function (error) {
    console.error(error);
});
function startServer(credentials) {
    var options = {
        cert: credentials.certificate,
        key: credentials.privateKey,
    };
    http.createSecureServer(options)
        .on('request', function (request, response) {
        var _a, _b;
        console.info('Request: ', request.url);
        var url = request.url;
        if (url == '/') {
            url += 'index.html';
        }
        var path = document_root_path + url;
        if (!fs.existsSync(path)) {
            response.stream.respond((_a = {},
                _a[http.constants.HTTP2_HEADER_STATUS] = 404,
                _a[http.constants.HTTP2_HEADER_CONTENT_TYPE] = 'text/plain',
                _a));
            response.stream.end('Not found.');
        }
        else {
            var mimetype = mimetype_1.default(filepath.extname(path));
            console.debug('File', path);
            console.debug('MimeType', mimetype);
            response.stream.respondWithFile(path, (_b = {},
                _b[http.constants.HTTP2_HEADER_STATUS] = 200,
                _b[http.constants.HTTP2_HEADER_CONTENT_TYPE] = mimetype,
                _b), { onError: function (error) { return console.error(error); } });
        }
    })
        .on('sessionError', function (error) {
        console.error('Session Error', error);
    })
        .listen(8000);
    {
        http.createServer(function (request, response) {
            console.log(98);
            response.writeHead(301, { Location: 'https://localhost:8000' });
            response.end('');
        }).listen(8001);
    }
    console.log('Server launched.');
}
