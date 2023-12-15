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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Asynchronously handles the logout request by clearing the 'auth_token' cookie.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A Promise that resolves to void
 */
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear the 'auth_token' cookie to perform the logout
        res.clearCookie("auth_token");
        // Respond with a 200 OK status and a message indicating successful logout
        res.status(200).json({
            message: "Log-Out Successfully",
        });
    });
}
// Export the logout function as the default export for this module
exports.default = logout;
