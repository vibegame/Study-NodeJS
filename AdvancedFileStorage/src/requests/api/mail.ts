import {createTransport} from "nodemailer";

export const generateConfirmLink = (token: string) => `http://${process.env.HOST_IP}:${process.env.PORT}/api/confirm-account/${token}`;

export const getTransporter = async () => createTransport({
    host: process.env.TRANSPORT_EMAIL_SMTP,
    auth: {
        user: process.env.TRANSPORT_EMAIL_USERNAME,
        pass: process.env.TRANSPORT_EMAIL_PASSWORD
    },
    port: 587,
    secure: false,
});

export const registrationEmailTemplate = ({username, link}: { username: string, link: string }) => (
    `
        <h3>Hello, ${username}</h3>
        <a href="${link}">Confirm email</a>
    `
);
