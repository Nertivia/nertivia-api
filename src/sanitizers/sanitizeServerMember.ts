import { ServerMember } from "../interfaces/ServerMember";

export function sanitizeServerMember(member: any): ServerMember {
    return {
        server_id: member.server_id,
        user_id: member.uniqueID,
        role_ids: member.roles,
        type: member.type,
    }
}