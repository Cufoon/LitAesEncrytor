/// <reference types="node" resolution-mode="require"/>
export interface FuncParamsDecrypt {
    content: Buffer;
    password: string;
    onProgress?: (percent: number, allN: number) => any;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): Promise<Buffer>;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
