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
import { ObservableMap } from './ObservableMap';
import { ServerRole } from './interfaces/ServerRole';
import { sanitizeServer } from './sanitizers/sanitizeServer';
import { sanitizeDMChannel } from './sanitizers/sanitizeDMChannel';
import { sanitizeServerMember } from './sanitizers/sanitizeServerMember';
import { sanitizeServerChannel } from './sanitizers/sanitizeServerChannel';
import { sanitizeServerRole } from './sanitizers/sanitizeServerRole';
import { sanitizeUser } from './sanitizers/sanitizeUser';

export interface SocketOptions {
    url: string
}
const defaultOptions = {
    url: "https://nertivia.net"
}

export declare interface Socket {
    on(event: 'MESSAGE:SEND', listener: (message: Message) => void): this;
    on(event: 'CLIENT:READY', listener: () => void): this;
    on(event: 'USER:STATUS_CHANGE', listener: (user: User) => void): this;
    on(event: 'USER:CUSTOM_STATUS_CHANGE', listener: (user: User) => void): this;
    on(event: 'SERVER:UPDATE', listener: (server: Server) => void): this;
    on(event: string, listener: Function): this;
}

export class Socket extends EventEmitter {
    options: SocketOptions;
    io: SocketIOClient.Socket;
    client: Client;
    constructor(client: Client, opt?: SocketOptions) {
        super();
        this.client = client
        this.options = { ...defaultOptions, ...opt };
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
                case "success": {
                    const friends = data.user.friends;
                    const servers = data.user.servers;
                    const serverMembers = data.serverMembers;
                    const serverRoles = data.serverRoles;
                    const memberStatusArr = data.memberStatusArr;
                    const customStatusArr = data.customStatusArr;
                    const lastSeenServerChannels = data.lastSeenServerChannels;
                    const dms = data.dms;

                    for (let i = 0; i < servers.length; i++) {
                        const server = servers[i];
                        const channels = server.channels;
                        for (let i = 0; i < channels.length; i++) {
                            const channel = channels[i];
                            this.addServerChannel({ ...channel, lastSeen: lastSeenServerChannels[channel.channelID] });
                        }
                        this.addServer(server)
                    }
                    for (let i = 0; i < serverMembers.length; i++) {
                        const serverMember = serverMembers[i];
                        this.addUser(serverMember.member);
                        this.addServerMember(serverMember)
                    }

                    for (let i = 0; i < serverRoles.length; i++) {
                        const serverRole = serverRoles[i];
                        this.addServerRole(serverRole)
                        
                    }
                    for (let i = 0; i < friends.length; i++) {
                        const { recipient } = friends[i];
                        this.addUser(recipient);
                    }
                    for (let i = 0; i < dms.length; i++) {
                        const dmChannel = dms[i];
                        this.addUser(dmChannel.recipients[0]);
                        this.addDMChannel(dmChannel);
                    }
                    for (let i = 0; i < memberStatusArr.length; i++) {
                        const [id, presence] = memberStatusArr[i];
                        const user = this.client.users.get(id);
                        ObservableMap.update(user, "presence", presence)
                    }
                    for (let i = 0; i < customStatusArr.length; i++) {
                        const [id, custom_status] = customStatusArr[i];
                        const user = this.client.users.get(id);
                        ObservableMap.update(user, "custom_status", custom_status)
                    }
                    this.emit("CLIENT:READY")
                    break;
                }
                case "userStatusChange": {
                    const { user_id, status, custom_status, connected } = data;
                    const user = this.client.users.get(user_id)
                    if (!status) {
                        ObservableMap.delete(user, "presence")
                        ObservableMap.delete(user, "custom_status")
                    } else {
                        ObservableMap.update(user, "presence", status)
                        if (connected && custom_status) {
                            ObservableMap.update(user, "custom_status", custom_status)
                        } else {
                            ObservableMap.delete(user, "custom_status");
                        }
                    }
                    this.emit("USER:STATUS_CHANGE", user)
                    break;
                }
                case "member:custom_status_change": {
                    const { user_id, custom_status} = data;
                    const user = this.client.users.get(user_id)
                    if (!user.presence) return;
                    if (!custom_status) {
                        ObservableMap.delete(user, "custom_status");
                    } else {
                        ObservableMap.update(user, "custom_status", custom_status);
                    }
                    this.emit("USER:CUSTOM_STATUS_CHANGE", user)
                    break;
                }
                case "server:update_server": {
                    const server = this.client.servers.get(data.server_id);
                    const updatedServer = {...server, ...sanitizeServer(data)};
                    this.client.servers.state[server.id] = updatedServer;
                    this.emit("SERVER:UPDATE", updatedServer)
                    break
                }
                default:
                    console.warn("Unhandled Event:", { type, data })
                    break;
            }
        })
    }
    private addUser(user: any) {
        const sanitizedUser = sanitizeUser(user);
        this.client.users.create(sanitizedUser.id, sanitizedUser);
    }
    private addServer(server: any) {
        const sanitizedServer: Server = sanitizeServer(server) as any;
        sanitizedServer.members = {}
        sanitizedServer.roles = {}
        this.client.servers.create(sanitizedServer.id, sanitizedServer);
    }
    private addServerRole(role: any) {
        const sanitizedServerRole = sanitizeServerRole(role);
        const server = this.client.servers.get(sanitizedServerRole.server_id);
        ObservableMap.update(server.roles, sanitizedServerRole.id, sanitizedServerRole);
    }
    private addServerChannel(channel: any) {
        const sanitizedServerChannel = sanitizeServerChannel(channel);
        this.client.serverChannels.create(sanitizedServerChannel.id, sanitizedServerChannel);
    }
    private addServerMember(serverMember: any) {
        const id = serverMember.member.id
        const member = sanitizeServerMember({...serverMember, id});
        ObservableMap.update(
            this.client.servers.state[member.server_id].members,
            member.id,
            member
        )
    }
    private addDMChannel(dm: any) {
        const sanitizedDMChannel= sanitizeDMChannel(dm);
        this.client.dmChannels.create(sanitizedDMChannel.id, sanitizedDMChannel);
    }

}