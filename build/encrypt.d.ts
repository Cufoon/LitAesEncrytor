export interface FuncParamsEncrypt {
    file: string;
    password: string;
    outFile?: string;
    showProgress?: boolean;
    onProgress?: (percent: number, allN: number) => any;
    compress?: boolean;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): Promise<void>;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
