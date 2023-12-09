import express from "express";
import { createUser, loginUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/createUser", createUser);
userRouter.post("/login", loginUser);

export default userRouter;