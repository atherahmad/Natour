import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"]
      },
    email: {
        type: String,
        required: [true, "A user must have an email"]
      },
    role: {
        type: String,
        required: [true, "A user must have a role"],
        default: "user"
      },
    active: {
        type: Boolean,
        required: [true],
        default: true
      },
    photo: {
        type: String,
        required: [true, "A user must have a photo"],
      },
    password: {
        type: String,
        required: [true, "A user must have a password"],
      },
})

// creating a Model out of it: Model variables always wih capital Letter.
const User = mongoose.model("User",userSchema)

export default User