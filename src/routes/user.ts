import exp from "constants";
import express, { Express, Request, Response } from "express";
import serverHealth from "../config/utils/serverHealth";
import createUser from "../config/User/signUp";
import loginUser from "../config/User/login";
import logout from "../config/User/logout";
import delete_account from "../config/User/delete_account";
import authenticate_user from "../config/middleware/auth";

const userRouter = express.Router();

userRouter.get("/", serverHealth);
userRouter.post("/signUp", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authenticate_user, logout);
userRouter.delete("/delete_account", authenticate_user, delete_account);

export default userRouter;
