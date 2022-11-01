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
// we dont want to populate the tour in the reviews, thats why we delete it from "path: user tour". Now we will just see the id of the tour. But not the whole tour populated.
reviewSchema.pre(/^find/, function(next) {
    this.populate({ // populate(fieldName) // we fill the field guide with the actual data instead of just showing the id of the users. we replace the id with the users data.
      path: "user", // field we want to update
      select: "name photo" // which fields we want to include
    })
    next()
  })

// creating a Model out of it: Model variables always wih capital Letter.
const Review = mongoose.model("Review",reviewSchema)

export default Review

// POST /tour/234fsa/reviews => nested route
// GET /tour/234fsa/reviews
// POST /tour/234fsa/reviews/9784cdcdc