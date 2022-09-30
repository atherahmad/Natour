import app from "./app.js"
import express from "express"


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})

// USE "NPM START" in terminal to run the server. We changed the script in package.json from test to start with value "nodemon server.js"