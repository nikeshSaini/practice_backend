import mongoose , {Mongoose, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

// console.log(process.env.Access_token_secret);


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim:true,
        index:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,
        required:true,

    },
    coverImage:{
        type:String,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    refereshToken:{
        type:String,

    }
},
{
    timestamps:true
}
)




//password encryption
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password =await  bcrypt.hash(this.password,5);//5 is number of time hash cycle is done
    }
    next();
});

//checkingthe password 
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);

}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email,
        },
        process.env.Access_token_secret, // Corrected variable name
        {
            expiresIn: process.env.Access_token_expiry // Corrected typo
        }
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.refresh_token_secret // Corrected variable name
    );
};





export const User = mongoose.model("User", userSchema);