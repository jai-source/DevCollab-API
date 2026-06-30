import { Router } from "express";
import {
  create,
  getProject,
  getProjects,
  remove,
  update,
} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import taskRoutes from "../routes/task.route";
const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", create);
router.get("/", getProjects);
router.get("/:projectId", getProject);
router.patch("/:projectId", update);
router.delete("/:projectId", remove);

router.use("/:projectId/tasks", taskRoutes);

export default router;
