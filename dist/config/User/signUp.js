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
const dbConnection_1 = require("../utils/dbConnection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const time = new Date();
        try {
            const password = user.password;
            const salt = process.env.BCRYPT_SALT || ""; // Provide a default value for salt
            const hashedPassword = (yield bcrypt_1.default.hash(password, Number(salt))).toString();
            const result = yield dbConnection_1.db.oneOrNone("INSERT INTO users (PRN, name, password, createdAt) VALUES ($1, $2, $3, $4)", [user.prn, user.name, hashedPassword, time]);
            res.status(200).json({
                user,
            });
        }
        catch (error) {
            console.error("Error in sign-up:", error);
            res.status(500).json({
                status: "error",
                message: "An error occurred during sign-up.",
            });
        }
    });
}
exports.default = createUser;
