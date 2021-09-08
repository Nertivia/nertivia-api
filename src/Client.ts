import { Socket } from "./Socket";

interface ClientOptions {
    token: string
}
export class Client {
    socket: Socket;
    token: string;
    constructor(options: ClientOptions) {
        this.token = options.token
        this.socket = new Socket(this);
    }

}