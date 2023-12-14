import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { db } from "../utils/dbConnection";
import getPRN from "../middleware/getPRN";

dotenv.config();

async function delete_account(req: Request, res: Response): Promise<void> {
  // Fetch the JWT token from the cookie
const auth_token: string = req.cookies.auth_token;

// Retrieve the JWT secret key from the environment variables
const secretKey: Secret = process.env.JWT_SECERT_KEY || "";
if (!secretKey) {
  throw new Error("JWT_SECERT_KEY is not defined");
}

// Use the getPRN function to asynchronously retrieve the 'prn' from the JWT token
const prn = await getPRN(auth_token);

// Check if 'prn' is a valid number
if (prn === undefined || isNaN(prn)) {
  res.status(401).send("Unauthorized");
  return;
}

// 'prn' is a valid number, you can use it as needed
console.log("User PRN:", prn);
console.log("PRN Type:", typeof prn);

  // Delete the user, handling exceptions
try {
  const result = await db.result('DELETE FROM users WHERE prn = $1', [prn]);
  if (result.rowCount > 0) {
    console.log("User deleted successfully");
    return;
  } else {
    console.log("User not found");
  }
} catch (error) {
  console.error("Error deleting user:", error);
  res.status(500).send("Error deleting user");
}

}

export default delete_account;
