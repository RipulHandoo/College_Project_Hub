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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnection_1 = require("../utils/dbConnection");
dotenv_1.default.config();
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        try {
            const hashedPassword = yield dbConnection_1.db.oneOrNone("SELECT * FROM users WHERE PRN=$1", [user.prn]);
            if (hashedPassword) {
                const result = yield bcrypt_1.default.compare(user.password, hashedPassword.password);
                const token_expiration = "1h";
                const auth_token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECERT_KEY || "", {
                    expiresIn: token_expiration,
                });
                res.cookie("auth_token", auth_token, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds
                if (result) {
                    res.status(200).json({ user });
                }
                else {
                    res.status(401).json({ status: "Unauthorized" });
                }
            }
            else {
                res.status(401).json({ status: "Unauthorized" });
            }
        }
        catch (error) {
            console.error("Error in loginUser:", error);
            res.status(500).json({ status: "Internal Server Error" });
        }
    });
}
exports.default = loginUser;
