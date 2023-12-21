"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createRepo_1 = __importDefault(require("../controllers/aws-bucket/createRepo"));
const auth_1 = __importDefault(require("../config/middleware/auth"));
const awsRouter = express_1.default.Router();
awsRouter.post("/createRepo", auth_1.default, createRepo_1.default);
exports.default = awsRouter;
