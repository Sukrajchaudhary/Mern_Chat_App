import React, {
  useContext,
  createContext,
  useState,
} from "react";
const AuthContext = createContext();
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setauth] = useState(null);
  return (
    <AuthContext.Provider value={{ auth, setauth }}>
      {children}
    </AuthContext.Provider>
  );
};
