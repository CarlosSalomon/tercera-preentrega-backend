import { cartService, productsService, userService } from "../repository/index.js"
import { createTicket } from "../dao/mongoDB/mongomanagers/ticketManagerMongo.js";
import CustomError from "../dao/errors/CustomError.js";
import EErrors from "../dao/errors/errors-enums.js";
import {addToCartErrorInfoSP, addToCartErrorInfoPremium} from "../dao/errors/messages/product-creation-error.message.js"


class CartController {

    static getCartById = async (req, res) => {
        const logUser = req.session.user;
        const user = await userService.getUsers(logUser.email)
        const cartId = user.cartId
        const productsInCart = await cartService.getCartsById(cartId)
        const productList = Object.values(productsInCart.products)
        res.render("partials/cart", { productList })
    }

    static emptyCart = async (req, res) => {
        try {
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const cart = await cartService.removeallProductFromCart(cartId);
            res.status(200).json({ message: 'Carrito vaciado exitosamente' });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    }

    static deleteCart = async (req, res) => {
        try {
            const { productId } = req.body;
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const removeCartProduct = await cartService.removeProductFromCart(cartId, productId);
            res.json({ success: true, message: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ message: 'Error al agregar producto al carrito' });
        }
    }

    static addToCart = async (req, res) => {
        try {
            const { productId, quantity } = req.body; 
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email);
           
            const cartId = user.cartId;
            const cart = await cartService.getCartsById(cartId);
            

  
    
            if (productId) {
                const productDetails = await productsService.getProductById(productId);
  
                if (productDetails.owner === user.email && user.rol === "premium") {
                    const error = CustomError.createError({
                        name: 'PremiumError',
                        message: 'No puede agregar productos creados por usted al carrito',
                        code: EErrors.INADEQUATE_PREMIUM_ERROR,
                        cause: addToCartErrorInfoPremium({ owner: productDetails.owner })
                    });
                    throw error;
                }
    
                if (productDetails.stock < quantity) {
                    const error = CustomError.createError({
                        name: 'StockError',
                        message: 'No hay stock suficiente',
                        code: EErrors.INADEQUATE_STOCK_ERROR,
                        cause: addToCartErrorInfoSP({ quantity })
                    });
                    throw error;
                }
    
                const addedProduct = await cartService.addProductInCart(cartId, productDetails, productId, quantity); 
            }
            
            res.json({ success: true, message: 'Producto agregado al carrito' });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ message: 'No se pudo agregar el producto al carrito creado por mismo usuario' });
        }
    }
    
    static finishPurchaseController = async (req, res) => {
        try {
            const logUser = req.session.user;
            const user = await userService.getUsers(logUser.email)
            const cartId = user.cartId
            const cart = await cartService.getCartsById(cartId);
            let total_price = 0;
            let unstocked_products = [];
            for (const item of cart.products) {
                const id = item._id
                const quantity = item.quantity
                let product = await productsService.getProductById(id);
                if (product) {
                    if (product.stock >= item.quantity) {
                        total_price += item.quantity * product.price;
                        product.stock -= quantity;
                        await productsService.updateProduct(id, product);
                    } else {
                        unstocked_products.push({ product: product._id, quantity: item.quantity });
                    }
                } else {
                    
                    
                  }
            }

            if (total_price > 0) {

                cart.products = unstocked_products

                let newCart = await productsService.updateProduct(req.params.cid, cart)
                const user = req.session.user
                console.log(user)
                const ticket = ({ code: `${req.session.user.name}_${Date.now()}`, amount: total_price, purchaser: req.session.user.email, purchase_datetime:` ${Date.now()}` })

                let newTicket = await createTicket(ticket)
                
                return res.status(201).json({ message: "Ticket creado exitosamente" });

                
            }
            else {
                return res.status(404).json({ message: "No se realizó ninguna compra" })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export { CartController }