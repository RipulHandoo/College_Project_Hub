"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pg = (0, pg_promise_1.default)();
exports.db = pg({
    host: "localhost",
    port: 5432,
    password: "casper@21",
    database: "project_hub",
    user: "postgres",
});
