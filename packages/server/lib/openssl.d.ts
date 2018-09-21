interface GenerateX509CertificateOptions {
    rsa_bits?: number;
    subject?: {
        [name: string]: string;
    };
    others?: string[];
}
export interface GenerateX509CertificateResult {
    certificate: string;
    privateKey: string;
}
declare function generateX509Certificate(options?: GenerateX509CertificateOptions): Promise<GenerateX509CertificateResult>;
declare const _default: {
    generateX509Certificate: typeof generateX509Certificate;
};
export default _default;
