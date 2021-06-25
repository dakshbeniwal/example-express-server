import { NextFunction, Request, Response } from "express";
import * as CONSTANTS from "../config/constants.json";

class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean;

    constructor(message: string, name: string, httpCode: number, errorCode: string, isOperational: boolean) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

class ErrorHandler {
    logError = (err: Error) => {
        console.log(err);
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
    constructor(
        message: string,
        name: string = CONSTANTS.NOT_FOUND.name,
        errorCode: string = CONSTANTS.NOT_FOUND.errorCode,
        statusCode: number = CONSTANTS.NOT_FOUND.statusCode,
        isOperational: boolean = CONSTANTS.NOT_FOUND.isOperational
    ) {
        super(message, name, statusCode, errorCode, isOperational)
    }
}

export class InternalError extends BaseError {
    constructor(
        message: string,
        name: string = CONSTANTS.INTERNAL_ERROR.name,
        errorCode: string = CONSTANTS.INTERNAL_ERROR.errorCode,
        statusCode: number = CONSTANTS.INTERNAL_ERROR.statusCode,
        isOperational: boolean = CONSTANTS.INTERNAL_ERROR.isOperational
    ) {
        super(message, name, statusCode, errorCode, isOperational)
    }
}

export class BadRequestError extends BaseError {
    constructor(
        message: string,
        name: string = CONSTANTS.BAD_REQUEST.name,
        errorCode: string = CONSTANTS.BAD_REQUEST.errorCode,
        statusCode: number = CONSTANTS.BAD_REQUEST.statusCode,
        isOperational: boolean = CONSTANTS.BAD_REQUEST.isOperational
    ) {
        super(message, name, statusCode, errorCode, isOperational)
    }
}

export const errorHandler = new ErrorHandler();