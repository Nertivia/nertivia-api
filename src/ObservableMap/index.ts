let Vue: any;
try {
    Vue = require("vue").default;
}
catch {}


export class ObservableMap<T> {
    state: {
        [key: string]: T
    };
    constructor() {
        this.state = Vue ? Vue.observable({}) : {}
    }
    create(key: string, value: T) {
        if (Vue) {
            Vue.set(this.state, key, value)
        } else {
            this.state[key] = value;
        }
    }
    static update(object: Record<string, any>, key: string, value: any) {
        if (Vue) {
            Vue.set(object, key, value)
        } else {
            (object as any)[key] = value
        }
    }
    get(id: string) {
        return this.state[id];
    }
    getAll() {
        return this.state;
    }

}