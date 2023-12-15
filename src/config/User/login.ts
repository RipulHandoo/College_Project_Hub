import { Express, Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../utils/dbConnection";

dotenv.config();

// Define the shape of the user object expected in the request body during login
type RegisterUser = {
  prn: number;
  password: string;
};

/**
 * Asynchronously handles the login request.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A Promise that resolves to void
 */
async function loginUser(req: Request, res: Response): Promise<void> {
  // Extract user information from the request body
  const user: RegisterUser = req.body;

  try {
    // Retrieve hashed password from the database based on the provided PRN
    const hashedPassword = await db.oneOrNone(
      "SELECT * FROM users WHERE PRN=$1",
      [user.prn]
    );

    // Check if a hashed password is found for the provided PRN
    if (hashedPassword) {
      // Compare the provided password with the hashed password from the database
      const result = await bcrypt.compare(
        user.password,
        hashedPassword.password
      );

      // Set token expiration time (1 hour)
      const token_expiration = "1h";

      // Create a JWT token with user information and sign it with the secret key
      const auth_token = jwt.sign(user, process.env.JWT_SECERT_KEY || "", {
        expiresIn: token_expiration,
      });

      // Set the JWT token as an HTTP-only cookie with a maximum age of 1 hour
      res.cookie("auth_token", auth_token, { httpOnly: true, maxAge: 3600000 });

      // Respond based on the result of password comparison
      if (result) {
        res.status(200).json({ user });
      } else {
        res.status(401).json({ status: "Unauthorized" });
      }
    } else {
      // If no hashed password is found for the provided PRN
      res.status(401).json({ status: "Unauthorized" });
    }
  } catch (error) {
    // Log an error message and respond with a 500 Internal Server Error status
    console.error("Error in loginUser:", error);
    res.status(500).json({ status: "Internal Server Error" });
  }
}

// Export the loginUser function as the default export for this module
export default loginUser;
