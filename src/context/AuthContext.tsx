import React, { createContext, useContext, useState } from "react";

// Define the context type
export type AuthContextType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPasscode: React.Dispatch<React.SetStateAction<string>>;
  emailError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  passwordError: string;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  authError: string | null;
  setAuthError: React.Dispatch<React.SetStateAction<string | null>>;
  validated: boolean;
  setValidated: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: String | null;
  setUser: React.Dispatch<React.SetStateAction<String | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [password, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<String | null>(null);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPasscode,
        emailError,
        setEmailError,
        passwordError,
        setPasswordError,
        authError,
        setAuthError,
        validated,
        setValidated,
        loggedIn,
        setLoggedIn,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
