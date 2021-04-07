import { ServerMember } from "../interfaces/ServerMember";

export interface Server {
    id: string
    name: string
    avatar: string
    server_members: ServerMember[]
}