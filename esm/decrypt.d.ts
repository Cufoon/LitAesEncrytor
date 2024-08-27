export interface FuncParamsDecrypt {
    file: string;
    password: string;
    outFile?: string;
    showProgress?: boolean;
    onProgress?: <T>(percent: number, allN: number) => T;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): Promise<void>;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
