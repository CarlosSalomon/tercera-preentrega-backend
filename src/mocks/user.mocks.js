import {faker} from '@faker-js/faker/locale/es'; 
import { generateProduct } from './products.mocks.js';

export const generateUser = () =>{
    let numbOfProducts = 100
    let products = []
    for(let i=0;i<numbOfProducts ;i++ ){
        products.push(generateProduct())
    }
     
    const roles = [ "admin", "user"]
    
    return{
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        id: faker.database.mongodbObjectId(),
        role: faker.helpers.arrayElements(roles),
        products
    }
}