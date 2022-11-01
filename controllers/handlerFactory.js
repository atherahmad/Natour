import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";


export const factoryDeleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) { // if tour is false. means tour value "null" is not a truthy value. --> false
      return next(new AppError("No document found with that ID", 404)) // we need return, because we want to end the circle and not res.status(responding) the tour with false ID to the client. (user)
    }

    res.status(204).json({
      // statuscode 204 = no content
      status: 'success',
      data: null,
    });
});

export const factoryCreateOne = Model => catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body) // this is shorthand for belows code
    // const tour = req.body
    // const newTour = new Tour(tour)
    // await newTour.save()
    res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc
    },
    })
}) 

export const factoryUpdateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!doc) { // if tour is false. means tour value "null" is not a truthy value. --> false
      return next(new AppError("No document found with that ID", 404)) // we need return, because we want to end the circle and not udating th tour with wrong ID given by user
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc: doc
      },
    });
});


