import React, { createContext } from 'react'

export const authDataContext = createContext()
function AuthContext({children}) {
    // Prefer an explicit Vite environment variable `VITE_SERVER_URL`.
    // Fallback: during development use relative path (Vite proxy), otherwise keep existing hardcoded Render URL.
    const serverUrl = import.meta.env.VITE_SERVER_URL ?? (import.meta.env.DEV ? '' : 'https://onecart-backend-2wez.onrender.com');

    const value = { serverUrl };
    return (
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    );
}

export default AuthContext
