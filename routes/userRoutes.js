import express from "express";
import { getAllUsers, getUser, createUser, updateUser, deleteUser, updateCurrentUserData, deleteCurrentUser } from "../controllers/userControllers.js";
import { signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo } from "../controllers/authController.js";




const router = express.Router()

// authentification route- (signUp)
router
.route("/signup")
.post(signup)

// login
router
.route("/login")
.post(login)

// Forgot "Password page" --> creating new token
router
.route("/forgotPassword")
.post(forgotPassword)

// reset Password
router
.route("/resetPassword/:token")
.patch(resetPassword)

// update current user password
router
.route("/updateMyPassword")
.patch(protect, updatePassword)

// update current user data
router
.route("/updateMe")
.patch(protect, updateCurrentUserData)

// delete current user (set active to false)
router
.route("/deleteMe")
.delete(protect, deleteCurrentUser)

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