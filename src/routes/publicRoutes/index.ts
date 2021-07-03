import { Router } from "express";
import authRoutes from "./authroutes";

const router = Router();

router.use("/auth", authRoutes);

export default router;