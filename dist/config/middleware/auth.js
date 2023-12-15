"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const win32_1 = __importDefault(require("path/win32"));
function authenticate_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookie = req.cookies.auth_token;
        if (!cookie) {
            res.status(400).json({
                status: "auth_token not found",
                message: `error from ${win32_1.default}`,
            });
        }
        const secretKey = process.env.JWT_SECERT_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECERT_KEY is not defined");
        }
        jsonwebtoken_1.default.verify(cookie, secretKey, (err, user) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        message: "Token has expired",
                    });
                }
                return res.status(401).json({
                    message: "Token not verified",
                });
            }
            else {
                console.log("User is Authorized!!!");
                next();
            }
        });
    });
}
exports.default = authenticate_user;
