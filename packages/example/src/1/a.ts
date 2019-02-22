
var abc = 10

namespace test {
    export function a() {
        return 99
    }
}


namespace test {
    export function ee() {
        return a() + b() * 2 + keyof()
    }
}

