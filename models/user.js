import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import crypto from "crypto"

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
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user"
    },
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
      },
    // security
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
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

// INSTANCE METHOD: 
// available on all Documents of a certain Collection.
// checks if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return  await bcrypt.compare(candidatePassword, userPassword) // this.password is not available in the output due to select: false in the model. bcrypt.compare() returns true if passwords are the same or false if not.
}

// checks if password was changed after creating token (login) JWTtimestamp
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp // 100 < 200 (JWTTimestamp = time when the token was created; changedTimestamp = time when the password was changed)
  }

  // false means password not changed
  return false
}

// Reset the JWT Token
// import crypto (build in module of node.js)
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex") // this is creating a new "secret" (32 character string) Like we already stored in our config.env file.

  // we need to encrypt our reseted token for security reasons
  // sha256 is an algorythm
  // update our 32 character String encrypted.
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // for 10 minutes, for seconds, for milli-seconds --> new reset token expires after 10 minutes!

  return resetToken
}


// creating a Model out of it: Model variables always wih capital Letter.
const User = mongoose.model("User",userSchema)

export default User