import express from "express"
import { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan} from "../controllers/tourControllers.js"
import { protect } from "../controllers/authController.js"

const router = express.Router()


// aggregation pipeline route
router
.route("/top-5-cheap")
.get(aliasTopTours,getAllTours)

// aggregation pipeline route
router
.route("/tour-stats")
.get(getTourStats)

router
.route("/monthly-plan/:year")
.get(getMonthlyPlan)

router
.route("/")
.get(protect, getAllTours) // protect is for protecting the route with authentification by the JWT
.post(createTour)

router
.route("/:id")
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

export default router