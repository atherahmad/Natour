import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"

export const signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body)
    // due to security reasons we need to replace above code with following code: We only allow the data we actually need to be saved in the new user in our DB. Even when a user tries to manually add a "role: admin". It wont be stored in the user
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    // JWT - Login Users with secure JWT
    // for authentification we install the package "jsonwebtoken"
    // documentation on github. We can use jwt methods like (sign, veryfy, etc)
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN // we add an object as the option, that the JWT expires after 90 days
    }) // --> the object "{id: newUser._id}" is the payload which we add to our JWT. Second parameter is our "secret" with at least 32 characters. We store it in config.env. third parameter is an additional option. The "JWT Header "will be added automatically from JWT package.
    // we can use the debugger on "jwt.io" to look at our token.(Header,Payload,Secret)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        },
    })
})

