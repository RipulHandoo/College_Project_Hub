import { Express, Response, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import path from "path/win32";
import { Secret } from "jsonwebtoken";

async function authenticate_user(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const cookie: string = req.cookies.auth_token;
  if (!cookie) {
    res.status(400).json({
      status: "auth_token not found",
      message: `error from ${path}`,
    });
  }
  const secretKey: Secret | undefined = process.env.JWT_SECERT_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECERT_KEY is not defined");
  }
  jwt.verify(cookie, secretKey, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token has expired",
        });
      }
      return res.status(401).json({
        message: "Token not verified",
      });
    } else {
      console.log("User is Authorized!!!");
      next();
    }
  });
}

export default authenticate_user;
