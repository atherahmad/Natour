import express from "express"
import { protect, restrictTo } from "../controllers/authController.js"
import { createBooking, deleteBooking, getAllBookings, getBooking, getCheckoutSession, updateBooking } from "../controllers/bookingController.js"



const router = express.Router()

// all following routes protected
router.use(protect)

router
.route("/checkout-session/:tourId")
.get(getCheckoutSession)

// all following routes restricted
router.use(restrictTo("admin", "lead-guide"))

router
.route("/")
.get(getAllBookings)
.post(createBooking)

router
.route("/:id")
.get(getBooking)
.patch(updateBooking)
.delete(deleteBooking)



export default router