import { Router } from "express";
import { getPostsByType } from "../controllers/post.controller.js";
import { authorization } from "../middleware/authorizarion.middleware.js";

const router = Router();

router.get("/posts", authorization, getPostsByType);

export default router;
