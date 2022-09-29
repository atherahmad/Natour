import express from "express"
import morgan from "morgan"
import tourRouter from "./routes/tourRoutes.js"
import userRouter from "./routes/userRoutes.js"
import path from "path"

const __dirname = path.resolve()

const app = express()

// 1. MIDDLEWARE (express build in middleware)
app.use(morgan("dev")) // third party middleware "morgan". http request logger. see more on express website/ressources/middleware
app.use(express.json())
app.use(express.static(`${__dirname}/public`)) // when we type now in our browser 127.0.0.1:3000/overview.html we can see our html file dislayed in te browser. We can do that with all our static files 
// Creating our own middleware function!:
app.use((req,res,next) => {
    console.log("Hello from the middleware!");
    next()
})
 // requesttime for every request added to the request object as a key.
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next()
})

// 3. ROUTES:
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

export default app