import test from 'esmodule-example';
//import test2 from 'esmodule-example/lib/example-1'
//import test3 from 'esmodule-example/lib/example-2'
console.log(test.a());
import('esmodule-example/lib/example-1.js')
    .then(example => {
    console.log(example.default);
});
