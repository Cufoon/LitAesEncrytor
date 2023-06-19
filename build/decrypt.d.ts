interface FuncParamsDecrypt {
    file: string;
    password: string;
}
interface FuncDecrypt {
    (p: FuncParamsDecrypt): void;
}
declare const decrypt: FuncDecrypt;
export default decrypt;
