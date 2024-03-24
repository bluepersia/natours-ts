import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser
{
    name:string,
    email:string,
    photo:string,
    role:string,
    password: string | undefined,
    passwordConfirm: string | undefined,
    passwordChangedAt:Date,
    passwordResetToken:string | undefined,
    passwordResetExpires: Date | undefined,
    comparePassword: (s:string, hash:string) => Promise<boolean>,
    hasPasswordChangedSince: (date:Date) => boolean,
    createPasswordResetToken: () => string
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
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

userSchema.methods.hasPasswordChangedSince = function (date:Date) : boolean
{
    return this.passwordChangedAt && this.passwordChangedAt >= date;
}

userSchema.methods.createPasswordResetToken = function () : string
{
    const token = crypto.randomBytes (32).toString ('hex');

    this.passwordResetToken = crypto.createHash ('sha256').update (token).digest ('hex');
    this.passwordResetExpires = new Date (Date.now() + (7 * 24 * 60 * 60 * 1000));

    return token;
}


const User = model ('User', userSchema);


export default User;