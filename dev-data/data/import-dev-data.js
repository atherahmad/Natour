import mongoose from "mongoose"
import dotenv from "dotenv"
import fs from "fs"
import Tour from "../../models/tour.js";
import path from "path"

dotenv.config({path: "./config.env"})

const __dirname = path.resolve()

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

// connection to hosted ATLAS database again. This time not listening to our port.
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => 
 console.log(`DB connected successfully`))
.catch((err) => {
  console.log(`${err} dit not connect...`);
})

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"))


// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours) // accepts the array of objects "tours", which is our json data "tors-simple.json". And creates for every object an object in our db collection
        console.log("Data successfully loaded");
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Data successfully deleted");
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

// conditioning for import and delete
if (process.argv[2] === "--import") {
    importData()
} else if (process.argv[2] === "--delete") {
    deleteData()
}

console.log(process.argv);

// run "node dev-data/data/import-dev-data.js" to start DB. in Terminal to see the console.log(process.argv)
// node dev-data/data/import-dev-data.js --import (for creating option String "--import" into the process.argv array, on the index 2 is "--import") --> imports the json file converted to js objects into tours collection.
// node dev-data/data/import-dev-data.js --delete (for creating option String "--delete" into the process.argv array, on the index 2 is "--delete") --> deletes all documents inside the collection tours
//