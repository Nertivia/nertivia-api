import { Servers } from "./maps/Servers";
import { Socket } from "./Socket";
import { Users } from "./maps/Users";

export class Client {
    socket: Socket;
    users: Users;
    servers: Servers;
    constructor() {
        this.socket = new Socket(this)
        this.users = new Users()
        this.servers = new Servers()
    }
    login(token: string) {
        this.socket.io.once("connect", () => {
            this.socket.io.emit("authentication", {token})
        })
        this.socket.io.connect()
    }
}