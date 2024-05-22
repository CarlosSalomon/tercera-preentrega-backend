import mongoose from 'mongoose';

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    first_name: { 
        type: String,
    },
    last_name: { 
        type: String,
    },
    email: {
        type: String,
        unique: true
     },
    age: {
        type: Number,
    },
    password: {
        type: String, 
    },
    admin: {
        type: Boolean,
        default: false
     },
    cartId: {
            type: String
        },
    rol: {  
        type: String, 
        enum: ['admin', 'user', 'premium' ], 
        default: 'user' 
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
},
{
    timestamps: true,
    strict:false
}

);

userSchema.pre('find', function(next){
    this.populate('carts._id');
    next();
});
export const userModel = mongoose.model('User', userSchema, userCollection);
