
import meta from './meta'
import mimetypes from './mimetype'
import * as http from 'http2'
import * as fs from 'fs'
import * as filepath from 'path'
import chalk from 'chalk'

const document_root_path = process.cwd()

console.log(chalk.green('ES Module server'))
console.log(chalk.yellow('Version: ') + meta.version)
console.log(chalk.yellow('Document Root: ') + document_root_path)



import cert, {CertificateCredential} from './cert'
import { fstat } from 'fs';

cert.generateCertificate()
    .then(credentials => {
        startServer(credentials)
    })
    .catch(error => {
        console.error(error)
    })



function startServer(credentials : CertificateCredential) {
    const options = {
        cert : credentials.certificate,
        key : credentials.privateKey,
    }

    http.createSecureServer(options)
        .on('request', (request, response) => {
            console.info('Request: ', request.url)

            let url = request.url
            if (url == '/') {
                url += 'index.html'
            }

            let path = document_root_path + url
            if (!fs.existsSync(path)) {
                response.stream.respond({
                    [http.constants.HTTP2_HEADER_STATUS]: 404,
                    [http.constants.HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
                })
                response.stream.end('Not found.')
            }
            else {
                const mimetype = mimetypes(filepath.extname(path))

                console.debug('File', path)
                console.debug('MimeType', mimetype)

                response.stream.respondWithFile(path, {
                    [http.constants.HTTP2_HEADER_STATUS]: 200,
                    [http.constants.HTTP2_HEADER_CONTENT_TYPE]: mimetype,
                }, {onError: error => console.error(error)})
            }
        })
        .on('sessionError', error => {
            console.error('Session Error', error)
        })
        .listen(8000)

    {
        http.createServer((request, response : http.Http2ServerResponse) => {
            console.log(98)
            response.writeHead(301, {Location: 'https://localhost:8000'})
            response.end('')
        }).listen(8001)
    }

    console.log('Server launched.')
}
