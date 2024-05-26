import express  from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin:process.env.Cors_origin,
    Credential:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import userRouter from "../routes/user_route.js";

//declaration
app.use("/users", userRouter);

export {app}