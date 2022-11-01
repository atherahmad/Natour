import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {factoryCreateOne, factoryDeleteOne, factoryGetAll, factoryGetOne, factoryUpdateOne} from "./handlerFactory.js"

// we use this function in our updateCurrentUserData function
const filterObj = (obj, ...allowedFields) => { // ...allowedFields = ["name", "email"] ; obj = req.body
  const newObj = {}
  Object.keys(obj).forEach(item => { // Object.keys(obj) = [array of fieldnames of the passed "obj"] -_> which is req.body. We loop through the fields of req.body and check, if its one of the "allowedFields"
    if (allowedFields.includes(item)) { // we store the fitting "allowedFields" of the array of fieldnames inside our empty Object "newObj" and return it
      newObj[item] = obj[item]
    }
  })
  return newObj
}

export const getAllUsers = factoryGetAll(User)
// catchAsync(async (req, res, next) => {
//     const users = await User.find()
//     res.status(200).json({
//       status: 'success',
//       results: users.length,
//       data: {
//         users
//       },
//     });
// });

export const updateCurrentUserData = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword.", 400))
  }

  // 2) Filtered out unwanted field names of the req.body object that are not allowed to be updated!
  const filteredBody = filterObj(req.body, "name", "email")
  console.log(filteredBody);

  // 3) Update user document
  // we are not passing as the second parameter req.body because we dont want to allow the user to update every field. for example:
  // body.role: "admin" --> user gives himself the role admin and got now the authority to delete and update tours, which could be crucial.
  // thats why we use "filteredBody" which only contains name and email
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { // we can use findByIdAndUpdate because we are not updating password or Email, where we have and need our validation. 
    new: true, // returns the updated object instead of the old one
    runValidators: true // we want to still run our validators
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  })
})

// delete current User (setting field "active" to false)
export const deleteCurrentUser = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false}) // this only works for logged in users (protect). The id of the currentUser is stored inside the req.user.id. We are also not deleting the document, we are setting the field "active" to false.

  res.status(204).json({ // 204 for deleted
    status: "success",
    data: null
  })
})

export const getUser = factoryGetOne(User)
// catchAsync(async (req, res, next) => {
//     const user = await User.findById(req.params.id) // shorthand for belows code
//     // User.findOne({ _id: req.params.id}) ---> this works the same like above

//   // we read this object with the fitting id to the client.
//     res.status(200).json({
//     status: 'success',
//     data: {
//       user
//     },
//   });
// });

export const createUser = (req, res) => {
  res.status(500).json({
          status: 'error',
          message: "this route is not defined! Please use /signup instead"
        })
}
// catchAsync(async (req, res, next) => {
//     const newUser = await User.create(req.body) // this is shorthand for belows code
//     // const user = req.body
//     // const newUser = new User(user)
//     // await newUser.save()
//     res.status(201).json({
//       status: 'error',
//       message: "this route is not defined! Please use /signup instead"
//     })
// });

// Do NOT update passwords with this!
export const updateUser = factoryUpdateOne(User)
// catchAsync(async (req, res, next) => {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     })
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: user
//       },
//     });
// });

export const deleteUser = factoryDeleteOne(User)
// catchAsync(async (req, res, next) => {
//     await User.findByIdAndDelete(req.params.id)
//     res.status(204).json({
//       // statuscode 204 = no content
//       status: 'success',
//       data: null,
//     });
// });
