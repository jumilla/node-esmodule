
import P from './platform'



const packageInfo = JSON.parse(P.readFile(__dirname + '/../package.json'))

export default {
	version: packageInfo.version,
	program: 'esmc',
}
