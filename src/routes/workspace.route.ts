import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { create } from "../controllers/workspace.controller";
import { getWorkspaces } from "../controllers/workspace.controller";
import { getWorkspace } from "../controllers/workspace.controller";
import { update } from "../controllers/workspace.controller";
import { remove } from "../controllers/workspace.controller";
import { invite } from "../controllers/workspace.controller";
import { removeMemberController } from "../controllers/workspace.controller";
import projectRoutes from "./project.route";
const router = Router();

router.post(
  "/",
  authenticate,
  create
);

router.use(
  "/:workspaceId/projects",
  projectRoutes
);

router.get(
  "/",
  authenticate,
  getWorkspaces
);

router.get(
  "/:workspaceId",
  authenticate,
  getWorkspace
);

router.patch(
  "/:workspaceId",
  authenticate,
  update
);

router.delete(
  "/:workspaceId",
  authenticate,
  remove
);

router.post(
  "/:workspaceId/members",
  authenticate,
  invite
);

router.delete(
  "/:workspaceId/members/:userId",
  authenticate,
  removeMemberController
);


export default router;
