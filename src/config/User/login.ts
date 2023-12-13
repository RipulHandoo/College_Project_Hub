import { Express, Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../utils/dbConnection";

dotenv.config();

type RegisterUser = {
  prn: number;
  password: string;
};

async function loginUser(req: Request, res: Response): Promise<void> {
  const user: RegisterUser = req.body;
  try {
    const hashedPassword = await db.oneOrNone(
      "SELECT * FROM users WHERE PRN=$1",
      [user.prn]
    );

    if (hashedPassword) {
      const result = await bcrypt.compare(
        user.password,
        hashedPassword.password
      );

      const token_expiration = "1h";
      const auth_token = jwt.sign(user, process.env.JWT_SECERT_KEY || "", {
        expiresIn: token_expiration,
      });
      res.cookie("auth_token", auth_token, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds

      if (result) {
        res.status(200).json({ user });
      } else {
        res.status(401).json({ status: "Unauthorized" });
      }
    } else {
      res.status(401).json({ status: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ status: "Internal Server Error" });
  }
}

export default loginUser;
