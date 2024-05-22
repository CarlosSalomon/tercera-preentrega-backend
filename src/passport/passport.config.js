import passport from "passport";
import local from 'passport-local'
import { userModel } from "../dao/mongoDB/models/user.model.js";
import { createHash, isValidatePassword } from "./bcrypt.js";
import {cartService} from "../repository/index.js"



const LocalStrategy = local.Strategy;

const initializePassport = () => {
passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        
        const { first_name, last_name, age } = req.body;

        try {
            const userExist = await userModel.findOne({ email });
            if (userExist) {
                return done(null, false, { message: 'Email already exists' });
            }
            const newCart = await cartService.createCart();
            let newUser = await userModel.create({ email, first_name, last_name, age, password: createHash(password), cartId: newCart._id });
            
            return done(null, newUser);
        } catch (error) {
            return done('Error creating user: ' + error);
        }
    }
));




    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                
                return done(null, false);
            }


            const isValidPassword = await isValidatePassword(user, password);
            if (!isValidPassword) {
                
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        userModel.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(error => {
                done(error);
            });
    });

}

export default initializePassport;