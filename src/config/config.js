import dotenv from 'dotenv';
import program from '../process.js';


const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" 
    ? ".env.production" 
    : ".env.development"
});


export default {
 mongo_url : process.env.MONGODB_URL,
 SECRET : process.env.SECRET_KEY,
 EMAIL : process.env.EMAIL,
 CLIENTID : process.env.CLIENT_ID,
 CLIENTSECRET : process.env.CLIENT_SECRET,
 CALLBACK : process.env.CALLBACK_URL,
 PORT : process.env.PORT,
 gmailAccount: process.env.GMAIL_ACCOUNT,
 gmailAppPassword: process.env.GMAIL_APP_PASSWD,
 SERVICE : process.env.SERVICE,
 BASE_URL : process.env.BASE_URL,
 environment : environment
}
