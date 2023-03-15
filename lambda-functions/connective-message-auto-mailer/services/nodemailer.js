import nodemailer from 'nodemailer'
import {} from 'dotenv/config'

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
})

export let mailOptions = {
    from: `"Connective" ${process.env.EMAIL_USER}`,
    to: 'cybrainfoxy@gmail.com',
}
