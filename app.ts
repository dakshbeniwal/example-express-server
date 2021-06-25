import cors from "cors";
import express from "express";
import routes from "./src/routes";
import requestIp from "request-ip";
import cookieParser from "cookie-parser";
import config from "./src/config/config";
import { errorHandler, NotFoundError } from "./src/helpers/errorHandler";
import { Passport } from "./src/helpers/passport";
import session from 'express-session';
import connect_session_sequelize from "connect-session-sequelize";
import { db, dbInstance } from "./src/models/index";

class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    private async init() {
        await dbInstance.initializeDatabase();
        this.initializeMiddlewares();
        this.initializePassport();
        this.initializeRoutes(routes);
        this.initializeErrorhandler();
    }

    private initializePassport() {
        const SequelizeStore = connect_session_sequelize(session.Store);
        const sessionStore = new SequelizeStore({
            db: db.sequelize,
            tableName: config.SESSION_TABLE_NAME
        });
        const passport = new Passport().localPassport;

        passport.serializeUser((user: any, done: any) => {
            done(null, user.id);
        });
        passport.deserializeUser(async (id, done) => {
            let user = await db.users.findByPk(id);
            if (user) {
                done(null, user);
            }
            else
                done(user.errors, null);
        });

        this.app.use("/api", session({
            name: config.SESSION_NAME,
            secret: String(config.SESSION_SECRET),
            store: sessionStore,
            rolling: true,
            resave: true,
            saveUninitialized: false,
            cookie: { maxAge: config.SESSION_AGE } // In MilliSeconds
        }));

        sessionStore.sync();

        this.app.use("/api", passport.initialize());
        this.app.use("/api", passport.session());
    }

    private initializeMiddlewares() {
        this.app.use(requestIp.mw());
        this.app.use(cookieParser(config.COOKIE_SECRET));
        this.app.use(cors({
            origin: config.CORS_ORIGINS,
            credentials: true
        }));
        this.app.use(express.json({ limit: "2mb" }));
    }

    private initializeErrorhandler() {
        this.app.use("*", (req, res, next) => {
            next(new NotFoundError("Your specified url is not found."));
        })
        this.app.use(errorHandler.logErrorMiddleware);
        this.app.use(errorHandler.returnError);

        process.on('unhandledRejection', error => {
            throw error;
        });

        process.on('uncaughtException', error => {
            errorHandler.logError(error);

            if (!errorHandler.isOperationalError(error)) {
                process.exit(1);
            }
        });
    }

    private initializeRoutes(routes: any) {
        this.app.use('/api', routes);
    }

    public async listen() {
        await this.init();
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;