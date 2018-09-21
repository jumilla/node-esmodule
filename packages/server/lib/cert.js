"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openssl_1 = require("./openssl");
function generateCertificate() {
    return openssl_1.default.generateX509Certificate({
        subject: {
            'CN': 'localhost',
        }
    });
}
exports.default = {
    generateCertificate: generateCertificate,
};
