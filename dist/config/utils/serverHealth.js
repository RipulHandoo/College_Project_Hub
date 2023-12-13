"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
function serverHealth(req, res) {
    if (dbConnection_1.db) {
        res.status(200).json({
            status: "success",
            message: "Server is healthy",
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "Server is not healthy",
        });
    }
}
exports.default = serverHealth;
