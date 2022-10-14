import express from "express"
import { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours} from "../controllers/tourControllers.js"


const router = express.Router()

// router.param("id", checkId)

router
.route("/top-5-cheap")
.get(aliasTopTours,getAllTours)

router
.route("/")
.get(getAllTours)
.post(createTour)

router
.route("/:id")
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

export default router