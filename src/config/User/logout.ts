import { Express, Request, Response } from "express";

async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie("auth_token");
  res.status(200).json({
    message: "Log-Out Successfully",
  });
}

export default logout;
