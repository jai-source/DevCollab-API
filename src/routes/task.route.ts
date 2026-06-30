import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  create,
  getTasks,
  getTask,
  update,
  remove,
} from "../controllers/task.controller";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  authenticate,
  create
);

router.get(
  "/",
  authenticate,
  getTasks
);

router.get(
  "/:taskId",
  authenticate,
  getTask
);

router.patch(
  "/:taskId",
  authenticate,
  update
);

router.delete(
  "/:taskId",
  authenticate,
  remove
);

export default router;