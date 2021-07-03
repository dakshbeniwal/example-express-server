import { NextFunction, Request, Response } from "express";
import * as CONSTANTS from "../config/constants.json";
import { logger } from "./logger";

const { ERROR_CONSTANTS: { VALIDATION_ERROR, BAD_REQUEST, INTERNAL_ERROR, NOT_FOUND } } = CONSTANTS;
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
        if (description) this.description = description;

        Error.captureStackTrace(this);
    }
}

class ErrorHandler {
    logError = (err: Error) => {
        console.log(err);
        if (!this.isOperationalError(err)) logger.fatal(err);
        // else logger.error(err);
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
        super(message, NOT_FOUND.name, NOT_FOUND.statusCode, NOT_FOUND.errorCode, NOT_FOUND.isOperational)
    }
}

export class InternalError extends BaseError {
    constructor(message: string = INTERNAL_ERROR.defaultMessage) {
        super(INTERNAL_ERROR.defaultMessage, INTERNAL_ERROR.name, INTERNAL_ERROR.statusCode, INTERNAL_ERROR.errorCode, INTERNAL_ERROR.isOperational, message)
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message, BAD_REQUEST.name, BAD_REQUEST.statusCode, BAD_REQUEST.errorCode, BAD_REQUEST.isOperational)
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message, VALIDATION_ERROR.name, VALIDATION_ERROR.statusCode, VALIDATION_ERROR.errorCode, VALIDATION_ERROR.isOperational)
    }
}

export const errorHandler = new ErrorHandler();