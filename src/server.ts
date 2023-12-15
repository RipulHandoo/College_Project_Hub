import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import serverHealth from "./config/utils/serverHealth";
import userRouter from "./routes/user";
import awsRouter from "./routes/bucket";

// to get the environment variables from .env file
dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8080;

// this helps to parse the request body and set up the cookie
app.use(bodyParser.json());
app.use(cookieParser());

// setting up the routers

app.get("/health", serverHealth);
app.use("/user", userRouter);
app.use("/", awsRouter)

// starting the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
