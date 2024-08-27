export interface FuncParamsDecrypt {
    content: Buffer;
    password: string;
    onProgress?: <T>(percent: number, allN: number) => T;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): Promise<Buffer>;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
