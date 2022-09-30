import express from "express"
import morgan from "morgan"
import tourRouter from "./routes/tourRoutes.js"
import userRouter from "./routes/userRoutes.js"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

const __dirname = path.resolve()

const app = express()

// 1. MIDDLEWARE (express build in middleware) We just want to use morgan middleware when we are in development, not in production.
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")) 
}

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