import { ObservableMap } from "../ObservableMap";
import {Server} from '../interfaces/Server';
export class Servers extends ObservableMap<Server> {
    constructor() {
        super()
    }
}