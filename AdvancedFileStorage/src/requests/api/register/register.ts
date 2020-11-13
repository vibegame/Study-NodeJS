import {Request, Response} from 'express';
import {generateConfirmLink, registrationEmailTemplate, getTransporter} from "../mail";

import {SendMailOptions, getTestMessageUrl} from "nodemailer";
import {terminal} from "../../../utils/Terminal";
import {RegistrationFields} from '../types/RegistrationFields';
import {generateMailToken} from "../token";
import {User} from '../../../mongoose/models/User.model';
import {ResponseError} from "../error";

interface RegistrationRequest extends Request {
    body: RegistrationFields
}

export const register = async (req: RegistrationRequest, res: Response) => {

    terminal.success("Request to /register");

    const {email, username, password} = req.body;

    if(!email || !username || !password) {
        return res.status(500).send(new ResponseError("Bad request"));
    }

    if(await User.findOne({email})) {
        return res.status(500).send(new ResponseError("Пользователь с такой почтой уже существует"));
    }

    if(await User.findOne({username})) {
        return res.status(500).send(new ResponseError("Пользователь с таким логином уже существует"));
    }

    const mailToken = generateMailToken(req.body);

    const mailOptions = {
        from: process.env.TRANSPORT_EMAIL_USERNAME,
        html: registrationEmailTemplate({username, link: generateConfirmLink(mailToken)}),
        subject: "Invitation to File Storage ✔",
        to: email
    } as SendMailOptions;

    try {
        const transporter = await getTransporter();

        const info = await transporter.sendMail(mailOptions);

        terminal.success(`Sent mail to ${username}: ${getTestMessageUrl(info)}`);

        return res.status(200).end();
    }
    catch (err) {
        terminal.error(err);

        return res.status(500).send(new ResponseError("Cannot send mail"));
    }

};
