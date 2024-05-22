import { Router } from "express";
import { generateUser } from "../user.mocks.js";

const router = Router();


router.get('/mockingproducts', (req,res)=>{
   const user = []
   for(let i=0; i<1; i++){
    user.push(generateUser())
   }

   res.send({status:"success", payload: user})
})


export const usersRouterMocks = router;