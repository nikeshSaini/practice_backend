import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})


// Configuration
cloudinary.config({ 
    cloud_name: process.env.cloudinary_cloud_name, 
    api_key: process.env.cloudinary_api_key, 
    api_secret: process.env.cloudinary_api_secret,  
});
// console.log(process.env.cloudinary_cloud_name, process.env.cloudinary_api_key,process.env.cloudinary_api_secret)
// // Upload an image
const uploadOnCloudinary = async (localfilepath) => {
    // console.log('api key is', process.env.cloudinary_api_key)
    try {
        if (!localfilepath) {
            return null;
        } else {
            const uploadResult = await cloudinary.uploader.upload(localfilepath, {
                resource_type: "auto"
            });
            console.log("file upload", uploadResult.url);
            return uploadResult;
        }
    } catch (e) {
        fs.unlinkSync(localfilepath); 
        console.log("file upload failed",e);
        return null;
    }
};

export { uploadOnCloudinary };
