import { Router } from "express";
import { __dirname } from "../utils.js";
import { requireAuth, isAdmin } from "../config/authMiddleware.js"
import express from 'express';
import path from 'path';
import { setUserInLocals } from "../config/authMiddleware.js";
import { ProductController} from '../controllers/productsControllers.js'
import { CartController } from '../controllers/cartsControllers.js'
import {usersControllers} from '../controllers/usersControllers.js'
const router = Router()


// middleware en todas las rutas
router.use(setUserInLocals);
router.use('/productos', express.static(path.join(__dirname, 'public')));
router.get('/', usersControllers.home)
router.get('/login', usersControllers.login)
router.get('/register', usersControllers.register)
router.get("/failedregister", usersControllers.failedregister)
router.get("/faillogin",usersControllers.failLogin)
router.get("/productos", requireAuth, ProductController.getProducts);
router.get("/chat", usersControllers.chat)
router.get("/profile", usersControllers.profile)
router.get("/realtimeproducts", requireAuth, isAdmin, ProductController.realtimeproducts)
router.get("/cart", requireAuth, CartController.getCartById)
router.get("/:cid", requireAuth, ProductController.getProductbyId)



export default router