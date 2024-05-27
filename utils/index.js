import { app } from "./app.js";
import { mongodbConnection } from "../db/connection.js";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

const port = process.env.port ;

// Connect to MongoDB
mongodbConnection(process.env.MONGO_URL);

// Start Express server
app.listen(port, () => {
    console.log("App is listening on port", port);
});



