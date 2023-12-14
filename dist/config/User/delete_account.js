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
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConnection_1 = require("../utils/dbConnection");
dotenv_1.default.config();
function delete_account(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the JWT token from the cookie
        const authToken = req.cookies.auth_token;
        // Retrieve the JWT secret key from the environment variables
        const secretKey = process.env.JWT_SECERT_KEY;
        if (!secretKey) {
            throw new Error("JWT_SECERT_KEY is not defined");
        }
        // Verify and decode the JWT token
        const decodedToken = jsonwebtoken_1.default.verify(authToken, secretKey);
        // Parse the 'prn' from the JWT payload as an integer
        let prn = parseInt(decodedToken.prn, 10);
        console.log("User PRN:", prn);
        console.log("PRN Type:", typeof prn);
        // Check if 'prn' is a valid number
        if (isNaN(prn)) {
            res.status(401).send("Unauthorized");
            return;
        }
        // Delete the user, handling exceptions
        try {
            const result = yield dbConnection_1.db.result('DELETE FROM users WHERE prn = $1', [prn]);
            if (result.rowCount > 0) {
                console.log("User deleted successfully");
                return;
            }
            else {
                console.log("User not found");
            }
        }
        catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Error deleting user");
        }
    });
}
exports.default = delete_account;
