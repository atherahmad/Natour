/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from "./utils/appError.js"
import {globalErrorHandler} from "./controllers/errorController.js"
import rateLimit from "express-rate-limit"

dotenv.config({ path: './config.env' });

const __dirname = path.resolve();

const app = express();

// GLOBAL MIDDLEWARE 
if (process.env.NODE_ENV === 'development') { // - We just want to use morgan middleware when we are in development, not in production.
  app.use(morgan('dev'));
}

// install express-rate-limit package for limiting requests from an IP using the function rateLimit()
const limiter = rateLimit({
  max: 100, // count of requests limited
  windowMs: 60 * 60 * 1000, // this allows 100 requests from the same IP in 60 minutes
  message: "Too many requests from this IP, please try again in an hour!"
})
app.use("/api", limiter) // we just want to apply our limiter middleware for routes which start with "/api". When we restart our application (save), the limit resets

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // when we type now in our browser 127.0.0.1:3000/overview.html we can see our html file displayed in te browser. We can do that with all our static files

// request time for every request added to the request object as a key.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3. ROUTES:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// ERROR HANDLING:
// "all" means all http methods (get,post,delete, etc). "*" means all routes.
// this middleware should be always at the end of the call-stack. This middleware will never be reached, if the route is defined.
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404)) // when we pass in the error, the next will skip all the other middleware in the stack and goes to the next error middleware
})

// Jonas global error handler:
// by implementing 4 arguments (parameters) express knows, that this is a global error handling middleware
app.use(globalErrorHandler)

// Dilshod global error handler:
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });


export default app;
