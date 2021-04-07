import { ObservableMap } from "../ObservableMap";
import { ServerChannel } from "../interfaces/ServerChannel";
export class ServerChannels extends ObservableMap<ServerChannel> {
    constructor() {
        super()
    }
}