import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import handle from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from "mongoose";
import AppError from "../util/AppError";

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

export const signup = handle (async (req:Request, res:Response) : Promise<void> =>
{
    const { name, email, password, passwordConfirm} = req.body;

    const user = await User.create ({name, email, password, passwordConfirm});

    signAndSend (user, res, 201);
});


export const login = handle (async(req:Request, res:Response) : Promise<void> =>
{
    const {email, password } = req.body;

    if (!email || !password)
        throw new AppError ('Please provide email and password', 400);

    const user = await User.findOne ({email}).select ('+password');

    if(!user)
        throw new AppError ('No user with that email', 404);

    if (!(await user.comparePassword (password, user.password!)))
        throw new AppError ('Incorrect password', 401);
});