import { ObservableMap } from "../ObservableMap";
import {User} from '../interfaces/User';
export class Users extends ObservableMap<User> {
    constructor() {
        super()
    }
}