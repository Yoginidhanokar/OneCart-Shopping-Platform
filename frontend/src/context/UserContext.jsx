import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const userDataContext = createContext()

function UserContext({ children }) {
  const [userData, setUserData] = useState(null)
  
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()

  const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const result = await axios.get(`${serverUrl}/api/auth/getcurrentuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUserData(result.data);
  } catch (error) {
    if (error.response?.status === 401) {
      setUserData(null);
    }
  }
};

  const logout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUserData(null);      // clear user state
      navigate("/login");    // redirect
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    getCurrentUser()
  }, [])

  let value = {
    userData,
    setUserData,
    getCurrentUser,
    logout,
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
