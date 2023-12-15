import { Express, Request, Response } from "express";

/**
 * Asynchronously handles the logout request by clearing the 'auth_token' cookie.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A Promise that resolves to void
 */
async function logout(req: Request, res: Response): Promise<void> {
  // Clear the 'auth_token' cookie to perform the logout
  res.clearCookie("auth_token");

  // Respond with a 200 OK status and a message indicating successful logout
  res.status(200).json({
    message: "Log-Out Successfully",
  });
}

// Export the logout function as the default export for this module
export default logout;
