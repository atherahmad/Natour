import fs from "fs"
import path from "path"

const __dirname = path.resolve()

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// this middleware checks the id on every request on this route
export const checkId = (req,res,next,value) => {
    console.log(`Tour id is ${value}`);
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }
    next()
}

export const checkBody = (req, res, next) => {
    console.log("test");
    if(!req.body.name || !req.body.price) {
        return (
            res.status(400).json({
                status: "fail",
                message: "Missing name or price"
            })
        )
    }
    next()
}

export const getAllTours = (req,res) => {
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: tours.length, // just do this when you sned an array with multiple objects inside
        data: {
            tours
        }
    })
}

export const getTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1 // this is a trick which converts automatically a string to a number, whne it gets multiplied with a number.
    const tour = tours.filter(item => item.id === id) // filters the object with the fitting id property from the array and returns it.
    
    // we read this object with the fitting id to the client.
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

export const createTour = (req,res) => {
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

export const updateTour = (req,res) => {
    res.status(200).json({
        status:"success",
        data: {
            tour: "<updated tour here >"
        }
    })
}

export const deleteTour = (req,res) => {
    res.status(204).json({ // statuscode 204 = no content
        status:"success",
        data: null
    })
}