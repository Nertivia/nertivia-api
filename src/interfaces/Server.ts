import { ServerMember } from "../interfaces/ServerMember";
import { ServerRole } from "./ServerRole";

export interface Server {
    id: string
    name: string
    avatar: string
    banner?: string | null
    members: ServerMembers
    roles: ServerRoles
}

export interface ServerMembers {
    [key: string]: ServerMember
}
export interface ServerRoles {
    [key: string]: ServerRole
}