export interface EncryptParams {
    content: Buffer | string;
    password: string;
    onProgress?: <T>(percent: number, allN: number) => T;
    compress?: boolean;
}
interface EncryptFunc {
    (p: EncryptParams): Promise<Buffer>;
}
declare const encrypt: EncryptFunc;
export default encrypt;
