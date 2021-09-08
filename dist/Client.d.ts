import { Socket } from "./Socket";
interface ClientOptions {
    token: string;
}
export declare class Client {
    socket: Socket;
    token: string;
    constructor(options: ClientOptions);
}
export {};
//# sourceMappingURL=Client.d.ts.map