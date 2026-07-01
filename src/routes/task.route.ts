import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  create,
  getTasks,
  getTask,
  update,
  remove,
} from "../controllers/task.controller";
import commentRoutes from "./comment.route";



const router = Router({
  mergeParams: true,
});


router.post("/",authenticate,create);

router.use("/:taskId/comments", commentRoutes);

router.get("/",authenticate, getTasks);

router.get("/:taskId",authenticate,getTask);

router.patch("/:taskId",authenticate,update);

router.delete("/:taskId",authenticate,remove);

export default router;