export interface User {
    username: string
    id: string
    avatar: string | null,
    tag: string
    presence?: Presence;
    custom_status?: string
}

export enum Presence {
    OFFLINE = 0,
    ONLINE = 1,
    AWAY = 2,
    BUSY = 3,
    LOOKING_TO_PLAY = 4,
}