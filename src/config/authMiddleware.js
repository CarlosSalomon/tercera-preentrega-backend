
import {userService} from "../repository/index.js";



export const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

export const isAdmin = async (req, res, next) => {
    const userlog = req.session.user
    const user = await userService.getUsers(userlog.email);
    
    if (req.session && req.session.user && user.admin === true ) {
        next(); 
    } else {
        res.status(403).send('Acceso denegado. Solo users Admin acceden a esta página.');
    }
};

export const isNotAdmin = async (req, res, next) => {
    const userlog = req.session.user
    const user = await userService.getUsers(userlog.email);
    if (req.session && req.session.user && user.admin !== true ) {
        next(); 
    } else {
        res.status(403).send('Acceso denegado.');
    }
};
export const isPremium = async (req, res, next) => {
    try {
        const userlog = req.session.user;
        
      
        if (!userlog) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        }
        
        const user = await userService.getUsers(userlog.email);
        
  
        if (userlog.rol === "premium") {
  
            if (userlog.owner === userlog.email) {
                return res.status(403).json({ success: false, message: 'No puedes agregar tu propio producto al carrito' });
            }
        }


        next();
    } catch (error) {
        // Manejo de errores
        next(error);
    }
}


export const setUserInLocals = async (req, res, next) => {
    if (req.session.user) {
        const userlog = req.session.user;
        const user = await userService.getUsers(userlog.email);
        
        if (user) {
            const { admin, name, rol, email, first_name } = user;
            res.locals.user = {
                admin: admin || null,
                name: name || null,
                rol: rol || null,
                email: email || null,
                first_name: first_name || null
            };
        } else {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};
