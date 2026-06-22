import { Router } from "express";
import { register } from "../controllers/auth.controller";
import {login} from "../controllers/auth.controller"
import { getUserById } from "../services/auth.service";
import {getCurrentUser} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.post("/register" , register);
router.post("/login", login);
router.get(
  "/me",
  authenticate,
  getCurrentUser
);


export default router;

