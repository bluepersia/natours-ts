import { Request, Response } from 'express';
import handle from 'express-async-handler';
import { Model } from 'mongoose';
import APIFeatures from '../util/APIFeatures';
import AppError from '../util/AppError';



export const getAll = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const query = Model.find ();
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