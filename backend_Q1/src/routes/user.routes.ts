import { Router } from "express";
import { getTopUsers } from "../controllers/user.controller.js";
import { authorization } from "../middleware/authorizarion.middleware.js";

const router = Router();

router.get("/users", authorization, getTopUsers);

export default router;
