import React from 'react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import google from '../assets/google.png'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useState } from 'react';
import { useContext } from 'react';
import { authDataContext } from '../context/authContext';
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { getCurrentUser } from '../../../backend/controller/userController';
function Registration() {
  let [show,setShow] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  let [name,setName] = useState("")
  let [email,setEmail] = useState("")
  let [password,setPassword] = useState("")

  let navigate = useNavigate()


  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(serverUrl + '/api/auth/registration',{
        name,email,password
      },{withCredentials:true})
        getCurrentUser()
        navigate("/")
        console.log(result.data)

    } catch (error) {
      console.log(error)
    }
  }

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response.user
      let name = user.displayName;
      let email = user.email

      const result = await axios.post(serverUrl + "/api/auth/googleLogin" ,{name,email} , {withCredentials:true})
      console.log(result.data)
      getCurrentUser()
      navigate("/")
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
      
      {/* Navbar */}
      <div 
        className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' 
        onClick={() => navigate("/")}
      >
        <img className='w-[40px]' src={Logo} alt="logo" />  
        <h1 className='text-[22px] font-sans'>OneCart</h1>
      </div> 

      {/* Main Content */}
      <div className='w-[100%] h-[100px] flex flex-col items-center justify-center flex-1 mt-10 gap-4'>
        <span className='text-[25px] font-semibold'>Registration Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
        </div>
        {/* Card */}
        <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
            <form action="" onSubmit={handleSignup} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>

                {/* Google Button */}
                <div className='w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer hover:bg-[#42656c] transition'onClick={googleSignup}>
                    <img src={google} alt="google" className='w-[20px]' />
                    <span>Registration with Google</span>
                </div>
                <div className='w-[100%] h-[20%] flex items-center justify-center gap-[10px]'>
                    <div className='w-[40%] h-[1px] bg-[#96969635]' ></div> OR <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
                </div>
                <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
                    <input type="text" className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='UserName' required onChange={(e)=>setName(e.target.value)} value={name}/>
                    <input type="text" className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    <input type={show?"text":"password"} className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' placeholder='password' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    {!show && <IoEyeOutline className='w-[20px] h-[20px] cursor-pointer absolute right-[5%]'onClick={()=>setShow(prev => !prev)}/>}
                    {show &&<IoEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%]'onClick={()=>setShow(prev => !prev)}/>}
                    <button className='w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold'>Create Account</button>
                    <p className='flex gap-[10px]'>You have any account?<span className='text-[#5555f6cf] text-[17px] font-semibold cursor-pointer' onClick={()=>navigate("/login")}>Login</span></p>
                </div>
            </form>
        </div> 
    </div>
  )
}

export default Registration
