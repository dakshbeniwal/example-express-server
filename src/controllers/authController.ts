import { Request, Response } from "express";
import { BadRequestError, InternalError } from "../helpers/errorHandler";
import { Passport } from "../helpers/passport";

class Auth {
    signupController = async (req: Request, res: Response) => {
        console.log("in signup controller ----");
        const signupResponse: { success: boolean, error?: string, data?: any } = await new Promise((resolve) => new Passport().localPassport.authenticate('signup', (error, user) => {
            if (error) resolve({ "success": false, "error": error });
            else resolve({ "success": true, "data": user });
        })(req, res))

        console.log("signupResponse", signupResponse);
        if (!signupResponse.success) throw new BadRequestError(String(signupResponse.error));

        const loginResponse: any = await this.login(req, signupResponse.data);
        if (!loginResponse.success) throw new InternalError(loginResponse.error);
        else return loginResponse;
    }

    loginController = async (req: Request, res: Response) => {
        console.log("in login controller ----");
        const loginStrategyResponse: { success: boolean, error?: string, data?: any } = await new Promise((resolve) => new Passport().localPassport.authenticate('login', (error, user) => {
            if (error) resolve({ "success": false, "error": error });
            else resolve({ "success": true, "data": user });
        })(req, res))

        console.log("loginStrategyResponse", loginStrategyResponse);
        if (!loginStrategyResponse.success) throw new BadRequestError(String(loginStrategyResponse.error));

        const loginResponse: any = await this.login(req, loginStrategyResponse.data);
        if (!loginResponse.success) throw new InternalError(loginResponse.error);
        else return loginResponse;
    }

    login = async (req: Request, user: any) => {
        return await new Promise((resolve) => req.login(user, async (err: Error) => {
            if (err) {
                console.log("Error in login ", err);
                return resolve({ "success": false, "err": err })
            }
            return resolve({ "success": true, "data": user })
        }))
    }
}

export const auth = new Auth();