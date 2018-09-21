import { GenerateX509CertificateResult as CertificateCredential } from './openssl';
declare function generateCertificate(): Promise<CertificateCredential>;
declare const _default: {
    generateCertificate: typeof generateCertificate;
};
export default _default;
export { CertificateCredential };
