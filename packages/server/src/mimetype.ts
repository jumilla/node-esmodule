
const MIMETYPES : {[extension : string] : string} = {
    '.txt' : 'text/plain',
    '.html' : 'text/html; charset=utf-8',
    '.css' : 'text/css',
    '.js' : 'application/javascript',
    '.mjs' : 'application/javascript',
    '.json' : 'application/json',
}

const DEFAULT_MIMETYPE = 'application/octet-stream'

function mimetype(extension : string) : string {
    return MIMETYPES[extension] || DEFAULT_MIMETYPE
}

export default mimetype

export {MIMETYPES}
