import React, { useState, useContext, useEffect } from 'react';
import Logo from "../assets/logo.png";
import google from '../assets/google.png';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const result = await axios.post(
      serverUrl + "/api/auth/login", { email, password }
    );

    console.log("LOGIN RESPONSE 👉", result.data);

    // 🔥 THIS IS THE KEY LINE YOU ARE MISSING
    localStorage.setItem("token", result.data.token);

    // Optional: save user
    localStorage.setItem("user", JSON.stringify(result.data.user));

    await getCurrentUser();
    navigate("/");
  } catch (error) {
    console.error(
      "Login error:",
      error.response?.data?.message || error.message
    );
    alert(error.response?.data?.message || "Login failed");
  }
};


const { user } = useContext(userDataContext);

useEffect(() => {
  if (user) {
    navigate("/");
  }
}, [user]);


  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName: name, email } = response.user;

      const result = await axios.post(
        `${serverUrl}/api/auth/googleLogin`,
        { name, email },
        { withCredentials: true }
      );
      console.log("Google login:", result.data);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
      {/* Navbar */}
      <div className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
        <img src={Logo} alt="logo" className='w-[40px]' />
        <h1 className='text-[22px] font-sans'>OneCart</h1>
      </div>

      {/* Main Content */}
      <div className='w-[100%] h-[100px] flex flex-col items-center justify-center mt-10 gap-4'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneCart, place your order</span>
      </div>

      {/* Card */}
      <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
        <form onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>

          {/* Google Login */}
          <div className='w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer hover:bg-[#42656c] transition' onClick={googleLogin}>
            <img src={google} alt="google" className='w-[20px]' />
            <span>Login with Google</span>
          </div>

          <div className='w-[100%] h-[20%] flex items-center justify-center gap-[10px]'>
            <div className='w-[40%] h-[1px] bg-[#96969635]' ></div> OR <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
          </div>

          {/* Email/Password Login */}
          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
            <input type="text" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} className='w-full h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent px-[20px] font-semibold placeholder-[#ffffffc7]' />
            <input type={show ? "text" : "password"} placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent px-[20px] font-semibold placeholder-[#ffffffc7]' />
            {!show ? 
              <IoEyeOutline className='absolute right-[5%] bottom-[57%] w-[20px] h-[20px] cursor-pointer' onClick={() => setShow(prev => !prev)} /> :
              <IoEye className='absolute right-[5%] bottom-[57%] w-[20px] h-[20px] cursor-pointer' onClick={() => setShow(prev => !prev)} />
            }
            <button className='w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold'>Login</button>
            <p className='flex gap-[10px]'>Don't have an account? 
              <span className='text-[#5555f6cf] text-[17px] font-semibold cursor-pointer' onClick={() => navigate("/signup")}>Create Account</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
