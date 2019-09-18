import chalk from 'chalk';
import example_1 from 'esmodule-example';
console.log(chalk.green('hoge'), example_1.a());
// (async () => {
//     await import('esmodule-example')
// })()
