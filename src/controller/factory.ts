import { Request, Response } from 'express';
import handle from 'express-async-handler';
import { Model } from 'mongoose';



export const getAll = (Model:Model<any>) => handle (async (req:Request, res:Response) : Promise<void> =>
{
    const docs = await Model.find ();

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

    res.status (204).json ({
        status: 'success',
        data: null
    })
});