import { NextFunction, Request, Response } from "express";
import { auth } from "../controllers/authController";

export const signupApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in signup API ----");
        const response = await auth.signupController(req, res);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}

export const loginApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in login API ----");
        const response = await auth.loginController(req, res);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}

export const adminLoginApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in admin login API ----");
        const response = await auth.adminLoginController(req, res);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}

export const getLoggedInUserApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in get logged in user API ----");
        const response = await auth.getLoggedInUserController(req);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}