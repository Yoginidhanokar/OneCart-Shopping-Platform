import React from 'react'
import { children } from 'react'
import { createContext } from 'react'

export const authDataContext = createContext()
function AuthContext({children}) {
    // use relative path during development so that the Vite proxy can
    // forward requests, avoiding CORS issues with the backend.
    const serverUrl = process.env.NODE_ENV === 'development' ? '' : 'https://onecart-backend-2wez.onrender.com';

    const value = { serverUrl };
    return (
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    );
}

export default AuthContext
