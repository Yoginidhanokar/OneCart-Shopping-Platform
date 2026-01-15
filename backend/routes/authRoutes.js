console.log("🔥 AUTH ROUTES VERSION WITH getcurrentuser LOADED");

import express from "express"
import { registration, login , logOut, googleLogin, getCurrentUser, adminLogin} from "../controller/authController.js";
import isAuth from "../middleware/isAuth.js";
import { loginUser } from "../controller/authController.js";


const authRoutes = express.Router();

authRoutes.post("/registration", registration);
authRoutes.post("/login", login);
authRoutes.post("/logout", logOut);
authRoutes.post("/googleLogin", googleLogin);
authRoutes.post("/adminLogin", adminLogin);
authRoutes.get("/getcurrentuser", isAuth, getCurrentUser);
authRoutes.post("/test-login", loginUser);

console.log("✅ AUTH ROUTES FILE LOADED");


export default authRoutes;