
import openssl, {GenerateX509CertificateResult as CertificateCredential} from './openssl'

function generateCertificate() : Promise<CertificateCredential> {
    return openssl.generateX509Certificate({
        subject: {
            'CN' : 'localhost',
        }
    })
}

export default {
    generateCertificate,
}

export {CertificateCredential}
