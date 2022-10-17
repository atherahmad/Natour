import mongoose from "mongoose"
import slugify from "slugify"

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
      },
      slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, // will remove all the white place in the end und beginning when the user is typing in
      required: [true, "A tour must have a description"]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false // we can exclude fields in the model Schema like this
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
)

// defining virtual properties which are not stored in the Database.
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7 
})

// Mongoose Middleware (1.Document middleware, 2.Query middleware, 3.Aggregate middleware)
// DOCUMENT MIDDLEWARE: this function will be called before a document will be saved to the Database (.save() .create())
// in "this" we have access to the current document which is processed
// "save" is called "hook" and the whole middleware is called "pre save hook"
tourSchema.pre("save", function(next) {
  // console.log(this);
  this.slug = slugify(this.name, {lower: true}) // slug creates a string based of the current processed documents "name" field
  next()
})

// tourSchema.pre("save", function(next) {
//   console.log("Will save document...");
//   next()
// })

// // post middleware functions are executed after all pre middleware has been completed
// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next()
// })


// QUERY MIDDLEWARE: "pre find hook". Middleware which runs before any "find()" query is executed. Here we have access to the current query-object and not the current document with using "this"!
tourSchema.pre(/^find/, function(next) { // this regular expression targets all strings which are start with "find". We do this because in our middleware, where we want to findByID we use the "findOne" method. When we use this we dont want to find our secret Tour. This regular expression includes the findOn method.
  // tourSchema.pre("find", function(next) {
  this.find({secretTour: {$ne: true}})
  this.start = Date.now()
  next()
})

// the post query (find) middleware runs after the query is executed. thats why it has access to the processed documents of the query
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next()
})

// AGGREGATION MIDDLEWARE -  "this" points to the current aggregation-object
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}}) // unshift is adding an element at the beginning of an array. {$match: {secretTour: {$ne: true}}} removes all the documents where secretTour is set to "true". This means it excludes our secretTour in our aggregation pipeline.
  console.log(this.pipeline());
  next()
})

// creating a Model out of it: Model variables always wih capital Letter.
const Tour = mongoose.model("Tour",tourSchema)

export default Tour