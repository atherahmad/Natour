import express from "express"
import { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan, getTourWithin, getDistances} from "../controllers/tourControllers.js"
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
.get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan)

// route for geospatial calculations. We find tours within a specific distance according to our location. We compare our location with startLocation, which is a field in the Tour Model. In our example, our location is os Angeles. (geospatial data from google maps saved in our route (url)). We can analyze it in Compass Schema
router
.route("/tours-within/:distance/center/:latlng/unit/:unit") // "/tours-distance?distance=233&center=-40,45&unit=mi" but we do "tours-distance/233/center/-40,45/unit/mi"
.get(getTourWithin)

// On this route we calculate the distance from our location to all startLocations of all ours.
router
.route("/distances/:latlng/unit/:unit")
.get(getDistances)

router
.route("/")
.get(getAllTours) // protect is for protecting the route with authentication by the JWT
.post(protect, restrictTo("admin", "lead-guide"), createTour)

router
.route("/:id")
.get(getTour)
.patch(protect, restrictTo("admin", "lead-guide"), updateTour)
.delete(protect, restrictTo("admin", "lead-guide"), deleteTour)



export default router