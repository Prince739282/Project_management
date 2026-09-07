import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login Page/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
      <Route path="/projects" element={<h1>Projects Page</h1>} />
      <Route path="/profile" element={<h1>Profile Page</h1>} />
    </Routes>
  );
}

export default App;
