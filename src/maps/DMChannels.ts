import { ObservableMap } from "../ObservableMap";
import { DMChannel } from "../interfaces/DMChannel";
export class DMChannels extends ObservableMap<DMChannel> {
    constructor() {
        super()
    }
}