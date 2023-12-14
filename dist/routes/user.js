"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverHealth_1 = __importDefault(require("../config/utils/serverHealth"));
const signUp_1 = __importDefault(require("../config/User/signUp"));
const login_1 = __importDefault(require("../config/User/login"));
const logout_1 = __importDefault(require("../config/User/logout"));
const delete_account_1 = __importDefault(require("../config/User/delete_account"));
const auth_1 = __importDefault(require("../config/middleware/auth"));
const userRouter = express_1.default.Router();
userRouter.get("/", serverHealth_1.default);
userRouter.post("/signUp", signUp_1.default);
userRouter.post("/login", login_1.default);
userRouter.post("/logout", auth_1.default, logout_1.default);
userRouter.delete("/delete_account", auth_1.default, delete_account_1.default);
exports.default = userRouter;
