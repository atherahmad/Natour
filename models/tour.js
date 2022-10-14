import mongoose from "mongoose"

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
      },
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
    startDates: [Date]
})

// creating a Model out of it: Model variables always wih capital Letter.
const Tour = mongoose.model("Tour",tourSchema)

export default Tour