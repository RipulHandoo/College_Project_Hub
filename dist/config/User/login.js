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
/**
 * Asynchronously handles the login request.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A Promise that resolves to void
 */
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract user information from the request body
        const user = req.body;
        try {
            // Retrieve hashed password from the database based on the provided PRN
            const hashedPassword = yield dbConnection_1.db.oneOrNone("SELECT * FROM users WHERE PRN=$1", [user.prn]);
            // Check if a hashed password is found for the provided PRN
            if (hashedPassword) {
                // Compare the provided password with the hashed password from the database
                const result = yield bcrypt_1.default.compare(user.password, hashedPassword.password);
                // Set token expiration time (1 hour)
                const token_expiration = "1h";
                // Create a JWT token with user information and sign it with the secret key
                const auth_token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECERT_KEY || "", {
                    expiresIn: token_expiration,
                });
                // Set the JWT token as an HTTP-only cookie with a maximum age of 1 hour
                res.cookie("auth_token", auth_token, { httpOnly: true, maxAge: 3600000 });
                // Respond based on the result of password comparison
                if (result) {
                    res.status(200).json({ user });
                }
                else {
                    res.status(401).json({ status: "Unauthorized" });
                }
            }
            else {
                // If no hashed password is found for the provided PRN
                res.status(401).json({ status: "Unauthorized" });
            }
        }
        catch (error) {
            // Log an error message and respond with a 500 Internal Server Error status
            console.error("Error in loginUser:", error);
            res.status(500).json({ status: "Internal Server Error" });
        }
    });
}
// Export the loginUser function as the default export for this module
exports.default = loginUser;
