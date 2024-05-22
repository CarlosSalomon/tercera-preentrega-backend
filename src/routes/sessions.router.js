import { Router } from "express";
import passport from "passport";
import { gitAuth,callbackGit } from "../controllers/sessionsControllers.js";
export const router = Router()




router.get( '/github',passport.authenticate("github",{}), gitAuth);
router.get( '/callbackGithub',passport.authenticate("github",{}),callbackGit);

