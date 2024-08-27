export interface DecryptParams {
    content: Buffer | string;
    password: string;
    onProgress?: <T>(percent: number, allN: number) => T;
}
interface DecryptFunc {
    (p: DecryptParams): Promise<Buffer>;
}
declare const decrypt: DecryptFunc;
export default decrypt;
