import express from "express";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userControllers.js";
import { signup } from "../controllers/authController.js";



const router = express.Router()

router
.route("/signup")
.post(signup)

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