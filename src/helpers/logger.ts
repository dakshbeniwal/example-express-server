import winston from "winston";
import "winston-daily-rotate-file";
import config from "../config/config";

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

const formatter = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.splat()
);

class Logger {
    private logger: winston.Logger;

    constructor() {
        const fileTransport = new winston.transports.DailyRotateFile({
            level: 'info',
            filename: `logs/server_${config.NODE_ENV}_%DATE%.log`,
            handleExceptions: true,
            json: true,
            maxSize: 10485760, // 10MB
            maxFiles: 30,
            createSymlink: true,
            symlinkName: `server_${config.NODE_ENV}.log`,
            auditFile: "winston_audit.json"
        });
        const consoleTransport = new winston.transports.Console({
            level: 'debug',
            handleExceptions: true
        });

        this.logger = winston.createLogger({
            format: formatter,
            levels: customLevels.levels,
            transports: [fileTransport, consoleTransport]
        });
        winston.addColors(customLevels.colors);
    }

    trace(msg: any, meta?: any) {
        this.logger.log('trace', msg, meta);
    }

    debug(msg: any, meta?: any) {
        this.logger.debug(msg, meta);
    }

    info(msg: any, meta?: any) {
        this.logger.info(msg, meta);
    }

    warn(msg: any, meta?: any) {
        this.logger.warn(msg, meta);
    }

    error(msg: any, meta?: any) {
        this.logger.error(msg, meta);
    }

    fatal(msg: any, meta?: any) {
        this.logger.log('fatal', msg, meta);
    }
}

export const logger = new Logger();