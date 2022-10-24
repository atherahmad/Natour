import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";
import {promisify} from "util"; // util is a build in Object of Node.js. We destructure the method promisify from it to use it in our Verification below
import crypto from "crypto"


const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN // we add an object as the option, that the JWT expires after 90 days
    })
}

// SIGN UP
export const signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body)
    // due to security reasons we need to replace above code with following code: We only allow the data we actually need to be saved in the new user in our DB. Even when a user tries to manually add a "role: admin". It wont be stored in the user
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role
    })

    // JWT - Login Users with secure JWT
    // for authentification we install the package "jsonwebtoken"
    // documentation on github. We can use jwt methods like (sign, verify, etc)
    const token = signToken(newUser._id) // --> the object "{id: newUser._id}" is the payload which we add to our JWT. Second parameter is our "secret" with at least 32 characters. We store it in config.env. third parameter is an additional option. The "JWT Header "will be added automatically from JWT package.
    // we can use the debugger on "jwt.io" to look at our token.(Header,Payload,Secret)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        },
    })
})

// LOGIN
export const login = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const {email, password} = req.body

    // 1) Check if email and password exist
    if(!email || !password) {
        return next(new AppError("Please provide email and password!", 400)) // we use return because we want to stop the login function right away if there is no password or email provided by the client (user). without return our application would send a response to the client from the error AND from our res.json. We can just send one response.
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select("+password") // --> its short for {email: email} -- this looks in our DB if the email is existing and if the password is correct. .select("+password") means --> we excluded in our model User the password. Thats why we have to add it here again to have access.
    console.log(user);
    // "test1234" === '$2a$12$im0/kJn2OSC4raVqxJb5k.RYJhQmkiome6pL9A4PQcg4wqIAHSuvm' --> we need to compare the encrypted password in DB with users typed in password. To solve this we need to encrypt the users password too in our User model with bcrypt package

    if(!user || !(await user.correctPassword(password, user.password))) { // if theres no user with the given email or the password is not the same --> execute the error and stop the process. // return true if they are same, false if not (password, user.password)
        return next(new AppError("Incorrect email or password!", 401))
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
})

// PROTECT ROUTES FOR LOGGED IN USERS:
export const protect = catchAsync(async(req, res, next) => {
    // 1) Getting the token and check if its exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { // if header exists and the String starts with "Bearer". Common practice to use authorization: "Bearer token......." for header in postman. You get access to it with "req.headers.authorization"
        token = req.headers.authorization.split(" ")[1] // saves the tokenString into token variable
    }
    // console.log(token);

    if (!token) {
        return next(new AppError("You are not logged in! Please login to get access.", 401))
    }

    // 2) Validate the token - VERIFICATION
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET) // jwt.verify(tokenString, secret, callback) the callback runs as soon as the verification has completed. its an async function.
    console.log(decoded); // we can see that te if in our DB is the same with the id of the user, who logged in with his JWT. In JWT is the _id saved in the payload.

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id) // it checks if the id, which was send with the token, is still existing in our DB.
    if (!currentUser) {
        return next(new AppError("The user belonging to this token does no longer exist.", 401))
    }

    // 4) Check if user changed password after the token was created
    if (currentUser.changedPasswordAfter(decoded.iat)) { // if its true, so the password was changed after login in (creation of the token). The Error gets send to the client.
        return next(new AppError("User recently changed the password! Please log in again.", 401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE - next goes to the routeHandler "getAllTours"
    req.user = currentUser
    next()
})

// This function just gives permission for users with role "admin" or "lead-guide" to access the next middleware "deleteTour".
export const restrictTo = (...roles) => {
    return (req, res, next) => { // this middleware function has access to the roles, which are given in as parameter in "tourRoutes.js" due to the closure.
        // roles ["admin", "lead-guide"]. role = "user"
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform that action", 403))
        }
        next()
    }
}

// FORGOT PASSWORD
// provide email address, than you got en Email with a link inside where you click on. This click leads you to another website, where you can change (update) your password.
export const forgotPassword = catchAsync(async (req, res, next) => {

    // 1) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return next(new AppError("There is no user with this email address.", 404))
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false}) // this deactivate all the validators which we specified in our user schema. We add this property to our current user. And we save the encrypted string to our DB

    // 3) Send it to users email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didnt forget your password, please ignore this email!` // "\n" means new line.

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)", // We send email to "user.email" with Betreff "Your password reset token(valid for 10 min)" and message "Forgot your password? Submit a PATCH.... etc"
            message
        })
    
        res.status(200).json({
            status: "success",
            message: "Token sent to email!"
        })
    } catch(err) {
        user.createPasswordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError("There was an error sending the email. Try again later!", 500))
    }
})
    

// RESET PASSWORD
export const resetPassword = catchAsync(async(req, res, next) => {

    // 1) get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex") // its req.params.token because we defined the route in userRoutes.js like that.

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}}) // we check if the expiring Date of the token is still greater then the current time. (still valid)

    // 2) If token has not expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError("Token is invalid or has expired!", 400))
    }

    // here we are updating the current user objects properties like password,confirmPassword, passwordResetToken, passwordResetExpires and save it
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // 3) Update passwordChangedAt property for the user
    // we do this in our user model as a pre save middleware!
    
    // 4) Log the user in, send JWT
    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
})