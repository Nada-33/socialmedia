import express from "express";
import { getFeedPosts, getUserPosts, likedPost } from "../controllers/postController.js"
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
//getFeedPosts(read) get all your friends posts
router.get("/", verifyToken, getFeedPosts)
//getUserPosts(read) get all posts for a specific friend 
router.get("/:userid/posts", verifyToken, getUserPosts)
//likedPost(update)
router.patch("/:id/like", verifyToken, likedPost)
export default router;