import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/");

        console.log("Projects:", response.data);

        setProjects(response.data.data || []);
      } catch (error) {
        console.log("Projects error:", error);

        setError(error.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">NOVA</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome back!</span>

          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

          <p className="text-gray-500 mt-1">
            Manage your projects, tasks and team.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-gray-500">Total Projects</p>

            <h3 className="text-3xl font-bold mt-2">{projects.length}</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-gray-500">Total Tasks</p>

            <h3 className="text-3xl font-bold mt-2">0</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-gray-500">Completed Tasks</p>

            <h3 className="text-3xl font-bold mt-2">0</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-gray-500">Team Members</p>

            <h3 className="text-3xl font-bold mt-2">0</h3>
          </div>
        </div>

        {/* Projects */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold">Recent Projects</h3>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              + New Project
            </button>
          </div>

          {loading && <p className="text-gray-500">Loading projects...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No projects yet.
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project._id} className="border rounded-md p-4">
                  <h4 className="font-semibold text-lg">{project.name}</h4>

                  <p className="text-gray-500 mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
