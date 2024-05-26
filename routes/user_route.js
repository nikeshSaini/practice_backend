import { Router } from "express";
import {registerUser} from "../controllers/user_controller.js";
import {loginUser} from "../controllers/user_controller.js";
const router = Router();
import {upload} from "../middlewares/multer_middleware.js";


router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"cover",
        maxCount:1
    }
]),registerUser);
router.route("/login").post(loginUser);


export default router;