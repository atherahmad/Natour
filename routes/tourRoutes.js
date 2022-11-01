import express from "express"
import { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan} from "../controllers/tourControllers.js"
import { protect, restrictTo } from "../controllers/authController.js"
import reviewRouter from "./reviewRoutes.js"

const router = express.Router()

// POST /tour/234fsa/reviews => nested route
// GET /tour/234fsa/reviews
router.use("/:tourId/reviews", reviewRouter) // this is called mounting a router. For this specific route we want to use our reviewRouter. So when the stack hits this particular route it will be redirected into the reviewRouter. There we merge the params and have access to the tourId.


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
.get(protect, getAllTours) // protect is for protecting the route with authentication by the JWT
.post(createTour)

router
.route("/:id")
.get(getTour)
.patch(updateTour)
.delete(protect, restrictTo("admin", "lead-guide"), deleteTour)



export default router