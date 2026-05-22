import { Router, type Request, type Response } from "express";
import codeRoutes from "./codeRoutes.js";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

router.use("/ai", codeRoutes);

export default router;
