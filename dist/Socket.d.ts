import { Socket as SocketIO } from 'socket.io-client';
import { Client } from ".";
export declare class Socket {
    io: SocketIO;
    client: Client;
    constructor(client: Client);
    onConnect(io: SocketIO): void;
    onSuccess(io: SocketIO, data: any): void;
    onAuthError(io: SocketIO, reason: string): void;
    events(io: SocketIO): void;
}
//# sourceMappingURL=Socket.d.ts.map