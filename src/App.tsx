import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import type { User } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import "./App.css";

import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

function App() {
  const [password, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState<String | null>(null);
  const [validated, setValidated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const validateEmail = (email: string) => {
    // Basic email regex: must have @, ., and a valid ending
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const createCookie = (email: string, password: string) => {
    const twoWeeks = new Date();
    twoWeeks.setTime(twoWeeks.getTime() + 14 * 24 * 60 * 60 * 1000);

    const cookie = `email=${email}; password=${password}; expires=${twoWeeks.toUTCString()}; path=/`;
    document.cookie = cookie;
  };

  const getLoginCookies = () => {
    const cookies = document.cookie.split("; ");
    let email = "";
    let password = "";

    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === "email") {
        email = value;
      } else if (key === "password") {
        password = value;
      }
    }

    return { email, password };
  };

  const resetLoginCookies = () => {
    const twoWeeks = new Date();
    twoWeeks.setTime(twoWeeks.getTime() - 14 * 24 * 60 * 60 * 1000);

    const newCookie = `email=; password=; expires=${twoWeeks}`;
    document.cookie = newCookie;
  };

  const handleLogout = () => {
    resetLoginCookies();
    setPasscode("");
    setEmail("");
    setLoggedIn(false);
    setUser(null);
  };

  const loginEmailandPassword = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        setLoggedIn(true);
        createCookie(email, password);
        console.log("User logged in:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
        setAuthError("Invalid email or password. || " + errorMessage);
      });
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }
    setValidated(true);
    if (valid) {
      loginEmailandPassword();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }

    setValidated(true);
    if (valid) {
      setAuthError("");

      const createUserEmailAndPassword = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            setUser(userCredential.user);
            setLoggedIn(true);

            console.log("User logged in:", user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);

            setAuthError("Invalid email or password. || " + errorMessage);
          });
      };

      createUserEmailAndPassword();
    }
  };

  useEffect(() => {
    // On mount, check for login cookies and auto-login if present
    const { email: cookieEmail, password: cookiePassword } = getLoginCookies();
    if (cookieEmail && cookiePassword) {
      setEmail(cookieEmail);
      setPasscode(cookiePassword);
      // Only attempt login if not already logged in
      if (!loggedIn) {
        signInWithEmailAndPassword(auth, cookieEmail, cookiePassword)
          .then((userCredential) => {
            setUser(userCredential.user);
            setLoggedIn(true);
          })
          .catch((_) => {
            // If cookie login fails, clear cookies and show error
            resetLoginCookies();
            setAuthError("Auto-login failed. Please login manually.");
          });
      }
    }
  }, []);

  return (
    <>
      {!loggedIn && (
        <div className="d-flex justify-content-center align-items-center">
          <h1>Workout Tracker App</h1>
        </div>
      )}

      {!loggedIn && (
        <div>
          <form
            className={`login-form p-3 shadow-lg border-gray-100 rounded-xl m-auto border-2 d-flex flex-column justify-content-center align-items-center needs-validation${
              validated ? " was-validated" : ""
            } mt-5`}
            noValidate
            onSubmit={handleLogin}
          >
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="form-floating">
                <input
                  type="email"
                  className={`form-control${emailError ? " is-invalid" : ""}`}
                  id="floatingInput"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ boxSizing: "border-box" }}
                />
                <label htmlFor="floatingInput">Email</label>
                <div
                  className="invalid-feedback"
                  style={{ minHeight: "1.5em" }}
                >
                  {emailError}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="form-floating w-100">
                <input
                  type="password"
                  className={`form-control${
                    passwordError ? " is-invalid" : ""
                  } form-control-sm`}
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (e.target.value.length >= 8) {
                      setPasswordError("");
                    }
                  }}
                  required
                  minLength={8}
                  style={{ boxSizing: "border-box" }}
                />
                <label htmlFor="floatingPassword">Password</label>
                <div
                  className="invalid-feedback"
                  style={{ minHeight: "1.5em" }}
                >
                  {passwordError}
                </div>
              </div>
            </div>
            <div
              className="items-center mb-3 d-flex"
              style={{ gap: "0.75rem" }}
            >
              <button
                className="btn btn-primary mt-3"
                type="submit"
                onClick={handleLogin}
              >
                <i className="bi bi-box-arrow-in-right mr-1.5" />
                Login
              </button>
              <button
                className="btn btn-secondary mt-3"
                type="submit"
                onClick={handleSignUp}
              >
                <i className="bi bi-person-plus-fill mr-1.5" />
                Register
              </button>
            </div>
            {authError !== null && (
              <div className="alert alert-danger mt-3" role="alert">
                {authError}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default App;
