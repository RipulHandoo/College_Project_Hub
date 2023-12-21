import { Express, Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import getPRN from "../../config/middleware/getPRN";
import { db } from "../../config/utils/dbConnection";

dotenv.config();

const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  },
});

interface repoDetails {
  repoName: string;
  description: string;
  techStack: string[];
  isPrivate: boolean;
  directLink: string;
}

async function createRepo(req: Request, res: Response): Promise<void> {
  try {
    const auth_token: string = req.cookies.auth_token;
    const prn: number | undefined = await getPRN(auth_token);
    const project: repoDetails = req.body;
    const projectName: string = project.repoName;
    const current_date: Date = new Date();

    // Check if the project name is already taken
    const existingProject = await db.oneOrNone(
      "SELECT * FROM projects WHERE repo_name = $1",
      [project.repoName]
    );

    if (existingProject) {
      res
        .status(400)
        .json({ error: "Project with the same name already exists." });
    }

    // temp project id
    const project_id: number = 1;

    // Add project details to the database
    const result = await db.oneOrNone(
      "INSERT INTO projects(prn,project_id, repo_name, description, tech_stack, is_private, direct_link, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING project_id",
      [
        prn,
        project_id,
        project.repoName,
        project.description,
        project.techStack,
        project.isPrivate,
        project.directLink,
        current_date,
        current_date,
      ]
    );

    // Create an S3 command to put an object in the specified bucket and key
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: `${prn}/${projectName}`,
      Body: "", // Empty body for directory creation
      ContentType: "application/x-directory", // Set content type for directory
    });

    // Send the S3 command to create the repository
    const response = await s3Client.send(command);

    // Respond with a 200 OK status and a message indicating successful repository creation
    res.status(200).json({
      message: "Repository created successfully",
      response: response,
      projectId: result?.project_id,
    });
  } catch (error) {
    // If an error occurs, respond with a 500 Internal Server Error status and the error message
    console.error("Error creating repository:", error);
    res.status(500).json({
      status: "Internal server error",
    });
  }
}

export default createRepo;
