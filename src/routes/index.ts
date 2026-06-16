import {Router} from "express";
import { success } from "zod";

const router = Router();

router.get("/health", (req , res)=>{
    res.json({
        success: true,
        message: "API running",
    });
});

export default router;