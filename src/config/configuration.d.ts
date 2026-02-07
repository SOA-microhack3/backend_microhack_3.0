declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    admin: {
        email: string;
        password: string;
        fullName: string;
        seed: boolean;
    };
    ports: {
        seed: boolean;
    };
    terminals: {
        seed: boolean;
    };
    seedDemo: boolean;
};
export default _default;
