export interface ServerRole {
    id: string;
    server_id: string;
    name: string;
    color?: string;
    default: boolean;
    hidden: boolean;
    permission_flags: number;
    order: number;
}