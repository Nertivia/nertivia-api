import { Servers } from "./maps/Servers";
import { Socket } from "./Socket";
import { Users } from "./maps/Users";
import { DMChannels } from "./maps/DMChannels";
import { ServerChannels } from "./maps/ServerChannels";

export class Client {
    socket: Socket;
    users: Users;
    servers: Servers;
    dmChannels: DMChannels;
    serverChannels: ServerChannels;
    constructor() {
        this.socket = new Socket(this)
        this.dmChannels = new DMChannels()
        this.users = new Users()
        this.servers = new Servers()
        this.serverChannels = new ServerChannels()
    }
    login(token: string) {
        this.socket.io.once("connect", () => {
            this.socket.io.emit("authentication", {token})
        })
        this.socket.io.connect()
    }
}