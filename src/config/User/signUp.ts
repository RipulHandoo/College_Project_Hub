import { Express, Request, Response } from "express";
import { db } from "../utils/dbConnection";
import bcrypt, { hash } from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
type User = {
  name: string;
  prn: number;
  password: string;
}

async function createUser(req: Request, res: Response): Promise<void> {
  const user: User = req.body;
  const time = new Date();
  try {
    const password: string = user.password;
    const salt: string = process.env.BCRYPT_SALT || ""; // Provide a default value for salt
    const hashedPassword: string = (
      await bcrypt.hash(password, Number(salt))
    ).toString();
    const result = await db.oneOrNone(
      "INSERT INTO users (PRN, name, password, createdAt) VALUES ($1, $2, $3, $4)",
      [user.prn, user.name, hashedPassword, time]
    );
    res.status(201).json({
      user,
    });
  } catch (error) {
    console.error("Error in sign-up:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during sign-up.",
    });
  }
}

export default createUser;
