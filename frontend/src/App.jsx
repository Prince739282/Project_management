import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login Page />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/create" element={<CreateProject />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/projects" element={<h1>Projects Page</h1>} />
      <Route path="/profile" element={<h1>Profile Page</h1>} />
    </Routes>
  );
}

export default App;
