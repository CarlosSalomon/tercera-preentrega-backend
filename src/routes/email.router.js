import { Router } from "express";
import { sendEmail, checkNewPassword, sendEmailWithAttachments, sendEmailToResetPassword, resetPassword, handlePasswordReset, handleExpiredLink } from '../controllers/email.controller.js';
import { __dirname } from "../utils.js";

const router = Router();

router.get("/", sendEmail);
router.get("/attachments", sendEmailWithAttachments);
// Rutas para el reset
router.get('/request-reset-password', (req, res) => {
    res.render('request-reset-password');
});
router.post("/send-email-to-reset", sendEmailToResetPassword); // Asegúrate de que esta ruta esté configurada
router.get('/reset-password/:token', resetPassword);
router.post('/reset-password', checkNewPassword, handlePasswordReset);
router.get('/expired-link', handleExpiredLink);

export default router;