import User from "../models/user.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({
      status: 'success',
      data: {
        users
      },
    });
  } catch (error) {
    next(error)
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id) // shorthand for belows code
    // User.findOne({ _id: req.params.id}) ---> this works the same like above

  // we read this object with the fitting id to the client.
    res.status(200).json({
    status: 'success',
    data: {
      user
    },
  });
  } catch (error) {
      next(error)
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body) // this is shorthand for belows code
    // const user = req.body
    // const newUser = new User(user)
    // await newUser.save()
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
    },
    })
  } catch (error) {
    next(error)
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        user: user
      },
    });
  } catch (error) {
    next(error)
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json({
      // statuscode 204 = no content
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error)
  }
};
