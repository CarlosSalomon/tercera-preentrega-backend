import { CartRepository } from "./cart.repository.js";
import {ProductsRepository} from "./products.repository.js"
import  CartManager  from "../dao/mongoDB/mongomanagers/cartManagerMongo.js"
import  ProductManager  from "../dao/mongoDB/mongomanagers/productManagerMongo.js"
import { userRepository } from "./users.repository.js"
import  userManager  from "../dao/mongoDB/mongomanagers/userManagerMongo.js"



const cartDB = new CartManager();
const productsDB = new ProductManager();
const userDB = new userManager();


export const cartService = new CartRepository(cartDB)
export const productsService = new ProductsRepository(productsDB)
export const userService = new userRepository(userDB)
