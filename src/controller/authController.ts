import { Response } from "express";
import User, { IUser } from "../models/userModel";
import handle from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from "mongoose";

function sign (id:string) : string 
{
    return jwt.sign ({id}, process.env.JWT_SECRET!, {expiresIn:process.env.JWT_EXPIRES_IN})
}

function signAndSend (user:HydratedDocument<IUser>, res:Response, status = 200) : void
{
    const token = sign (user.id);

    res.cookie ('jwt', token, {
        expires: new Date (Date.now() + (Number (process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000)),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    })

    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status (status).json ({
        status: 'success',
        token,
        data: {
            user
        }
    })
}