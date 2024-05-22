import ProductManager from "../dao/mongoDB/mongomanagers/productManagerMongo.js";
import { userService } from "../repository/index.js";

const pm = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id)

        socket.on("addProduct", async (obj) => {
            console.log(obj.owner)
            const user = await userService.getUsers(obj.owner)
            console.log(user)
            if (user.rol === "premium") {
                obj.owner = user.email
                await pm.addProduct(obj)
            }

            const listadeproductos = await pm.getProducts()
            console.log(listadeproductos)
            socketServer.emit("enviodeproducts", listadeproductos)
        })

        socket.on("deleteProduct", async (id, owner) => {
            const user = await userService.getUsers(owner)
            const prod = await productsService.getProductById(id)

            try {
                if (user.rol === "premium" && owner === prod.owner) {
                    await pm.deleteProduct(id);
                    const listadeproductos = await pm.getProducts();
                    socketServer.emit("enviodeproducts", listadeproductos);
                } else {
                    throw new Error("Solo puedes eliminar productos propios.");
                }
                if (user.rol === "admin") {
                    await pm.deleteProduct(id);
                    const listadeproductos = await pm.getProducts();
                    socketServer.emit("enviodeproducts", listadeproductos);
                }
            } catch (error) {
                socketServer.emit("enviodeproducts", { error: error.message });
            }
        });



        socket.on("nuevousuario", (usuario) => {
            console.log("usuario", usuario)
            socket.broadcast.emit("broadcast", usuario)
        })
        socket.on("disconnect", () => {
            console.log(`Usuario con ID : ${socket.id} esta desconectado `)
        })


    })
};

export default socketProducts;