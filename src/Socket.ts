import EventEmitter from 'eventemitter3';
import socket from 'socket.io-client';
import { Client } from './Client';
import socketWildcard from 'socketio-wildcard';
import { Message } from './interfaces/Message';
import { User } from './interfaces/User';
import { Server } from './interfaces/Server';
import { DMChannel } from './interfaces/DMChannel';
import { ServerChannel } from './interfaces/ServerChannel';
import { ServerMember } from './interfaces/ServerMember';

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
                    const serverMembers = data.serverMembers;
                    const memberStatusArr = data.memberStatusArr;
                    const customStatusArr = data.customStatusArr;
                    const lastSeenServerChannels = data.lastSeenServerChannels;
                    const dms = data.dms;
                    
                    for (let i = 0; i < servers.length; i++) {
                        const server = servers[i];
                        const channels = server.channels;
                        for (let i = 0; i < channels.length; i++) {
                            const channel = channels[i];
                            this.addServerChannel({...channel, lastSeen: lastSeenServerChannels[channel.channelID]});   
                        }
                        this.addServer(server)
                    }
                    for (let i = 0; i < friends.length; i++) {
                        const {recipient} = friends[i];
                        this.addUser(recipient);
                    }
                    for (let i = 0; i < serverMembers.length; i++) {
                        const serverMember = serverMembers[i];
                        this.addUser(serverMember.member);                        
                        this.addServerMember(serverMember)
                    }
                    for (let i = 0; i < dms.length; i++) {
                        const dmChannel = dms[i];
                        this.addUser(dmChannel.recipients[0]);
                        this.addDMChannel(dmChannel);
                    }
                    for (let i = 0; i < memberStatusArr.length; i++) {
                        const [id, presence] = memberStatusArr[i];
                        this.client.users.update(id, {presence: parseInt(presence)})                        
                    }
                    for (let i = 0; i < customStatusArr.length; i++) {
                        const [id, custom_status] = customStatusArr[i];
                        this.client.users.update(id, {custom_status})                        
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
            server_members: [],
            avatar: server.avatar || null,
        }
        this.client.servers.add(sanitizedServer.id, sanitizedServer);
    }
    private addDMChannel (dm: any) {
        const sanitizedDMChannel: DMChannel = {
            id: dm.channelID,
            last_messaged: dm.lastMessaged,
            recipient_ids: dm.recipients[0].uniqueID
        }
        this.client.dmChannels.add(sanitizedDMChannel.id, sanitizedDMChannel);
    }
    private addServerChannel (channel: any) {
        const sanitizedServerChannel: ServerChannel = {
            name: channel.name,
            id: channel.channelID,
            last_messaged: channel.lastMessaged,
            server_id: channel.server_id,
            last_seen: channel.lastSeen
        }
        this.client.serverChannels.add(sanitizedServerChannel.id, sanitizedServerChannel);
    }
    private addServerMember (serverMember: any) {
        const sanitizedServerMember: ServerMember = {
            server_id: serverMember.server_id,
            user_id: serverMember.member.uniqueID,
            role_ids: serverMember.roles,
            type: serverMember.type,
        }
        const map = this.client.servers.mutableMap();
        map[sanitizedServerMember.server_id].server_members[sanitizedServerMember.user_id] = sanitizedServerMember;
    }
}