import { Router } from "express";
import { handleCodeGeneration } from "../controllers/codeController.js";

const router = Router();

router.post("/generate", handleCodeGeneration);

export default router;