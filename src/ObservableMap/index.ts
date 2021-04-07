import EventEmitter from "eventemitter3";
import { isObjectOrArray } from "./utils";

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
    mutableMap() {
        return this.map;
    }
    add(id: string, object: T) {
        this.map[id] = new Proxy(object, this.proxyHandler)
        this.emit("add", object)
    }
    update(object: any, key: string, value: any) {
        if (isObjectOrArray(value)) {
            value = new Proxy(value, this.proxyHandler)
        }
        object[key] = value;
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