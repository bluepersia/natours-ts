import { Schema, model } from "mongoose";
import slugify from 'slugify';
import validator from 'validator';

export interface ITour 
{
    name:string,
    slug:string,
    duration:number,
    maxGroupSize:number,
    difficulty:string,
    ratingsAverage:number,
    ratingsQuantity:number,
    price:number,
    priceDiscount:number,
    summary:string,
    description:string,
    imageCover:string,
    images:string[],
    createdAt:Date,
    startDates:Date[]
}

const tourSchema = new Schema<ITour>(
    {
        name: {
            type:String,
            required:true,
            minlength: 10,
            maxlength: 40,
            validate: {
                validator: function (val:string):boolean
                {
                    return validator.isAlpha (val.split (' ').join (''));
                }
            }
        },
        slug: String,
        duration: {
            type:Number,
            required:true
        },
        maxGroupSize: {
            type:Number,
            required:true
        },
        difficulty: {
            type:String,
            required:true,
            enum: ['easy', 'medium', 'difficult']
        },
        ratingsAverage: {
            type:Number,
            default:4.5,
            set: (val:number) => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type:Number,
            default:0
        },
        price: {
            type:Number,
            required:true
        },
        priceDiscount :{
            type:Number,
            validate: {
                validator: function (val:number) : boolean
                {
                    return val < this.price;
                },
                message: 'Discount must be less than price'
            }
        },
        summary: {
            type:String,
            required:true
        },
        description: String,
        imageCover: {
            type:String,
            required:true
        },
        images: [String],
        createdAt: {
            type:Date,
            default:Date.now ()
        },
        startDates: [Date]
    }
)


tourSchema.pre ('save', function (next) : void
{
    this.slug = slugify (this.name, {lower:true});
    next ();
});

const Tour = model ('Tour', tourSchema);


export default Tour;
