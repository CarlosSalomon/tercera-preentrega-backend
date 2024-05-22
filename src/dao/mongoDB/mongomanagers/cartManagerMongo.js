import { cartModel } from "../models/carts.model.js"

class CartManager {

  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      console.error('Error getting carts:', err.message);
      return [];
    }
  };

  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId).lean()
      
      return cart;
    } catch (err) {
      console.error('Error getting cart by ID:', err.message);
      return err;
    }
  };

  addCart = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }
      const cart = await cartModel.create(cartData);
      return cart;
    } catch (err) {
      console.error('Error creating cart:', err.message);
      return err;
    }
  };

  addProductInCart = async (cid, obj, id, quantity) => {
    try {
        const cart = await cartModel.findById(cid);

        
        const existingProduct = cart.products.find(product => product._id.toString() === id);

        if (existingProduct) {
        
            existingProduct.quantity += quantity;
        } else {
            
            cart.products.push({
                _id: obj._id,
                quantity: quantity,
                thumbnail: obj.thumbnail,
                title: obj.title,
                price: obj.price
            });
        }

        await cart.save();
        return await cartModel.findById(cid);
    } catch (err) {
        console.error('Error when adding product to cart:', err.message);
        return err;
    }
};

removeallProductFromCart = async(cartId) =>{
  const cart = await cartModel.findById(cartId)
  cart.products = [];
  await cart.save();
}

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartModel.findById(cartId);

      
      const productIndex = cart.products.findIndex((product) => product._id.toString() === productId);

      if (productIndex !== -1) {
        
        cart.products.splice(productIndex, 1);
        await cart.save();
        return await cartModel.findById(cartId);
      } else {
        throw new Error('The product was not found in the cart');
      }
    } catch (err) {
      console.error('Error removing product from cart:', err.message);
      return err;
    }
  };

  createCart = async () => {
		try{
			const newCart = {
				products: [],
			} 
			const createdCart = await cartModel.create(newCart)
			if(!createdCart){
				throw new Error('Cart creation failed.')
			}
			return createdCart
		} catch(error){
			if(error == 'Cart creation failed.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}
  
};



export default CartManager;