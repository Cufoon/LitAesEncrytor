/// <reference types="node" resolution-mode="require"/>
export interface FuncParamsEncrypt {
    content: Buffer;
    password: string;
    onProgress?: (percent: number, allN: number) => any;
    compress?: boolean;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): Promise<Buffer>;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
