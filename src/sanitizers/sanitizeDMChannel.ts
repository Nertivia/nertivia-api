import { DMChannel } from "../interfaces/DMChannel";

export function sanitizeDMChannel(dm: any): DMChannel {
    return {
        id: dm.channelID,
        last_messaged: dm.lastMessaged,
        recipient_ids: dm.recipients[0].uniqueID
    }
}