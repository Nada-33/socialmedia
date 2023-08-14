import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/userController.js";
import {verifyToken} from "../middleware/auth.js"
const router = express.Router();
//route to get user sends id in url 
router.get("/:id", verifyToken, getUser);
//route to get user friend sends id of user and friends to  get the specific friend in url 
router.get("/:id/friends", verifyToken, getUserFriends);
//route to add or remove friend sends the user and the friend id
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
export default router;