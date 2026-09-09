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
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
  });

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
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks/${projectId}`);

        console.log("Tasks:", response.data);

        setTasks(response.data.data || []);
      } catch (error) {
        console.log("Tasks error:", error);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchProject();
    fetchMembers();
    fetchTasks();
  }, [projectId]);

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };
  const createTask = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/tasks/${projectId}`, taskForm);

      console.log("Task created:", response.data);

      setTasks([...tasks, response.data.data]);

      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
      });

      setShowTaskForm(false);
    } catch (error) {
      console.log("Create task error:", error);
    }
  };

  const updateTask = async (taskId) => {
    try {
      const response = await api.put(
        `/tasks/${projectId}/tasks/${taskId}`,
        taskForm,
      );

      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data.data : task)),
      );

      setEditingTaskId(null);

      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
      });
    } catch (error) {
      console.log("Update task error:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/tasks/${projectId}/tasks/${taskId}`);

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log("Delete task error:", error);
    }
  };

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
      {/* Tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>

          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {showTaskForm ? "Cancel" : "+ Create Task"}
          </button>
        </div>

        {/* Create Task Form */}
        {showTaskForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (editingTaskId) {
                updateTask(editingTaskId);
              } else {
                createTask(e);
              }
            }}
            className="border rounded-md p-4 mb-6"
          >
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
              className="w-full border rounded-md p-2 mb-3"
            />

            <textarea
              name="description"
              placeholder="Task description"
              value={taskForm.description}
              onChange={handleTaskChange}
              className="w-full border rounded-md p-2 mb-3"
            />

            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleTaskChange}
              className="w-full border rounded-md p-2 mb-3"
            >
              <option value="">Assign to member</option>

              {members.map((member) => (
                <option key={member.user?._id} value={member.user?._id}>
                  {member.user?.fullName || member.user?.username}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
              className="w-full border rounded-md p-2 mb-3"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>
          </form>
        )}

        {/* Task List */}
        {tasksLoading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="border rounded-md p-4">
                <h3 className="font-semibold text-lg">{task.title}</h3>

                <p className="text-gray-600 mt-1">{task.description}</p>

                <p className="text-sm text-blue-600 mt-2">
                  Status: {task.status}
                </p>
                <button
                  onClick={() => {
                    setEditingTaskId(task._id);

                    setTaskForm({
                      title: task.title,
                      description: task.description || "",
                      assignedTo: task.assignedTo?._id || "",
                      status: task.status,
                    });

                    setShowTaskForm(true);
                  }}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-600 text-sm mt-2 ml-4 hover:underline"
                >
                  Delete
                </button>

                {task.assignedTo && (
                  <p className="text-sm text-gray-500 mt-1">
                    Assigned to:{" "}
                    {task.assignedTo.fullName || task.assignedTo.username}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
