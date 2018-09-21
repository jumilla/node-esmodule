"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var OPENSSL = 'openssl';
function runCommand(command, callback) {
    var stdoutbuff = [];
    var stderrbuff = [];
    var terminate = false;
    if (command.find(function (item) { return item == 's_client'; })) {
        terminate = true;
    }
    var openssl = child_process.spawn(OPENSSL, command);
    openssl.stdout.on('data', function (data) {
        stdoutbuff.push(data.toString());
        if (terminate) {
            if (data.toString().indexOf('Verify return code: ') >= 0) {
                openssl.kill();
            }
        }
    });
    openssl.stderr.on('data', function (data) {
        stderrbuff.push(data.toString());
    });
    openssl.on('exit', function (code) {
        if (terminate && code == null) {
            code = 0;
        }
        var result = {
            command: 'openssl ' + command.join(' '),
            stdout: stdoutbuff.join(''),
            stderr: stderrbuff.join(''),
            exitcode: code,
        };
        callback(result);
    });
}
function generateX509Certificate(options) {
    var rsa_bits = (options && options.rsa_bits) || 2048;
    var subject = (options && options.subject) || {};
    var others = (options && options.others) || [];
    var command = [];
    command.push('req', '-x509', '-outform', 'PEM');
    command.push('-newkey', 'rsa:' + rsa_bits, '-nodes', '-sha256');
    command.push('-subj', Object.keys(subject).map(function (name) {
        return '/' + name + '=' + subject[name];
    }).join(''));
    // command.push('-out', 'priv.pem')
    command.push.apply(command, others);
    return new Promise(function (resolve, reject) {
        runCommand(command, function (result) {
            if (result.exitcode != 0) {
                reject(result.stderr);
            }
            else {
                var certificate_1 = [];
                var privateKey_1 = [];
                var mode_1 = 0;
                result.stdout.split('\n').forEach(function (line) {
                    switch (line) {
                        case '-----BEGIN CERTIFICATE-----':
                            mode_1 = 1;
                            break;
                        case '-----BEGIN PRIVATE KEY-----':
                            mode_1 = 2;
                            break;
                    }
                    switch (mode_1) {
                        case 1:
                            certificate_1.push(line);
                            break;
                        case 2:
                            privateKey_1.push(line);
                            break;
                    }
                });
                resolve({
                    certificate: certificate_1.join('\n'),
                    privateKey: privateKey_1.join('\n'),
                });
            }
        });
    });
}
exports.default = {
    generateX509Certificate: generateX509Certificate,
};
