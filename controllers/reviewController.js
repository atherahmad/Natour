import Review from '../models/review.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {factoryDeleteOne, factoryCreateOne, factoryUpdateOne }from "./handlerFactory.js"


export const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {} // we create a filter object which we pass in our find method, if we have a route with tourI in params. (create Review on tour/get reviews on tour)
    if (req.params.tourId) filter = {tour: req.params.tourId}
    // EXECUTE QUERY: here we can just delete one of the methods if we dont want to apply them.
    const reviews = await Review.find(filter)

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: reviews.length, // just do this if you read an array with multiple objects inside.
      data: {
        reviews
      },
    });
});

export const getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
   
    if (!review) {
      return next(new AppError("No tour found with that ID", 404))
    }

  // we read this object with the fitting id to the client.
    res.status(200).json({
    status: 'success',
    data: {
      review
    },
  });
})


export const createReview = factoryCreateOne(Review)
// catchAsync(async (req, res, next) => {
// // Allow nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId // we automatically fill the field inside review model with the current req.params.tourId
//     if (!req.body.user) req.body.user = req.user.id // the current user is saved on the req object according to our protect middleware. We fill the id automatically in our field in review model

//     const newReview = await Review.create(req.body)

//     res.status(201).json({
//       status: 'success',
//       data: {
//         review: newReview
//     },
//     })
// }) 

export const updateReview = factoryUpdateOne(Review)
// catchAsync(async (req, res, next) => {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     })

//     if (!review) {
//       return next(new AppError("No review found with that ID", 404))
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         review: review
//       },
//     });
// });

export const deleteReview = factoryDeleteOne(Review)
// catchAsync(async (req, res, next) => {
//     const review = await Review.findByIdAndDelete(req.params.id)

//     if (!review) { // if tour is false. means tour value "null" is not a truthy value. --> false
//       return next(new AppError("No review found with that ID", 404)) // we need return, because we want to end the circle and not res.status(responding) the tour with false ID to the client. (user)
//     }

//     res.status(204).json({
//       // statuscode 204 = no content
//       status: 'success',
//       data: null,
//     });
// });