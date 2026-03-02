import React, { createContext } from 'react';
export const authDataContext = createContext()
function AuthContext({children}) {
    // in development we use a relative path and rely on the Vite proxy
    // in production we hit the real backend URL directly
    const serverUrl = process.env.NODE_ENV === 'development'
        ? ''
        : 'https://onecart-backend-2wez.onrender.com';

    const value = { serverUrl };
    return (
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    );
}

export default AuthContext
