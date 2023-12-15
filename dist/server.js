"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const serverHealth_1 = __importDefault(require("./config/utils/serverHealth"));
const user_1 = __importDefault(require("./routes/user"));
const bucket_1 = __importDefault(require("./routes/bucket"));
// to get the environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// this helps to parse the request body and set up the cookie
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// setting up the routers
app.get("/health", serverHealth_1.default);
app.use("/user", user_1.default);
app.use("/", bucket_1.default);
// starting the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
