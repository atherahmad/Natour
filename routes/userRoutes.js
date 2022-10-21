import express from "express";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userControllers.js";
import { signup, login, forgotPassword, resetPassword } from "../controllers/authController.js";



const router = express.Router()

// authentification route- (signUp)
router
.route("/signup")
.post(signup)

// login
router
.route("/login")
.post(login)

// update Password --> Forgot "Password page" --> creating new token
router
.route("/forgotPassword")
.post(forgotPassword)

// reset Password
router
.route("/resetPassword")
.post(resetPassword)

router
.route("/")
.get(getAllUsers)
.post(createUser)

router
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

export default router