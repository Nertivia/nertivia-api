import { ServerChannel } from "../interfaces/ServerChannel";

export function sanitizeServerChannel(channel: any): ServerChannel {
    return {
        name: channel.name,
        id: channel.channelID,
        last_messaged: channel.lastMessaged,
        server_id: channel.server_id,
        last_seen: channel.lastSeen
    }
}