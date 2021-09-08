"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const _1 = require(".");
const events = __importStar(require("./socketEventConstants"));
class Socket {
    constructor(client) {
        this.client = client;
        this.io = (0, socket_io_client_1.default)("https://nertivia.net", { transports: ["websocket"] });
        this.events(this.io);
    }
    onConnect(io) {
        io.emit("authentication", { token: this.client.token });
    }
    onSuccess(io, data) {
        const { addServer } = (0, _1.serverStore)();
        const servers = data.user.servers;
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            addServer(server.server_id, {
                id: server.server_id,
                creatorId: server.creator.id,
                name: server.name,
                avatar: server.avatar,
                banner: server.banner,
            });
        }
    }
    onAuthError(io, reason) {
        throw new Error(reason);
    }
    events(io) {
        io.on(events.CONNECT, () => this.onConnect(io));
        io.on(events.SUCCESS, (data) => this.onSuccess(io, data));
        io.on(events.AUTH_ERROR, (data) => this.onAuthError(io, data));
    }
}
exports.Socket = Socket;
