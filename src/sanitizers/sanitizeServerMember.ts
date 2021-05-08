import { ServerMember } from "../interfaces/ServerMember";

export function sanitizeServerMember(member: any): ServerMember {
    return {
        id: member.id,
        server_id: member.server_id,
        role_ids: member.roles,
        type: member.type,
    }
}