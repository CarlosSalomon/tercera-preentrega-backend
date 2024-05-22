import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    code: {
        type: String,
        unique: true, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    owner: {
      type: String,
      default: 'admin',
      required: true,
      validate: {
          validator: function(v) {
              // Validar que el owner es 'admin' o un email de usuario premium
              return v === 'admin' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: props => `${props.value} is not a valid email!`
      }
  }
})
mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate)

export  const productsModel= mongoose.model('productos',productSchema)





export const finishPurchaseController = async (req,res) =>{
    try {
      let cart = await findById(req.params.cid);
      let total_price = 0;
      let unstocked_products = [];
      for (const item of cart.products) {
        let product = await getProductById(item.product);
        if (product) {
          if (product.stock >= item.quantity) {
            total_price += item.quantity * product.price;
            let stockLowering = await updateProduct(item.product, { stock: product.stock - item.quantity });
          } else {
            unstocked_products.push({ product: product._id, quantity: item.quantity });
            console.log(item.quantity)
          }
        } else {
          // Manejar el caso en el que no se encuentra el producto
          console.log(`Product not found for ID: ${item.product}`);
        }
      }
  
      if(total_price > 0){
        cart.products = unstocked_products
        let newCart = await updateProducts(req.params.cid,cart)
        let newTicket = await createTicket({code:`${req.params.cid}_${Date.now()}`,amount:total_price,purchaser:req.session.user.email})
        await sendMail(req.session.user.email, newTicket )
        return res.status(200).json(new TicketDto(newTicket))
      } 
      else{
        return res.status(404).json({message:"No se realizó ninguna compra"})
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }