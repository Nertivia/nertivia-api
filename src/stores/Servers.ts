import {reactive, computed} from '@vue/reactivity'

interface Server {
    id: string
    creatorId: string
    name: string,
    avatar: string | null,
    banner: string | null,
}

const state: {servers: {[key: string]: Server}} = reactive({servers: {}})

export function serverStore() {
    const servers = computed(() => state.servers)

    const addServer = (id: string, server: Server) => {
        state.servers[id] = server;
    }
    const updateServer = (id: string, server: Partial<Server>) => {
        state.servers[id] = {...state.servers[id], ...server};
    }
    const deleteAllServers = () => {
        state.servers = {}
    }

    return {state, servers, addServer, updateServer, deleteAllServers}
}