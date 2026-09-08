import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);

        console.log("Project:", response.data);

        setProject(response.data.data);
      } catch (error) {
        console.log("Project error:", error);

        setError(error.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/members`);

        console.log("Members:", response.data);

        setMembers(response.data.data || []);
      } catch (error) {
        console.log("Members error:", error);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchProject();
    fetchMembers();
  }, [projectId]);

  if (loading) {
    return <p className="p-6">Loading project...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Project Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">{project?.name}</h1>

        <p className="text-gray-600 mt-3">{project?.description}</p>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Team Members</h2>

        {membersLoading ? (
          <p className="text-gray-500">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">No team members.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="border rounded-md p-4 flex justify-between"
              >
                <div>
                  <h3 className="font-semibold">{member.user?.fullName}</h3>

                  <p className="text-gray-500">@{member.user?.username}</p>
                </div>

                <span className="text-blue-600 font-medium">{member.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
