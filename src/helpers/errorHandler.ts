import { NextFunction, Request, Response } from "express";
import * as CONSTANTS from "../config/constants.json";
import { logger } from "./logger";

class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean;
    public readonly description: string | undefined;

    constructor(message: string, name: string, httpCode: number, errorCode: string, isOperational: boolean, description?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        this.description = description;

        Error.captureStackTrace(this);
    }
}

class ErrorHandler {
    logError = (err: Error) => {
        console.log(err);
        if (!this.isOperationalError(err)) logger.fatal(err);
        else logger.error(err);
    }

    logErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
        this.logError(err);
        next(err);
    }

    returnError = (err: BaseError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.httpCode || 500).send({ "success": false, "error": { "code": err.errorCode, "message": err.message } });
    }

    isOperationalError = (error: Error) => {
        if (error instanceof BaseError) {
            return error.isOperational
        }
        return false;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message, CONSTANTS.NOT_FOUND.name, CONSTANTS.NOT_FOUND.statusCode, CONSTANTS.NOT_FOUND.errorCode, CONSTANTS.NOT_FOUND.isOperational)
    }
}

export class InternalError extends BaseError {
    constructor(message: string = CONSTANTS.INTERNAL_ERROR.defaultMessage) {
        super(CONSTANTS.INTERNAL_ERROR.defaultMessage, CONSTANTS.INTERNAL_ERROR.name, CONSTANTS.INTERNAL_ERROR.statusCode, CONSTANTS.INTERNAL_ERROR.errorCode, CONSTANTS.INTERNAL_ERROR.isOperational, message)
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message, CONSTANTS.BAD_REQUEST.name, CONSTANTS.BAD_REQUEST.statusCode, CONSTANTS.BAD_REQUEST.errorCode, CONSTANTS.BAD_REQUEST.isOperational)
    }
}

export const errorHandler = new ErrorHandler();