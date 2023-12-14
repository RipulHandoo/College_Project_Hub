import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

/**
 * Asynchronously retrieves the 'prn' (Personal Registration Number) from the JWT token
 * stored in the 'auth_token' cookie of the incoming request.
 *
 * @param auth_token - JWT token from the 'auth_token' cookie
 * @returns A Promise that resolves to a number (if successful) or undefined (if an error occurs).
 */
async function getPRN(auth_token: string): Promise<number | undefined> {
  // Retrieve the JWT_SECRET_KEY from the environment variables or use an empty string as a fallback
  const secretKey: Secret = process.env.JWT_SECERT_KEY || "";

  try {
    // Check if the JWT_SECRET_KEY is defined
    if (!secretKey) {
      throw new Error("JWT_SECERT_KEY is not defined");
    }

    // Verify the JWT token and decode its payload
    const decodedToken = jwt.verify(auth_token, secretKey) as JwtPayload;

    // Parse the 'prn' (Personal Registration Number) from the decoded token
    let prn = parseInt(decodedToken.prn, 10);

    // Check if 'prn' is a valid number
    if (!isNaN(prn)) {
      // If 'prn' is a valid number, return it
      return prn;
    }
  } catch (error) {
    // Log an error message if there's an issue retrieving or decoding the auth_token
    console.error("Error in getting the auth_token in the getPRN:", error);
  }

  // If there's an error or 'prn' is not a valid number, return undefined
  return undefined;
}

// Export the getPRN function as the default export for this module
export default getPRN;
