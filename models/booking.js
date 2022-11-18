import mongoose from "mongoose"

const bookingSchema = mongoose.Schema({
    // using PARENT REFERENCING for keeping reference to the tour and user who booked the tour.
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour", // referencing the model
        required: [true, "Booking must belong to a Tour!"]
    },
    // same for user
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Booking must belong to a User!"]
    },
    price: {
        type: Number,
        required: [true, "Booking must have a price."]
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
}
)

// PRE MIDDLEWARE QUERY hook
// We want to populate the complete user fields and the tour field name.
bookingSchema.pre(/^find/, function(next) { // for every query which starts with "find", we want to polulate inside our booking document the complete referenced user and the tour name.
    this.populate("user").populate({
        path: "tour",
        select: "name"
    })
})

// creating a Model out of it: Model variables always wih capital Letter.
const Booking = mongoose.model("Booking",bookingSchema)



export default Booking