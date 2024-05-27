import {User} from "../models/user_model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = async (req, res) => {
    try {
        //get user detail from frontend
        const {username,email,fullName,password} = req.body;


        //validation-not empty or correct format
        if([fullName, email, password, username].some((field)=>
        field?.trim() ==="")){
            throw new Error("field is required");
        }
        //user already exist- email unique/username
        const existedUser =await User.findOne({
            $or: [{username}, {email}]
        })
        if(existedUser){
            throw new Error("User already existed");
        }

        // console.log(req.files);
        // Extract file paths for avatar and cover image from request
        const avatarLocalpath = req.files?.avatar[0]?.path;
        const coverLocalpath = req.files?.coverImage[0]?.path;


        if(!avatarLocalpath){
            throw new Error("upload the avatar image");
        }

        //save data in claudinary 
        const avatar = await uploadOnCloudinary(avatarLocalpath);
        const cover = await uploadOnCloudinary(coverLocalpath);

        if(!avatar){
            throw new Error("Avatar image required");
        }

        

        //create user object -create entry in db
        const userdata = await User.create({
            fullName,
            avatar: avatar.url,
            coverimage:cover.url|| "",
            email,
            password,
            username:username.toLowerCase()
        })
        //remove the password and refresh token from response

        const createdUser = await  User.findById(User._id).select(
            "-password -refereshToken"
        );
        // save to database

        if(!createdUser){
            throw new Error("Somthing went wring while registing user");
        }
        //return response

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User created Successfully")
        )
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};








const loginUser = async(req,res)=>{
    try {
        res.status(200).json({
            message:"Login Successful"
        })
            
    } catch (error) {
        console.log("login failed");
        res.status(501).json({
            error:"login failed"
        })
    }
}


export {registerUser,loginUser};