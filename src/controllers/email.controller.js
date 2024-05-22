import nodemailer from 'nodemailer';
import config from '../config/config.js';
import bcrypt from 'bcrypt';
import { __dirname } from "../utils.js"
import {userModel} from "../dao/mongoDB/models/user.model.js";
import { v4 } from 'uuid'

// Configuración del transport
const transporter = nodemailer.createTransport({
    service: config.SERVICE,
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// Verificamos conexión con Gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

const mailOptions = {
  from: "Coder Test - " + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba CoderHouse Programación Backend clase30",
html: `<div><h1>Esto es un test de correo con NodeMailer</h1></div>`,
    attachments: []
}
const mailOptionsWithAttachments = {
    from: "Coder Test - " + config.gmailAccount,
    to: `${config.gmailAccount}`,
    subject: "Correo de prueba CoderHouse Programación Backend clase30",
    html: `<div>
                <h1>Esto es un Test de envío de correos con Nodemailer!</h1>
                <p>Ahora usando imágenes: </p>
                <img src="cid:meme"/>
            </div>`,
    attachments: [
        {
            filename: 'Meme de programación',
            path: __dirname + '/public/images/home.jpg',
            cid: 'meme'
        }
    ]
}
export const sendEmail = (req, res) => {
   try {
      let result = transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
               console.log(error);
               res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
   } catch (error) {
        console.error(error);
   res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
}
}

export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

export const sendEmailToResetPassword = async (req, res) => {
    const { email } = req.body;
    const token = v4(); // Genera un UUID

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        const resetLink = `${config.BASE_URL}/api/email/reset-password/${token}`;

        const mailOptions = {
            from: config.gmailAccount,
            to: email,
            subject: "Restablecer contraseña",
            html: `
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <a href="${resetLink}">Restablecer contraseña</a>
                <p>Este enlace expirará en 1 hora.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({ message: "Error al enviar el correo", error });
            }
            res.send({ message: "Correo enviado correctamente" });
        });

    } catch (error) {
        res.status(500).send({ message: "Error al procesar la solicitud", error });
    }
};

export const resetPassword = (req, res) => {
    const { token } = req.params;

    res.render('reset-password', { token });
};

export const handlePasswordReset = async (req, res) => {
    const { token, newPassword } = req.body;

    // Verificar si el token es válido y no ha expirado
    const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        return res.redirect('/api/email/expired-link');
    }

    // Verificar si la nueva contraseña es diferente de la anterior
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.render('reset-password', { token, error: "La nueva contraseña no puede ser la misma que la anterior" });
    }

    // Actualizar la contraseña en la base de datos
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: "Contraseña actualizada correctamente" });
};

export const handleExpiredLink = (req, res) => {
    res.render('expired-link');
};

export const checkNewPassword = async (req, res, next) => {
    const { newPassword, token } = req.body;
    const user = await userModel.findOne({ resetPasswordToken: token });

    if (!user) {
        return res.redirect('/api/email/expired-link');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.render('reset-password', { token, error: "La nueva contraseña no puede ser la misma que la anterior" });
    }

    next();
};

