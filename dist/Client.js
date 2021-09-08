"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Socket_1 = require("./Socket");
class Client {
    constructor(options) {
        this.token = options.token;
        this.socket = new Socket_1.Socket(this);
    }
}
exports.Client = Client;
