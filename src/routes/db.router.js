import { Router } from "express";
import { __dirname } from "../utils.js";
import { requireAuth, isPremium } from "../config/authMiddleware.js"
import express from 'express';
import path from 'path';
import passport from "passport";
import { usersControllers } from "../controllers/usersControllers.js"
import { CartController } from "../controllers/cartsControllers.js";


const router = Router()

// Middleware para pasar el objeto user a las vistas
const setUserInLocals = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

// Usar el middleware en todas las rutas
router.use(setUserInLocals);

router.use('/productos', express.static(path.join(__dirname, 'public')));


router.post('/register', passport.authenticate('register', { failureRedirect: '/failedregister' }), usersControllers.registerOk)
router.post('/login', usersControllers.logindb);
router.delete('/empty-cart', requireAuth, CartController.emptyCart);
router.delete('/delete-to-cart', requireAuth, CartController.deleteCart);
router.post('/add-to-cart',  requireAuth, CartController.addToCart);
router.post("/tickets", requireAuth, CartController.finishPurchaseController);
router.post('/logout', usersControllers.logout)
router.post('/premium/:uid',usersControllers.changeRolController )
export default router