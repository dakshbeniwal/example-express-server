import { Router } from "express";
import * as api from "../../api";

const router = Router();

router.post("/login", api.auth.adminLoginApi);
router.get("/", api.auth.getLoggedInUserApi);

export default router;