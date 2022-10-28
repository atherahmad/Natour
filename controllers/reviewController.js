import Review from '../models/review.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';


export const getAllReviews = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY: here we can just delete one of the methods if we dont want to apply them.
    const reviews = await Review.find()

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


export const createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
    },
    })
}) 

export const updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!review) {
      return next(new AppError("No review found with that ID", 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        review: review
      },
    });
});

export const deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) { // if tour is false. means tour value "null" is not a truthy value. --> false
      return next(new AppError("No review found with that ID", 404)) // we need return, because we want to end the circle and not res.status(responding) the tour with false ID to the client. (user)
    }

    res.status(204).json({
      // statuscode 204 = no content
      status: 'success',
      data: null,
    });
});