
import bcryps from  'bcrypt';


//registro
export const createHash = (password) => {
    return bcryps.hashSync(password, bcryps.genSaltSync(10))
}

//login
export const isValidatePassword = (user, password) => {
    return bcryps.compare(password, user.password);
}