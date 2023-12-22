import express from "express";
import passport from 'passport';
import { createUser, loginUser, logoutUser, resetPassword, checkAuthRole } from "../controllers/userController";
const passportSetup = require('../config/passport.setup');

const userRouter = express.Router();

userRouter.post("/createUser", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/resetPassword", resetPassword);
userRouter.get("/checkAuthRole", checkAuthRole);

export default userRouter;