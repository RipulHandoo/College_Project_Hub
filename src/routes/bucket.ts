import { Route } from "aws-sdk/clients/eventbridge";
import express, { Express, Request, Response, Router } from "express";
import createRepo from "../controllers/aws-bucket/createRepo";
import authenticate_user from "../config/middleware/auth";

const awsRouter: Router = express.Router();

awsRouter.post("/createRepo", authenticate_user, createRepo);

export default awsRouter;
