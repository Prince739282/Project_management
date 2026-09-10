import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/");

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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("accessToken");

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);

      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">NOVA</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome back!</span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
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
            <div>
              <h3 className="text-xl font-bold">Recent Projects</h3>

              <p className="text-sm text-gray-500 mt-1">
                Click a project to manage tasks, members and details.
              </p>
            </div>

            <button
              onClick={() => navigate("/projects/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
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
              {projects.map((item) => (
                <div
                  key={item.project._id}
                  onClick={() => navigate(`/projects/${item.project._id}`)}
                  className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:border-blue-400 hover:shadow-sm hover:bg-blue-50/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        {item.project.name}
                      </h4>

                      <p className="text-gray-500 mt-1">
                        {item.project.description}
                      </p>
                    </div>

                    <span className="text-blue-600 text-xl ml-4">→</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-blue-600">Role: {item.role}</p>

                    <p className="text-xs text-gray-400">
                      Click to manage project
                    </p>
                  </div>
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
