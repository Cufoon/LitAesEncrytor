interface FuncParamsEncrypt {
    file: string;
    password: string;
}
interface FuncEncrypt {
    (p: FuncParamsEncrypt): void;
}
declare const encrypt: FuncEncrypt;
export default encrypt;
