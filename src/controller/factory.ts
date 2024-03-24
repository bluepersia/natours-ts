import { Request, Response } from 'express';
import handle from 'express-async-handler';
import { Model } from 'mongoose';
import APIFeatures from '../util/APIFeatures';
import AppError from '../util/AppError';
import { IRequest } from './authController';



export const getAll = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const filter:{[key:string]:any} = {}
    
    if (req.params.userId)
        filter.user = req.params.userId;

    if (req.params.tourId)
        filter.tour = req.params.tourId;

    const query = Model.find (filter);
    new APIFeatures (req.query, query).all ();
    const docs = await query;

    res.status (200).json ({
        status: 'success',
        data: {
            docs
        }
    })
});


export const createOne = (Model:Model<any>) => handle(async (req:Request, res:Response) : Promise<void> =>
{

    if (req.params.userId)
        req.body.user = req.params.userId;

    if (req.params.tourId)
        req.body.tour = req.params.tourId;

    const doc = await Model.create (req.body);

    res.status (201).json ({
        status: 'success',
        data: {
            doc
        }
    })
});


export const getOne = (Model:Model<any>) => handle (async (req:Request, res:Response):Promise<void> =>
{
    const doc = await Model.findById (req.params.id);

    if (!doc)
        throw new AppError ('No document with that ID', 404);
    
    res.status (200).json ({
        status: 'success',
        data: {
            doc
        }
    })
});


export const updateOne = (Model:Model<any>) => handle (async (req:Request, res:Response):Promise<void> =>
{
    const doc = await Model.findByIdAndUpdate (req.params.id, req.body, {new:true, runValidators:true});

    if (!doc)
        throw new AppError ('No document with that ID', 404);

    res.status (200).json ({
        status: 'success',
        data: {
            doc
        }
    })
});

export const deleteOne = (Model:Model<any>) => handle (async (req:Request, res:Response):Promise<void> =>
{
    const doc = await Model.findByIdAndDelete (req.params.id);

    if (!doc)
        throw new AppError ('No document with that ID', 404);
    
    res.status (204).json ({
        status: 'success',
        data: null
    })
});



export const setMine = function (req:Request, res:Response, next: () => void) : void
{
    req.params.userId = (req as IRequest).user.id;
    next ();
}

export const isMine = (Model:Model<any>) => handle (async(req:Request, res:Response, next: () => void) : Promise<void> =>
{
    const doc = await Model.findById (req.params.id);

    if (!doc)
        throw new AppError ('No document with that ID', 404);

    const {user } = req as IRequest;

    if (doc.user.toString () === user.id || doc.user.id === user.id || user.role === 'admin')
        return next ();

    throw new AppError ('Resource does not belong to you', 403);
});