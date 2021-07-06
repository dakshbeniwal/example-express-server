import { Router } from "express";
import * as api from "../../api";

const router = Router();

router.post("/signup", api.auth.signupApi);
router.post("/login", api.auth.loginApi);
router.get("/google/login", api.auth.googleLoginApi);
router.get("/google", api.auth.googleOAuthApi);
router.get("/", api.auth.getLoggedInUserApi);

export default router;