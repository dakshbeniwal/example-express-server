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
        this.localPassport.use('admin-login', new Strategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, this.adminLoginStrategy));
    }

    signupStrategy = async (req: Request, email: string, password: string, done: any) => {
        console.log("in signup strategy ----");
        const user = await db.users.findOne({ "where": { "email": email } });
        if (user) return done("The email you entered is already in our system", null);

        /* CREATING USER */
        const salt = bcrypt.genSaltSync(10);
        const createdUser = await db.users.create({
            ...req.body,
            email: email,
            password: bcrypt.hashSync(password, salt)
        })

        return done(null, {
            "id": createdUser.dataValues.id,
            "email": createdUser.dataValues.email,
            "firstname": createdUser.dataValues.firstname,
            "lastname": createdUser.dataValues.lastname,
            "username": createdUser.dataValues.username
        });
    }

    loginStrategy = async (req: Request, email: string, password: string, done: any) => {
        console.log("in login strategy ----");
        const user = await db.users.findOne({ "where": { email } });
        if (!user) return done("Your email/password don't match any account", null);

        const verified = bcrypt.compareSync(password, user.password);
        if (!verified) return done("Your email/password don't match any account", null);
        else return done(null, {
            "id": user.id,
            "email": user.email,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username
        });
    }

    adminLoginStrategy = async (req: Request, email: string, password: string, done: any) => {
        console.log("in admin login strategy ----");
        const user = await db.adminUsers.findOne({ "where": { email } });
        if (!user) return done("Your email/password don't match any account", null);

        const verified = bcrypt.compareSync(password, user.password);
        if (!verified) {
            await db.adminUsers.update({
                "failedAttempts": user.failedAttempts + 1
            }, { "where": { "id": user.id } });
            return done("Your email/password don't match any account", null);
        }
        else {
            await db.adminUsers.update({
                "lastSignIn": user.currentSignIn,
                "currentSignIn": new Date(),
                "lastSignInIP": user.currentSignInIP,
                "currentSignInIP": req.clientIp,
                "failedAttempts": 0
            }, { "where": { "id": user.id } });
            return done(null, {
                "id": user.id,
                "email": user.email,
                "firstname": user.firstname,
                "lastname": user.lastname
            });
        }
    }
}

export const passportInstance = new Passport();