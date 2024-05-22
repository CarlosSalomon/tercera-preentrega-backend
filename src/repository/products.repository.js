
class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            return await this.dao.getProducts();
        } catch (err) {
            return err;
        }
    }

    async getProductById(id) {
        try {
            const result = await this.dao.getProductById(id);
            return result
        } catch (err) {
            return { error: err.message };
        }
    }

    async addProduct(product) {
        try {
            await this.dao.addProduct(product);
            
        } catch (err) {
            return err;
        }
    }

    async updateProduct(id, product) {
        try {
            await this.dao.updateProduct(id, product);
        } catch (err) {
            return err;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.dao.deleteProduct(id);
        } catch (err) {
            return err;
        }
    }
}

export { ProductsRepository };