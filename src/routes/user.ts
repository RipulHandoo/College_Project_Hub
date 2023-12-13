import exp from "constants";
import express, { Express, Request, Response } from "express";
import serverHealth from "../config/utils/serverHealth";
import createUser from "../config/User/signUp";
import loginUser from "../config/User/login";
import logout from "../config/User/logout";

const userRouter = express.Router();

userRouter.get("/", serverHealth);
userRouter.post("/signUp", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout",logout)
export default userRouter;
