import Tour from "../models/tour.js"
import { catchAsync } from "../utils/catchAsync.js"
import AppError from "../utils/appError.js"


export const getOverview = catchAsync(async(req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find()
    // 2) Build pug template

    // 3) Render that template using tour data from 1)
    res.status(200).render("overview", { // we render the overview.pug on route /overview and create local pug variable "title"
      title: "All Tours",
      tours
    })
})


export const getTour = catchAsync(async(req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: "reviews",
        fields: "review rating user"
    })
    if (!tour) {
      return next(new AppError("There is no tour with that name.", 404)) // we pass in the 2 parameter we declared in "appError.js". The error message we want to create and the statusCode
    }
    res.status(200)
    .render("tour", { // we render the overview.pug on route /overview and create local pug variable "title"
      title: `${tour.name} Tour`,
      tour
    })
  })



  // LOGIN
export const getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: "Log into your account"
    })
}

// See your account
export const getAccount = (req, res) => {
    res.status(200).render('account', { // we render the pug template "account.pug" with local variable title, user (we saved the currentUser in "protect" middleware on the req.user = currentUser and res.locals.user = currentUser) So we have access in our pug templates to the current Users data.
      title: "Your account"
  })
}