interface FuncParamsDecrypt {
    file: string;
    password: string;
    outFile?: string;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): void;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
