import { Project } from './config';
import ts from 'typescript';
declare function compile(project: Project): void;
export declare function getNewLineCharacter(options: ts.CompilerOptions | ts.PrinterOptions): string;
declare const _default: {
    compile: typeof compile;
};
export default _default;
