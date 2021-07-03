import { NextFunction, Request, Response } from "express";
import { BadRequestError, InternalError, UnauthenticatedError, ValidationError } from "../helpers/errorHandler";
import { Passport } from "../helpers/passport";
import { ILoggedInAdminUser, ILoggedInUser, ILoginResponse } from "../interfaces/authInterface";
import { validateLoginData, validateSignupData } from "../validations/authValidations";

class Auth {
    signupController = async (req: Request, res: Response) => {
        console.log("in signup controller ----");
        const joiValidation = validateSignupData(req.body);
        if (joiValidation.error) throw new ValidationError(joiValidation.error.message);

        const signupResponse: { success: boolean, error?: string, data?: ILoggedInUser } = await new Promise((resolve) => new Passport().localPassport.authenticate('signup', (error, user) => {
            if (error) resolve({ "success": false, "error": error });
            else resolve({ "success": true, "data": user });
        })(req, res))

        console.log("signupResponse", signupResponse);
        if (!signupResponse.success || !signupResponse.data) throw new BadRequestError(String(signupResponse.error));

        const loginResponse: ILoginResponse = await this.login(req, signupResponse.data);
        if (!loginResponse.success) throw new InternalError(loginResponse.error);
        else return loginResponse;
    }

    loginController = async (req: Request, res: Response) => {
        console.log("in login controller ----");
        const joiValidation = validateLoginData(req.body);
        if (joiValidation.error) throw new ValidationError(joiValidation.error.message);

        const loginStrategyResponse: { success: boolean, error?: string, data?: ILoggedInUser } = await new Promise((resolve) => new Passport().localPassport.authenticate('login', (error, user) => {
            if (error) resolve({ "success": false, "error": error });
            else resolve({ "success": true, "data": user });
        })(req, res))

        console.log("loginStrategyResponse", loginStrategyResponse);
        if (!loginStrategyResponse.success || !loginStrategyResponse.data) throw new BadRequestError(String(loginStrategyResponse.error));

        const loginResponse: ILoginResponse = await this.login(req, loginStrategyResponse.data);
        if (!loginResponse.success) throw new InternalError(loginResponse.error);
        else return loginResponse;
    }

    adminLoginController = async (req: Request, res: Response) => {
        console.log("in admin login controller ----");
        const joiValidation = validateLoginData(req.body);
        if (joiValidation.error) throw new ValidationError(joiValidation.error.message);

        const adminLoginStrategyResponse: { success: boolean, error?: string, data?: ILoggedInAdminUser } = await new Promise((resolve) => new Passport().localPassport.authenticate('admin-login', (error, user) => {
            if (error) resolve({ "success": false, "error": error });
            else resolve({ "success": true, "data": user });
        })(req, res))

        console.log("adminLoginStrategyResponse", adminLoginStrategyResponse);
        if (!adminLoginStrategyResponse.success || !adminLoginStrategyResponse.data) throw new BadRequestError(String(adminLoginStrategyResponse.error));

        const loginResponse: ILoginResponse = await this.login(req, adminLoginStrategyResponse.data);
        if (!loginResponse.success) throw new InternalError(loginResponse.error);
        else return loginResponse;
    }

    login = async (req: Request, user: ILoggedInAdminUser | ILoggedInUser): Promise<ILoginResponse> => {
        return await new Promise((resolve) => req.login(user, async (err: Error) => {
            if (err) {
                console.log("Error in login ", err);
                return resolve({ "success": false, "error": err.message })
            }
            return resolve({ "success": true, "data": user })
        }))
    }

    getLoggedInUserController = async (req: Request) => {
        const { user } = req;
        return { "success": true, "data": user ? user : {} };
    }

    authorizeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.user) return next();
            else throw new UnauthenticatedError();
        }
        catch (err) {
            return next(err);
        }
    }
}

export const auth = new Auth();