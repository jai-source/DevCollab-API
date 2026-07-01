import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import { create } from "../controllers/comment.controller";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  authenticate,
  create
);

export default router;