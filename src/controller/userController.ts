import { Request, Response } from "express";
import User from "../models/userModel";
import handle from 'express-async-handler';
import { IRequest } from "./authController";
import factory = require ('./factory');
import AppError from "../util/AppError";
import multer = require("multer");
import sharp from 'sharp';

export const getAllUsers = factory.getAll (User);
export const createUser =  () => { throw new AppError ('This route is not defined. Use /sign-up instead', 400)}
export const getUser = factory.getOne (User);
export const updateUser = factory.updateOne (User);
export const deleteUser = factory.deleteOne (User);


export const updateMe = handle (async(req:Request, res:Response) : Promise<void> =>
{
    const body:{[key:string]:any} = {};

    ['name', 'email', 'photo'].forEach (el =>
        {
            if (req.body[el])
                body[el] = req.body[el];
        }); 

    const user = await User.findByIdAndUpdate ((req as IRequest).user.id, body, {new:true, runValidators:true});

    res.status (200).json ({
        status: 'success',
        data: {
            user
        }
    })
    
});


export const deleteMe = handle (async (req:Request, res:Response): Promise<void> =>
{
    await User.findByIdAndUpdate ((req as IRequest).user.id, {active:false});

    res.status (204).json ({
        status: 'success',
        data: null
    })
});




export const me = function (req:Request, res:Response) : void
{
    const { user } = req as IRequest;

    res.status (200).json ({
        status: 'success',
        data: {
            user
        }
    })
}


const upload = multer ({
    storage: multer.memoryStorage (),
    fileFilter: factory.imageFilter
});

export const uploadPhoto = upload.single ('photo');


export const processPhoto = handle (async (req:Request, res:Response, next:() => void) : Promise<void> =>
{
    if (!req.file)
        return next ();

    req.body.photo = `$user-${(req as IRequest).user.id}-${Date.now()}.jpeg`;

    await sharp (req.file.buffer)
    .resize (500, 500)
    .toFormat ('jpeg')
    .jpeg ({quality: 100})
    .toFile (`public/img/users/${req.body.photo}`)

    next ();
});