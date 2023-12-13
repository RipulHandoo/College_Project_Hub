import express, { Express, Request, Response } from "express";
import { db } from "./dbConnection";

function serverHealth(req: Request, res: Response): void {
  if (db) {
    res.status(200).json({
      status: "success",
      message: "Server is healthy",
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Server is not healthy",
    });
  }
}

export default serverHealth;
