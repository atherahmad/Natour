import mongoose from "mongoose"

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "A review can not be empty"],
        trim: true
      },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // PARENT REFERENCING
    tour: { // now every Review knows for which tour document this review is for. 
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"]
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)


// middleware for manipulating query before find() executes.
reviewSchema.pre(/^find/, function(next) {
    this.populate({ // populate(fieldName) // we fill the field guide with the actual data instead of just showing the id of the users. we replace the id with the users data.
      path: "tour user", // field we want to update
      select: "name photo" // which fields we want to exclude
    })
    next()
  })

// creating a Model out of it: Model variables always wih capital Letter.
const Review = mongoose.model("Review",reviewSchema)

export default Review