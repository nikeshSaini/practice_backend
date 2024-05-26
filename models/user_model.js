import mongoose , {Mongoose, Schema} from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt  from "bcrypt";


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
    coverimage:{
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


//generating token for access
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullName:this.fullName,
            email:this.email,
        }
    ),
    process.env.Access_token_secret,
    {
        expireIn:process.env.Access_token_expiry
    }
};
//genereating token for refresh
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this._id
        }
    )
}





export const User = mongoose.model("User", userSchema);