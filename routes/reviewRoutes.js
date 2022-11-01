import express from "express"
import { getAllReviews, createReview, getReview, updateReview, deleteReview, setTourAndUserIds } from "../controllers/reviewController.js"

import { protect, restrictTo } from "../controllers/authController.js"

const router = express.Router({mergeParams: true}) // by passing in as options {mergeParams:true} we merge the params and get access to the tourId
// POST /tour/234fsa/reviews => nested route
// GET /tour/234fsa/reviews/154515 => nested route
// POST /reviews
// these routes will go in the belows handler.
router
.route("/")
.get(getAllReviews)
.post(protect, restrictTo("user"),setTourAndUserIds, createReview)


router
.route("/:id")
.get(getReview)
.patch(updateReview)
.delete(deleteReview)

export default router