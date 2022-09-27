const express = require("express")
const fs = require("fs")
const morgan = require("morgan")

const app = express()

// 1. MIDDLEWARE
app.use(morgan("dev")) // third party middleware "morgan". http request logger. see more on express website/ressources/middleware

app.use(express.json())

// Creating our own middleware function!:
app.use((req,res,next) => {
    console.log("Hello from the middleware!");
    next()
})
 // requesttime for every request added to the request object as a key.
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next()
})

const port = 3000

// reading the tours-simple.json file and converting it to js object. saved in tours.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))



// 2. ROUTEHANDLER FUNCTIONS:
const getAllTours = (req,res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: tours.length, // just do this when you sned an array with multiple objects inside
        data: {
            tours
        }
    })
}

const getTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1 // this is a trick which converts automatically a string to a number, whne it gets multiplied with a number.
    const tour = tours.filter(item => item.id === id) // filters the object with the fitting id property from the array and returns it.

    // if id is bigger then tours.length (objects inside), this tour is not existing.
    if(tours.length < id) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    // we read this object with the fitting id to the client.
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

const createTour = (req,res) => {
    // console.log(req.body);
    const newId = tours[tours.length -1].id +1 // this is calculating an id for the new tour we want to create. (first we had 9 tours, now we have 10 for example)
    const newTour = Object.assign({id: newId}, req.body) // Object.assign is mergin 2 objects together. Our req.body from the client site and we add the newId to it.

    tours.push(newTour); // We add now our new created newTour object into our tours variable, which is an array of objects. (already hold 9 tours, now 10)

    // now we are adding the tour into our tours-simple.json file. We need to convert our js object into a JSON.string first.
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({ // śtatus 201 means new created data (new tour added)
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req,res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    res.status(200).json({
        status:"success",
        data: {
            tour: "<updated tour here >"
        }
    })
}

const deleteTour = (req,res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    res.status(204).json({ // statuscode 204 = no content
        status:"success",
        data: null
    })
}

// 3. ROUTES
// we can chain the above showed get,post,delete,patch etc. methods if they have the same route. 
app
.route("/api/v1/tours")
.get(getAllTours)
.post(createTour)

app
.route("/api/v1/tours/:id")
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

// 4. START SERVER
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})

