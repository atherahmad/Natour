import express from "express"
import { protect } from "../controllers/authController.js"
import { getCheckoutSession } from "../controllers/bookingController.js"



const router = express.Router()


router
.route("/checkout-session/:tourId")
.get(protect, getCheckoutSession)



export default router