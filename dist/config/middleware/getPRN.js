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
/**
 * Asynchronously retrieves the 'prn' (Personal Registration Number) from the JWT token
 * stored in the 'auth_token' cookie of the incoming request.
 *
 * @param auth_token - JWT token from the 'auth_token' cookie
 * @returns A Promise that resolves to a number (if successful) or undefined (if an error occurs).
 */
function getPRN(auth_token) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrieve the JWT_SECRET_KEY from the environment variables or use an empty string as a fallback
        const secretKey = process.env.JWT_SECERT_KEY || "";
        try {
            // Check if the JWT_SECRET_KEY is defined
            if (!secretKey) {
                throw new Error("JWT_SECERT_KEY is not defined");
            }
            // Verify the JWT token and decode its payload
            const decodedToken = jsonwebtoken_1.default.verify(auth_token, secretKey);
            // Parse the 'prn' (Personal Registration Number) from the decoded token
            let prn = parseInt(decodedToken.prn, 10);
            // Check if 'prn' is a valid number
            if (!isNaN(prn)) {
                // If 'prn' is a valid number, return it
                return prn;
            }
        }
        catch (error) {
            // Log an error message if there's an issue retrieving or decoding the auth_token
            console.error("Error in getting the auth_token in the getPRN:", error);
        }
        // If there's an error or 'prn' is not a valid number, return undefined
        return undefined;
    });
}
// Export the getPRN function as the default export for this module
exports.default = getPRN;
