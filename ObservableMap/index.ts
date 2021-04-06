import EventEmitter from "eventemitter3";

export declare interface ObservableMap<T>{
    on(event: 'update', listener: (payload: {property: string, value: any}) => void): this;
    on(event: 'add', listener: (payload: T) => void): this;
    on(event: 'delete', listener: (id: string) => void): this;
    on(event: string, listener: Function): this;
}

export class ObservableMap<T extends object> extends EventEmitter{
    protected map: {
        [key: string]: T;
    };
    private proxyHandler: ProxyHandler<T>;
    constructor() {
        super()
        this.map = {};
        this.proxyHandler = {
            set: this.setProxyHandler.bind(this)
        }
    }
    private setProxyHandler(target: T, p: string | symbol, value: any, receiver: any) {
        if (!Reflect.set(target, p, value, receiver)) return false;
        this.emit("update", {property: p, value})
        return true;
    }
    get(id: string) {
        return this.map[id];
    }
    add(id: string, object: T) {
        this.map[id] = new Proxy(object, this.proxyHandler)
        this.emit("add", object)
    }
    update(id: string, object: Partial<T>) {
        const keys = Object.keys(object)
        for (let key of keys) {
            const value = (object as any)[key];
            (this.map[id] as any)[key] = value;
        }
    }
    delete(id: string) {
        delete this.map[id];
        this.emit("delete", id)
    }
    keys() {
        return Object.keys(this.map);
    }
    array() {
        return this.keys().map(key => this.map[key]);
    }

}