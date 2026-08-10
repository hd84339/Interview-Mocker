import { createContext, useContext, useState } from "react";
import { STORAGE_KEYS } from "../constants/authKeys";

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  uid: "usr_demo_123",
  displayName: "Alex Morgan",
  email: "alex.morgan@example.com",
  photoURL: "https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff",
  targetRole: "Senior Full Stack Engineer",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem("mockhora_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (name, emailStr) => {
    const newUser = {
      uid: "usr_" + Math.random().toString(36).substr(2, 9),
      displayName: name || DEFAULT_DEMO_USER.displayName,
      email: emailStr || DEFAULT_DEMO_USER.email,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || DEFAULT_DEMO_USER.displayName)}&background=6366f1&color=fff`,
      targetRole: DEFAULT_DEMO_USER.targetRole,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, "mockhora_jwt_token_" + Date.now());
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem("mockhora_user");
    localStorage.removeItem("token");
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      setUser: () => {},
      loginUser: () => {},
      logout: () => {},
    };
  }
  return context;
};
