import { NextFunction, Request, Response } from "express";
import { auth } from "../controllers/authController";

export const signupApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in signup API ----", req.body);
        const response = await auth.signupController(req, res);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}

export const loginApi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("in login API ----", req.body);
        const response = await auth.loginController(req, res);
        return res.send(response);
    }
    catch (err) {
        next(err);
    }
}