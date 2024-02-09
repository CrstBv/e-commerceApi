import express from "express";
import {
    getAuthenticatedUser,
    logout,
    signIn,
    signUp,
} from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, getAuthenticatedUser);

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logout);

export default router;
