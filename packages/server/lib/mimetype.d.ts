declare const MIMETYPES: {
    [extension: string]: string;
};
declare function mimetype(extension: string): string;
export default mimetype;
export { MIMETYPES };
