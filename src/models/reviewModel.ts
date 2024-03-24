import {HydratedDocument, Query, Schema, Types, model} from 'mongoose';
import { IUser } from './userModel';


export interface IReview
{
    review:string,
    rating:number,
    createdAt:Date,
    tour: Types.ObjectId,
    user: HydratedDocument<IUser>
}


const reviewSchema = new Schema<IReview>({
    review: {
        type:String,
        required: [true, 'Reviews must have text']
    },
    rating: {
        type:Number,
        required:[true, 'Review must have a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    tour:{
        type: Schema.ObjectId,
        ref:'Tour',
        required:[true, 'Review must belong to a tour']
    },
    user:{
        type: Schema.ObjectId,
        ref:'User',
        required: [true, 'Review must belong to a user']
    }
})


reviewSchema.pre (/(find|findOne)$/, function (next) : void
{
    (this as Query<unknown, unknown>).populate ({path: 'user', select: 'name photo'})
    next ();
});

reviewSchema.index ({tour:1, user:1}, {unique:true});

const Review = model ('Review', reviewSchema);


export default Review;