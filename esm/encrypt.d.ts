export interface FuncParamsEncrypt {
    file: string;
    password: string;
    outFile?: string;
    showProgress?: boolean;
    onProgress?: <T>(percent: number, allN: number) => T;
    compress?: boolean;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): Promise<void>;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
