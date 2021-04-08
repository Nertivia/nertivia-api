import { ObservableMap } from "../ObservableMap";
import {User, Presence} from '../interfaces/User';
export class Users extends ObservableMap<User> {
    constructor() {
        super()
    }
}