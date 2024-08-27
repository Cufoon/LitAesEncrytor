export interface FuncParamsEncrypt {
    content: Buffer;
    password: string;
    onProgress?: <T>(percent: number, allN: number) => T;
    compress?: boolean;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): Promise<Buffer>;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
