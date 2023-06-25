interface FuncParamsEncrypt {
    file: string;
    password: string;
    outFile?: string;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): void;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
