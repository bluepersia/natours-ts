import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';

export interface IUser
{
    name:string,
    email:string,
    photo:string,
    role:string,
    password: string | undefined,
    passwordConfirm: string | undefined,
    passwordChangedAt:Date,
    comparePassword: (s:string, hash:string) => Promise<boolean>
}


const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required: [true, 'Please provide your name'],
        minlength: 2
    },
    email:{
        type:String,
        required:[true, 'Please provide an email address'],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type:String,
        default: 'default.jpg'
    },
    role: {
        type:String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type:String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type:String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val:string) : boolean
            {
                return val === this.password;
            },
            message: 'Passwords must match!'
        }
    },
    passwordChangedAt: Date
})

userSchema.pre ('save', async function (next):Promise<void>
{
    if (this.isModified ('password'))
    {
        this.password = await bcrypt.hash (this.password!, 12);

        if (!this.isNew)
            this.passwordChangedAt = new Date(Date.now () - 1000);
    }

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.comparePassword = async function (s:string, hash:string) : Promise<boolean>
{
    return await bcrypt.compare (s, hash);
}


const User = model ('User', userSchema);


export default User;