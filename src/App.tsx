import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NewWorkout from "./pages/NewWorkout.tsx";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/newWorkout" element={<NewWorkout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
