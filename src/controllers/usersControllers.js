import passport from "passport";
import bcrypt from "bcrypt";
import { userModel } from "../dao/mongoDB/models/user.model.js";
import { userService } from "../repository/index.js";
import { Admin } from "mongodb";


class usersControllers {

    static home = async (req, res) => {
        res.render('home')
    }
    static chat = async (req, res) => {
        res.render('chat')
    }
    static login = async (req, res) => {
        res.render('login')
    }
    static logout = async (req, res) => {

        req.session.destroy((err) => {
            if (err) res.send('Failed Logout')
            res.redirect('/')
        })
    }
    static register = async (req, res) => {
        res.render('register')
    }
    static failLogin = async (req, res) => {
        res.send({ error: "Failed login Strategy" })
    }
    static profile = async (req, res) => {
        const userlog = req.session.user
        const userdate = await userService.getUsers(userlog.email)
        const user = userdate.toObject();
        console.log(user)

        res.render('profile', { user })
    }

    static failedregister = async (req, res) => {
        res.send({ error: "Failed Strategy" })
    }
    static registerOk = async (req, res) => {
        res.redirect('/login')
    }

    static logindb = async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render('login', { error: "credenciales invalidas" });
                }
                req.login(user, async (loginErr) => {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    req.session.user = {
                        email: user.email,
                        name: user.first_name,
                        age: user.age,
                        lastname: user.last_name,
                        rol: user.rol,
                    };
                    return res.redirect('/productos')

                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    }

    static handlePasswordReset = async (req, res) => {
        const { token, newPassword } = req.body;

        // Verifico si el token es válido y no ha expirado
        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.redirect('/api/email/expired-link');
        }

        // Verifico si la nueva contraseña es diferente de la anterior
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.render('reset-password', { token, error: "La nueva contraseña no puede ser la misma que la anterior" });
        }

        // Actualizo la contraseña en la base de datos
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send({ message: "Contraseña actualizada correctamente" });
    }

    static changeRolController = async (req, res) => {

        const uid = req.params.uid
  
        console.log(uid)
        const user = req.session.user
        console.log(user)

        try {
            if (user.rol === "premium") {
                
                await userService.updateUser(uid, { rol: "user", admin: "false" }  )
                return res
                    .status(200)
                    .send({ message: 'rol modificado a user correctamente' })
            }
            
            await userService.updateUser(uid, { rol: "premium", admin: "true" })
            return res
                .status(200)
                .send({ message: 'rol modificado a premium correctamente' })
        } catch (error) {
            res.status(404).json({
                error: error.message
            });
        }

    }
}

export { usersControllers }
