import AppError from "../utils/appError.js"

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.` // path and value are saved in the error object automatically as properties.
    return new AppError(message, 400)
}


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      })
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client (if the user input invalid data, wants to visit a route which does not exist, etc.)
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
          })
    
    // Programming or other unknown error: dont leak error details to the client (user)
    } else {
        // 1) Log error
        console.error("ERROR", err);
        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        })
    }
    
}

export const globalErrorHandler = (err, req, res, next) => {
//   console.log(err.stack);
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    // here we want to show the error in a different way, when we are in development or production mode. We declared that in our config.env and script in package.json
    if(process.env.NODE_ENV === "development") {
        console.log(err.name);
        sendErrorDev(err, res)

    } else if (process.env.NODE_ENV === "production") {
        let {name} = err
        console.log(err);

        if(name === "CastError") {
            err = handleCastErrorDB(err)
        }
        sendErrorProd(err, res)
    }
  }