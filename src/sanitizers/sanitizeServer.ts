import { Server } from "../interfaces/Server";


// this horrible mess wont be required when i make my database cleaner someday
const conversion = {
    server_id: "id",
    name: 'name',
    avatar: 'avatar',
    banner: "banner"
}

export function sanitizeServer(server: any) {
    const newObj: Partial<Server> = {}
    for (let key in server) {
        const newKey = (conversion as any)[key]
        const value = server[key];
        if (!newKey) continue;
        (newObj as any)[newKey] = value;
    }
    return newObj
}