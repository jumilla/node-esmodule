
import * as child_process from 'child_process'

const OPENSSL = 'openssl'

interface CommandResult {
    command : string
    stdout : string
    stderr : string
    exitcode : number
}

function runCommand(command : string[], callback : (result : CommandResult) => void) {
    const stdoutbuff : string[] = [];
    const stderrbuff : string[] = [];
    let terminate = false;
    
    if (command.find(item => item == 's_client')) {
        terminate = true
    }
    
    const openssl = child_process.spawn(OPENSSL, command)
    
    openssl.stdout.on('data', function(data) {
        stdoutbuff.push(data.toString());

        if (terminate) {
            if (data.toString().indexOf('Verify return code: ') >= 0) {
                openssl.kill();
            }
        }
    })

    openssl.stderr.on('data', function(data) {
        stderrbuff.push(data.toString())
    })
    
    openssl.on('exit', function(code) {
        if (terminate && code == null) {
            code = 0
        }

        const result : CommandResult = {
            command: 'openssl ' + command.join(' '),
            stdout: stdoutbuff.join(''),
            stderr: stderrbuff.join(''),
            exitcode: code,
        }

        callback(result)
    })
}

interface GenerateX509CertificateOptions {
    rsa_bits? : number
    subject? : {[name : string] : string}
    others? : string[]
}

export interface GenerateX509CertificateResult {
    certificate : string
    privateKey : string
}

function generateX509Certificate(options? : GenerateX509CertificateOptions) : Promise<GenerateX509CertificateResult> {
    const rsa_bits = (options && options.rsa_bits) || 2048
    const subject = (options && options.subject) || {}
    const others = (options && options.others) || []

    const command : string[] = []
    command.push('req', '-x509', '-outform', 'PEM')
    command.push('-newkey', 'rsa:' + rsa_bits, '-nodes', '-sha256')
    command.push('-subj', Object.keys(subject).map(name => {
        return '/' + name + '=' + subject[name]
    }).join(''))
    // command.push('-out', 'priv.pem')
    command.push(...others)

    return new Promise((resolve, reject) => {
        runCommand(command, result => {
            if (result.exitcode != 0) {
                reject(result.stderr)
            }
            else {
                const certificate : string[] = []
                const privateKey : string[] = []
                let mode = 0

                result.stdout.split('\n').forEach(line => {
                    switch (line) {
                        case '-----BEGIN CERTIFICATE-----':
                            mode = 1
                            break
                        case '-----BEGIN PRIVATE KEY-----':
                            mode = 2
                            break
                    }

                    switch (mode) {
                        case 1:
                            certificate.push(line)
                            break

                        case 2:
                            privateKey.push(line)
                            break
                    }
                });

                resolve({
                    certificate: certificate.join('\n'),
                    privateKey: privateKey.join('\n'),
                })
            }
        })
    })
}



export default {
    generateX509Certificate,
}
