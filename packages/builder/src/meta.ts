
import fs from 'fs'

const packageInfo = JSON.parse(fs.readFileSync(__dirname + '/../package.json', {encoding: 'UTF-8'}))

export default {
    version: packageInfo.version,
    program: 'esmc',
}
