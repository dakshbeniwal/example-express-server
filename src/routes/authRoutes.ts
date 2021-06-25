import { Router } from "express";
import * as api from "../api";

const router = Router();

router.post("/signup", api.auth.signupApi);
router.post("/login", api.auth.loginApi);

export default router;