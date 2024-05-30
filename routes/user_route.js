import { Router } from "express";
import {registerUser,loginUser,logoutUser} from "../controllers/user_controller.js";
const router = Router();
import {upload} from "../middlewares/multer_middleware.js";
import {verifyJWT} from "../middlewares/auth_middleware.js";


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);


export default router;