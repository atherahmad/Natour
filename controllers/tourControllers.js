import Tour from '../models/tour.js';


// FILTERING WITH QUERIES
// 1. WAY
// const tours = await Tour.find({
// duration: 5,
// difficulty: "easy"
// })

// 2. WAY - with mongoose query methods
// const query = Tour.find()
// .where("duration")
// .equals(5) // you can use here lt, gt etc.
// .where("difficulty")
// .equals("easy")

export const getAllTours = async (req, res, next) => {
  try {
    console.log(req.query);
    // BUILD QUERY
    // 1) Filtering
    const queryObj = {...req.query} // destructering the fields (key/value pairs) out of the query object
    const excludedFields = ["page","sort","limit","fields"]
    excludedFields.forEach(item => delete queryObj[item]) // forEach loops over excludedFields array and applies delete method on all the elements in queryObj which are fitting with the elements inside excludedFIelds
    // console.log(req.query, queryObj); // inside our req object is the query object located which saves the params

    // 2) Advanced Filtering
    // example of our query String --> 127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500 ==> is saved in req.query = { difficulty: 'easy', duration: { gte: '5' }, price: { lt: '1500' } }
    // { difficulty: "easy", duration: {$gte: 5}} thats how we would manually write the filter object in mongodb/mongosh
    // { difficulty: 'easy', duration: { gte: '5' } } thats what our console.log(req.query) gives us. ==> we need to add "$" before our operators gte, lt, etc.
    // gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj) // we convert our JS object to a string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) // using regular expression to find one of the words (gte, gt, lte, lt). "\b" means we match the exact words. the "g" means we are replacing not just the first match. The second argument is a callback where we want to replace our match with ${match}, like you see above
    console.log(JSON.parse(queryStr));
   
    const query = Tour.find(JSON.parse(queryStr))

    // EXECUTE QUERY
    const tours = await query

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
  // console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1; // this is calculating an id for the new tour we want to create. (first we had 9 tours, now we have 10 for example)
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // const newTour = { id: newId, ...req.body }; // Object.assign is merging 2 objects together. Our req.body from the client site and we add the newId to it.

  // tours.push(newTour); // We add now our new created newTour object into our tours variable, which is an array of objects. (already hold 9 tours, now 10)

  // now we are adding the tour into our tours-simple.json file. We need to convert our js object into a JSON.string first.
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   // eslint-disable-next-line no-unused-vars
  //   (err) => {
  //     res.status(201).json({
  //       // status 201 means new created data (new tour added)
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
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
