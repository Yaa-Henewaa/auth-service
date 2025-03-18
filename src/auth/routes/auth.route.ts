
import express from "express"
import AuthController from "../auth.controller";


const router = express.Router();

//prefix:/auth
router.post("/register", AuthController.registerHandler);

export {router as AuthRoutes};