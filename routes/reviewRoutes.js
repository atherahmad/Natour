import express, { application } from "express"
import { getAllReviews, createReview, getReview, updateReview, deleteReview, setTourAndUserIds } from "../controllers/reviewController.js"

import { protect, restrictTo } from "../controllers/authController.js"

const router = express.Router({mergeParams: true}) // by passing in as options {mergeParams:true} we merge the params and get access to the tourId
// POST /tour/234fsa/reviews => nested route
// GET /tour/234fsa/reviews/154515 => nested route
// POST /reviews
// these routes will go in the belows handler.

router.use(protect) // we need to have Authorization in Postman with bearer Token for every route below which should be protected

router
.route("/")
.get(getAllReviews)
.post(restrictTo("user"), setTourAndUserIds, createReview)


router
.route("/:id")
.get(getReview)
.patch(restrictTo("user", "admin"), updateReview) // we want just admins and users to write reviews. guides and lead-guides are not allowed to write reviews.
.delete(restrictTo("user", "admin"), deleteReview)

export default router