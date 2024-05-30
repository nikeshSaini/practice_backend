import {User} from "../models/user_model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/api_response.js";

const generatedAccessandRefreshToken = async(userId)=>{
    try {
        let user = await User.findById(userId);
        let accessToken = await user.generateAccessToken();
        let refereshToken = await user.generateRefreshToken();
        user.refereshToken = refereshToken;
        await user.save({validateBeforeSave: false});


        return {accessToken , refereshToken};
    } catch (error) {
        throw new Error(error.message);

    }
}


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
        let coverLocalpath;

        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverLocalpath = req.files.coverImage[0].path;
        }
        // const coverLocalpath = req.files?.coverImage[0]?.path;


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
            coverImage: cover && cover.url ? cover.url : "",
            email,
            password,
            username:username.toLowerCase()
        })
        //remove the password and refresh token from response

        const createdUser = await  User.findById(userdata._id).select(
            "-password -refereshToken"
        );
        // save to database

        if(!createdUser){
            throw new Error("Somthing went wrong while registing user");
        }
        //return response

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User created Successfully")
        )
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message  // Send only the error message
        });
    }
    
};


const loginUser = async(req,res)=>{
    try {
        //req.body
        //checking the email 
        //checking the email if present
        // than check pass 
        //creating the jwt  and referesh token generate
        // both valid then access provide
        //return response

        const {email, password} = req.body;
        // console.log("body:",req.body);
        if(!email){
            throw new Error("email is required");
        }

        const existedUser = await User.findOne({email});
        if(!existedUser){
            throw new Error("User doesn't existed");
        }

        const isPassValid = await existedUser.isPasswordCorrect(password);
        if(!isPassValid){
            throw new Error("Enter the correct password");
        }
        const{accessToken,refreshToken}= await generatedAccessandRefreshToken(existedUser._id);

        const loggedinUser = await User.findById(existedUser._id).select("-password -refereshToken")
        const options ={
            httpOnly:true,//this ensure that its accessible via htttps not via frontend javascript
            secure:true,
        }//this line code ensure that credentials only passed through https connections

        return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({message: "logged in successfully:" , loggedinUser});

            
    } catch (error) {
        console.log(error);
        res.status(501).json({
            error:"login failed"
        })
    }
}

const logoutUser = async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options ={
        httpOnly:true,//this ensure that its accessible via htttps not via frontend javascript
        secure:true,
    }//this line code ensure that credentials only passed through https connections

    return res
            .status(202)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json({
                message:"Logout successfully"
            })

}

export {registerUser,loginUser,logoutUser};