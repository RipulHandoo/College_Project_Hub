"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const getPRN_1 = __importDefault(require("../../config/middleware/getPRN"));
const dbConnection_1 = require("../../config/utils/dbConnection");
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    },
});
function createRepo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_token = req.cookies.auth_token;
            const prn = yield (0, getPRN_1.default)(auth_token);
            const project = req.body;
            const projectName = project.repoName;
            const current_date = new Date();
            // Check if the project name is already taken
            const existingProject = yield dbConnection_1.db.oneOrNone("SELECT * FROM projects WHERE repo_name = $1", [project.repoName]);
            if (existingProject) {
                res.status(400).json({ error: 'Project with the same name already exists.' });
            }
            // temp project id
            const project_id = 1;
            // Add project details to the database
            const result = yield dbConnection_1.db.oneOrNone("INSERT INTO projects(prn,project_id, repo_name, description, tech_stack, is_private, direct_link, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING project_id", [prn, project_id, project.repoName, project.description, project.techStack, project.isPrivate, project.directLink, current_date, current_date]);
            // Create an S3 command to put an object in the specified bucket and key
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME || "",
                Key: `${prn}/${projectName}`,
                Body: "", // Empty body for directory creation
                ContentType: "application/x-directory", // Set content type for directory
            });
            // Send the S3 command to create the repository
            const response = yield s3Client.send(command);
            // Respond with a 200 OK status and a message indicating successful repository creation
            res.status(200).json({
                message: "Repository created successfully",
                response: response,
                projectId: result === null || result === void 0 ? void 0 : result.project_id,
            });
        }
        catch (error) {
            // If an error occurs, respond with a 500 Internal Server Error status and the error message
            console.error("Error creating repository:", error);
            res.status(500).json({
                status: "Internal server error",
            });
        }
    });
}
exports.default = createRepo;
