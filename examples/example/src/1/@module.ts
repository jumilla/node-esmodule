
// import * as json5 from 'json5'

namespace test {
    export const version = '1.0.0'
    // const bbb = json5
}

/// <source path="src/1/a.ts">

var abc = 10

namespace test {
    export function a() {
        return 99
    }
}


namespace test {
    export function ee() {
        return a() + b() * 2 //+ keyof()
    }
}


/// </source>

/// <source path="src/1/b.ts">

namespace test {
    export function b() {
        return 55 + abc
    }
}

/// </source>

/// <source path="src/1/z.ts">

namespace test {
    export function z() {
        return 246
    }
}

/// </source>


export default test
export {test}

