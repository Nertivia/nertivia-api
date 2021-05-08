import { User } from "../interfaces/User";

export function sanitizeUser(user: any): User {
    return {
        id: user.id,
        username: user.username,
        avatar: user.avatar || null,
        tag: user.tag,
    }
}