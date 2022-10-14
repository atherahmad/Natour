import Tour from '../models/tour.js';
import APIFeatures from '../utils/apiFeatures.js';

// ALIASING : we can manipulate the req.query object before we will use it in getAllTours
export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,summary,difficulty"
  next()
}

export const getAllTours = async (req, res, next) => {
  try {
    console.log(req.query);

    // EXECUTE QUERY: here we can just delete one of the methods if we dont want to apply them.
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

    const tours = await features.query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length, // just do this if you read an array with multiple objects inside.
      data: {
        tours
      },
    });
  } catch (error) {
    next(error)
  }
};

export const getTour = async (req, res, next) => {
  try {
    // const id = req.params.id * 1; // this is a trick which converts automatically a string to a number, when it gets multiplied with a number.
  // const tour = tours.filter((item) => item.id === id); // filters the object with the fitting id property from the array and returns it.
    const tour = await Tour.findById(req.params.id) // shorthand for belows code
    // Tour.findOne({ _id: req.params.id}) ---> this works the same like above

  // we read this object with the fitting id to the client.
    res.status(200).json({
    status: 'success',
    data: {
      tour
    },
  });
  } catch (error) {
      next(error)
  }
} 

export const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body) // this is shorthand for belows code
    // const tour = req.body
    // const newTour = new Tour(tour)
    // await newTour.save()
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
    },
    })
  } catch (error){
    // res.status(409).json({
    //   msg: error.message
    // })
    next(error)
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      },
    });
  } catch (error) {
    next(error)
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      // statuscode 204 = no content
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error)
  }
};
