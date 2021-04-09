import { User } from "../interfaces/User";

export function sanitizeUser(user: any): User {
    return {
        id: user.uniqueID,
        username: user.username,
        avatar: user.avatar || null,
        tag: user.tag,
    }
}