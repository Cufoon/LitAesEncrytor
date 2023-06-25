export interface FuncParamsDecrypt {
    file: string;
    password: string;
    outFile?: string;
    showProgress?: boolean;
    onProgress?: (percent: number, allN: number) => any;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): Promise<void>;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
