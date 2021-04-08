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
                    const { uniqueID, status, custom_status, connected } = data;
                    const user = this.client.users.get(uniqueID)
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
                    const { uniqueID, custom_status} = data;
                    const user = this.client.users.get(uniqueID)
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
                    const updatedServer = {...server, ...data};
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
        const sanitizedUser: User = {
            id: user.uniqueID,
            username: user.username,
            avatar: user.avatar || null,
            tag: user.tag,
        }
        this.client.users.create(sanitizedUser.id, sanitizedUser);
    }
    private addServer(server: any) {
        const sanitizedServer: Server = {
            id: server.server_id,
            name: server.name,
            members: {},
            roles: {},
            avatar: server.avatar || null,
            banner: server.banner || null,
        }
        this.client.servers.create(sanitizedServer.id, sanitizedServer);
    }
    private addServerRole(role: any) {
        const sanitizedServerRole: ServerRole = {
            id: role.id,
            name: role.name,
            default: role.default,
            hidden: !!role.hideRole,
            order: role.order,
            permission_flags: role.permissions,
            server_id: role.server_id,
            color: role.color
        }
        const server = this.client.servers.get(sanitizedServerRole.server_id);
        ObservableMap.update(server.roles, sanitizedServerRole.id, sanitizedServerRole);
    }
    private addServerChannel(channel: any) {
        const sanitizedServerChannel: ServerChannel = {
            name: channel.name,
            id: channel.channelID,
            last_messaged: channel.lastMessaged,
            server_id: channel.server_id,
            last_seen: channel.lastSeen
        }
        this.client.serverChannels.create(sanitizedServerChannel.id, sanitizedServerChannel);
    }
    private addServerMember(serverMember: any) {
        const member: ServerMember = {
            server_id: serverMember.server_id,
            user_id: serverMember.member.uniqueID,
            role_ids: serverMember.roles,
            type: serverMember.type,
        }
        ObservableMap.update(
            this.client.servers.state[member.server_id].members,
            member.user_id,
            member
        )
    }
    private addDMChannel(dm: any) {
        const sanitizedDMChannel: DMChannel = {
            id: dm.channelID,
            last_messaged: dm.lastMessaged,
            recipient_ids: dm.recipients[0].uniqueID
        }
        this.client.dmChannels.create(sanitizedDMChannel.id, sanitizedDMChannel);
    }

}