"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverStore = void 0;
const reactivity_1 = require("@vue/reactivity");
const state = (0, reactivity_1.reactive)({ servers: {} });
function serverStore() {
    const servers = (0, reactivity_1.computed)(() => state.servers);
    const addServer = (id, server) => {
        state.servers[id] = server;
    };
    const updateServer = (id, server) => {
        state.servers[id] = { ...state.servers[id], ...server };
    };
    const deleteAllServers = () => {
        state.servers = {};
    };
    return { state, servers, addServer, updateServer, deleteAllServers };
}
exports.serverStore = serverStore;
