import { Project } from './config';
declare function compile(project: Project): void;
declare function transpile(project: Project): void;
declare const _default: {
    compile: typeof compile;
    transpile: typeof transpile;
};
export default _default;
