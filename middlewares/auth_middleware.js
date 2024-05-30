import jwt from "jsonwebtoken";
import {User} from "../models/user_model.js";


export const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    
        if(!token){
            throw new Error("Unauthorized access");
        }
    
        const decodeToken = jwt.verify(token, process.env.Access_token_secret);
        const user = User.findById(decodeToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new Error("Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(405).json({
            error:"Invalid token"
        })
    }
}