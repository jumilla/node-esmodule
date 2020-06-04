
// import * as json5 from 'json5'
import a from './hoge1'

namespace test {
	export const version = '1.0.0'
	// const bbb = json5
}

//-

var abc = 10

namespace test {
	export function a() {
		return 99
	}
}


namespace test {
	export function a_2() {
		return a() + b() * 2 //+ keyof()
	}
}
namespace test {
    export function b() {
        return 55 + abc
    }
}

namespace test {
    export function z() {
        return 246
    }
}
//-

export default test

export { test }
