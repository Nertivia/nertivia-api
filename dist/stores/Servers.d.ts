interface Server {
    id: string;
    creatorId: string;
    name: string;
    avatar: string | null;
    banner: string | null;
}
export declare function serverStore(): {
    state: {
        servers: {
            [key: string]: Server;
        };
    };
    servers: import("@vue/reactivity").ComputedRef<{
        [key: string]: Server;
    }>;
    addServer: (id: string, server: Server) => void;
    updateServer: (id: string, server: Partial<Server>) => void;
    deleteAllServers: () => void;
};
export {};
//# sourceMappingURL=Servers.d.ts.map