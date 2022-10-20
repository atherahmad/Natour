import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
        trim: true
      },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        validate: [validator.isEmail, "Email is not valid"],
        unique: true,
        trim: true,
        lowercase: true
      },
    photo: String,
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 8,
        select: false // we dont want to show the password to the client. We just want to store it in the DB
      },
    confirmPassword: {
        type: String,
        required: [true, "Confirm your password"],
        validate: {
          // this only works on CREATE and SAVE!!!
          validator: function(val) { // validation function return always true or false(error) --> if its false we get a validationError
            return val === this.password
          },
          message: "password must be the same"
        }
      }
})

// ENCRYPTION OF THE PASSWORDS: this function applies before the document gets saved to the DB --> we need to install extra package "bcryptjs"
// thats the way to store users passwords in a secure way to our DB
userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) { // "isModified" is a mongoose method. You need to pass the field of the model which gets updated. (password) --> if the password didnt get modified the execution goes on to the next middleware.
    return next()

  } else {
    this.password = await bcrypt.hash(this.password, 12) // here we encrypt (hash) the current documents password with a cost of 12. its like adding additional string to the password.
    this.confirmPassword = undefined // the confirmPassword field wont be saved to the DB
    next()
  }
})

// INSTANCE METHOD: available on all Documents of a certain Collection.
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return  await bcrypt.compare(candidatePassword, userPassword) // this.password is not available in the output due to select: false in the model. bcrypt.compare() returns true if passwords are the same or false if not.
}

// creating a Model out of it: Model variables always wih capital Letter.
const User = mongoose.model("User",userSchema)

export default User