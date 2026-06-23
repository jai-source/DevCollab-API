import { Router } from "express";
import authRoutes from "./auth.routes";
import workspaceRoutes from "../routes/workspace.route";



const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

router.use("/auth", authRoutes);
router.use(
  "/workspaces",
  workspaceRoutes
);

export default router;