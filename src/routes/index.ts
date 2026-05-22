import { Router, type Request, type Response } from "express";
import { uptime } from "node:process";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

export default router;
