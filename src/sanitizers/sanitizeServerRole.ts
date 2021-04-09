import { ServerRole } from "../interfaces/ServerRole";

export function sanitizeServerRole(role: any): ServerRole {
    return {
        id: role.id,
        name: role.name,
        default: role.default,
        hidden: !!role.hideRole,
        order: role.order,
        permission_flags: role.permissions,
        server_id: role.server_id,
        color: role.color
    }
}