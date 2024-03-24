const nodemailer = require ('nodemailer');
import fs from 'fs';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../models/userModel';
const Styliner = require ('styliner');
const styliner = new Styliner (`${__dirname}/html`);
import htmlToText from 'html-to-text';

export default class Email
{
    constructor (public user:HydratedDocument<IUser>, public data:{[key:string]:string}){}

    newTransport () 
    {
        if (process.env.NODE_ENV === 'development')
            return nodemailer.createTransport ({
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_PORT,
                auth: {
                    user:process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS
                }
            })

        return nodemailer.createTransport ({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USER,
                pass: process.env.SENDGRID_PASS
            }
        })
    }

    async send (subject:string, template:string) : Promise<void>
    {
        let html = await fs.promises.readFile (`${__dirname}/email/${template}.html`, 'utf-8');

        html = await styliner.processHTML (html);

        Object.keys (this.data).forEach (key => { 
            html = html.replace (`<${key.toUpperCase()}>`, this.data[key]);
        })

        const mailOpts =
        {
            to: this.user.email,
            from: process.env.MAIL_FROM,
            subject,
            html,
            text:htmlToText.convert (html)
        }

        this.newTransport ().sendMal (mailOpts);
    }

    async sendWelcome () : Promise<void>
    {
        await this.send ('Welcome to the Natours Family', 'welcome');
    }

    async sendPasswordReset () : Promise<void>
    {
        await this.send ('Reset your password', 'resetPassword');
    }

}