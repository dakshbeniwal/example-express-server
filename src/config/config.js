// import { IProcessEnv } from "../interfaces/environmentInterface";
require('dotenv-flow').config({ "node_env": process.env.NODE_ENV });

export const NODE_ENV = process.env.NODE_ENV || "development";

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv extends IProcessEnv { }
//   }
// }

export default {
  NODE_ENV: process.env.NODE_ENV,

  // DB config
  [NODE_ENV]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: { decimalNumbers: true },
    define: { freezeTableName: true },
    query: { raw: true }
  },

  // Server port
  SERVER_PORT: Number(process.env.PORT),

  // Allowed cors origins
  CORS_ORIGINS: JSON.parse(process.env.CORS_ORIGINS),

  // Cookie secret
  COOKIE_SECRET: process.env.COOKIE_SECRET,

  // Session
  SESSION_NAME: process.env.SESSION_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_AGE: Number(process.env.SESSION_AGE),
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
}