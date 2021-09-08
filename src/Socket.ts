import IO, {Socket as SocketIO} from 'socket.io-client'
import { Client, serverStore } from ".";
import * as events from './socketEventConstants'
export class Socket {
    io: SocketIO;
    client: Client;
    constructor(client: Client) {
        this.client = client;
        this.io = IO("https://nertivia.net", {transports: ["websocket"]})
        this.events(this.io)
    }
    onConnect(io: SocketIO) {
        io.emit("authentication", {token: this.client.token})
    }
    onSuccess(io: SocketIO, data: any) {
        const {addServer} = serverStore();
        const servers = data.user.servers;
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            addServer(server.server_id, {
                id: server.server_id,
                creatorId: server.creator.id,
                name: server.name,
                avatar: server.avatar,
                banner: server.banner,
            });
            
        }
        console.log(servers)
        // setTimeout(() => {
        //     const {state, deleteAllServers} = serverStore();
        //     deleteAllServers()
        //     console.log("done")
        // }, 1000);
    }
    onAuthError(io: SocketIO, reason: string) {
        throw new Error(reason);
    }
    events(io: SocketIO) {
        io.on(events.CONNECT, () => this.onConnect(io))
        io.on(events.SUCCESS, (data: any) => this.onSuccess(io, data))
        io.on(events.AUTH_ERROR, (data: any) => this.onAuthError(io, data))
    }
}