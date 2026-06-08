import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt"
import { genToken, genToken1 } from "../config/token.js"; 

export const registration = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        console.log("Registration attempt:", {name, email});
        
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }
        if(!validator.isEmail(email)){
             return res.status(400).json({message:"Enter valid Email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong Password"})
        }
        let hashPassword = await bcrypt.hash(password,10)

        const user = await User.create({name,email,password:hashPassword})
        console.log("User created successfully:", user._id);
        
        let token = await genToken(user._id)
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token",token,{
            httpOnly:true,
            secure: isProduction,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            success: true,
            token,
            user
        })
    } catch (error) {
        console.error("Registration error:", error.message);
        console.error("Full error:", error);
        return res.status(500).json({message:`registration error ${error.message}`})
    }
}



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 validate user (example)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🎟️ create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 SET COOKIE with environment-aware secure flag
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,  // true on production, false on localhost
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      token,   // 🔥 Frontend stores in localStorage and uses in Authorization header
      user
    });


  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};


export const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Simple demo login without DB (useful for testing frontend)
  if (email === "test@test.com" && password === "1234") {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

export const logOut = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
      path: "/"
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};



export const googleLogin = async (req,res) => {
    try {
        let {name, email} = req.body;
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,email
            })
        }
        
       
        let token = await genToken(user._id)
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token",token,{
            httpOnly:true,
            secure: isProduction,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            token,
            user
        })
    } catch (error) {
        console.log("googleLogin error")
        return res.status(500).json({message:`googleLogin error ${error}`})
    }
    
}

// authController.js
// userController.js (BEST PLACE)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User
      .findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            let token = await genToken1(email)
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/",
                maxAge: 1 * 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                success: true,
                token: token,
                message: "Admin login successful"
            });
        }
        return res.status(400).json({message:"Invalid credentials"})
    } catch (error) {
         console.log("AdminLogin error")
        return res.status(500).json({message:`AdminLogin error ${error}`})
    }
}
