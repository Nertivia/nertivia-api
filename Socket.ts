import EventEmitter from 'eventemitter3';
import socket from 'socket.io-client';
import { Client } from './Client';
import socketWildcard from 'socketio-wildcard';
import { Message } from './interfaces/Message';
import { User } from './interfaces/User';
import { Server } from './interfaces/Server';

export interface SocketOptions {
    url: string
}
const defaultOptions = {
    url: "https://nertivia.net"
}

export declare interface Socket {
    on(event: 'MESSAGE:SEND', listener: (message: Message) => void): this;
    on(event: 'CLIENT:READY', listener: () => void): this;
    on(event: string, listener: Function): this;
}

export class Socket extends EventEmitter {
    options: SocketOptions;
    io: SocketIOClient.Socket;    
    client: Client;
    constructor(client: Client, opt?: SocketOptions) {
        super();
        this.client = client
        this.options = {...defaultOptions, ...opt};
        this.io = socket(this.options.url, {
            transports: ["websocket"],
            autoConnect: false,

        })
        socketWildcard(socket.Manager)(this.io);
        this.io.on("*", (event: any) => {
            const type: string = event.data[0];
            const data = event.data[1];
            switch (type) {
                case "receiveMessage": {
                    const message: Message = {
                        content: data.message.message,
                        id: data.message.messageID
                        
                    }
                    this.emit("MESSAGE:SEND", message)
                    break;
                }
                case "success":{
                    const friends = data.user.friends;
                    const servers = data.user.servers;
                    
                    for (let i = 0; i < servers.length; i++) {
                        const server = servers[i];
                        const channels = server.channels;
                        this.addServer(server)
                        
                    }

                    for (let i = 0; i < friends.length; i++) {
                        const {recipient} = friends[i];
                        this.addUser(recipient);
                    }
                    this.emit("CLIENT:READY")
                    break;
                }
                default:
                    break;
            }
        })
    }
    private addUser (user: any) {
        const sanitizedUser: User = {
            id: user.uniqueID,
            username: user.username,
            avatar: user.avatar || null,
            tag: user.tag,
        }
        this.client.users.add(sanitizedUser.id, sanitizedUser);
    }
    private addServer (server: any) {
        const sanitizedServer: Server = {
            id: server.server_id,
            name: server.name,
            avatar: server.avatar || null,
        }
        this.client.servers.add(sanitizedServer.id, sanitizedServer);
    }
}