
class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getCarts() {
        const carts = await this.dao.find();
        return carts;
    }

    async createCart() {
        const cart = await this.dao.createCart();
        return cart;
    }

    async getCartsById(cartId) {
        const cart = await this.dao.getCartById(cartId);
        return cart;
    }

    async addCart(products) {
        const cart = await this.dao.addCart(products);
        return cart;
    }

    async addProductInCart(cid, obj, id, quantity) {
        const cart = await this.dao.addProductInCart(cid, obj, id, quantity);
        
        return cart;
    }

    async removeallProductFromCart(cartId) {
        const cart = await this.dao.removeallProductFromCart(cartId);
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.dao.removeProductFromCart(cartId, productId);
        return cart;
    }
}

export { CartRepository}