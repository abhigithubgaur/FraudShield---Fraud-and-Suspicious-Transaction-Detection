import { createContext, useContext, useState } from "react";
import { getAuth, saveAuth, clearAuth } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(getAuth());

  const login = (data) => {
    saveAuth(data);
    setAuthState(data);
  };

  const logout = () => {
    clearAuth();
    setAuthState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);