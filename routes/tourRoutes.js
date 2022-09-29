import express from "express"
import { getAllTours, getTour, createTour, updateTour, deleteTour, checkId, checkBody } from "../controllers/tourControllers.js"


const router = express.Router()

router.param("id", checkId)

router
.route("/")
.get(getAllTours)
.post(checkBody,createTour)

router
.route("/:id")
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

export default router