import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/authContext';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/adminLogin",
        { email, password },
        { withCredentials: true }
      );
      console.log("Admin login:", result.data);
      navigate("/admin/dashboard"); // redirect after login
    } catch (error) {
      console.error("Admin login error:", error);
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center bg-gradient-to-l from-[#141414] to-[#0c2025] text-white'>
      <form onSubmit={handleAdminLogin} className='w-[400px] p-8 bg-[#00000025] rounded-lg shadow-lg flex flex-col gap-4'>
        <h2 className='text-[24px] font-semibold mb-4'>Admin Login</h2>
        <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className='w-full h-[40px] rounded px-3 bg-transparent border-[2px] border-[#96969635]' />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-[40px] rounded px-3 bg-transparent border-[2px] border-[#96969635]' />
        <button type="submit" className='w-full h-[45px] bg-[#6060f5] rounded-lg'>Login</button>
      </form>
    </div>
  )
}

export default AdminLogin;
