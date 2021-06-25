import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { Request } from "express";
import { db } from '../models';

export class Passport {
    public localPassport = new passport.Passport();

    constructor() {
        this.localPassport.use('signup', new Strategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, this.signupStrategy));
        this.localPassport.use('login', new Strategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, this.loginStrategy));
    }

    signupStrategy = async (req: Request, email: string, password: string, done: any) => {
        console.log("in signup strategy ----");
        const user = await db.users.findOne({ "where": { "email": email } });
        if (user) return done("The email you entered is already in our system", null);

        /* CREATING USER */
        const salt = bcrypt.genSaltSync(10);
        const createdUser = await db.users.create({
            email: email,
            password: bcrypt.hashSync(password, salt),
            ...req.body
        })

        return done(null, createdUser.dataValues);
    }

    loginStrategy = async (req: Request, email: string, password: string, done: any) => {
        console.log("in login strategy ----");
        const user = await db.users.findOne({ "where": { email } });
        if (!user) return done("Your email/password don't match any account", null);

        const verified = bcrypt.compareSync(password, user.password);
        if (!verified) return done("Your email/password don't match any account", null);
        else return done(null, user);
    }
}

export const passportInstance = new Passport();