export interface IProcessEnv {
    NODE_ENV: 'development' | 'production';
    DB_USER: string;
    DB_PASSWORD: string;
    DATABASE: string;
    DB_HOST: string;
    DB_DIALECT: string;
    SERVER_PORT: number;
    CORS_ORIGINS: string;
    COOKIE_SECRET: string;
}