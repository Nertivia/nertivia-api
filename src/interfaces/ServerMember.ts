export interface ServerMember {
    server_id: string
    id: string
    role_ids?: string[]
    type: ServerMemberType
}
export enum ServerMemberType {
    MEMBER="MEMBER",
    OWNER="OWNER"
}