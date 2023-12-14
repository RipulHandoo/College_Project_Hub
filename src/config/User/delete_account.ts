import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { db } from "../utils/dbConnection";

dotenv.config();

async function delete_account(req: Request, res: Response): Promise<void> {
  // Fetch the JWT token from the cookie
  const authToken: string = req.cookies.auth_token;

  // Retrieve the JWT secret key from the environment variables
  const secretKey: Secret | undefined = process.env.JWT_SECERT_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECERT_KEY is not defined");
  }

  // Verify and decode the JWT token
  const decodedToken = jwt.verify(authToken, secretKey) as JwtPayload;

  // Parse the 'prn' from the JWT payload as an integer
  let prn = parseInt(decodedToken.prn, 10);
  console.log("User PRN:", prn);
  console.log("PRN Type:", typeof prn);

  // Check if 'prn' is a valid number
  if (isNaN(prn)) {
    res.status(401).send("Unauthorized");
    return;
  }

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
