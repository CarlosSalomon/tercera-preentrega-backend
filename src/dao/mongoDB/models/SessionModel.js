const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rol: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    __v: { type: Number, required: true }
});

const CookieSchema = new Schema({
    originalMaxAge: { type: Number, default: null },
    expires: { type: Date, default: null },
    httpOnly: { type: Boolean, required: true },
    path: { type: String, required: true }
});

const SessionSchema = new Schema({
    _id: { type: String, required: true },
    expires: { type: Date, required: true },
    session: {
        cookie: CookieSchema,
        passport: {
            user: UserSchema
        },
        user: {
            email: { type: String, required: true },
            name: { type: String, required: true },
            age: { type: Number, required: true },
            lastname: { type: String, required: true },
            rol: { type: String, required: true }
        }
    }
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', SessionSchema);
