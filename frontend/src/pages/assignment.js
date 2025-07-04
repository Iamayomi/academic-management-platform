import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Assignments() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState("");
  const [grade, setGrade] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data.data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data?.response?.message);
      }
    };

    fetchAssignments();
  }, [router]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, { courseId: parseInt(courseId), file }, { headers: { Authorization: `Bearer ${token}` } });
      setCourseId("");
      setFile("");
      // Refresh assignments
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data.data);
    } catch (error) {
      console.error("Submit assignment error:", error.response?.data?.response?.message);
    }
  };

  const handleGradeAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/assignments/grade`, { assignmentId, grade: parseFloat(grade) }, { headers: { Authorization: `Bearer ${token}` } });
      setGrade("");
      // Refresh assignments
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data.data);
    } catch (error) {
      console.error("Grade assignment error:", error.response?.data?.response?.message);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-black font-bold mb-6">Assignments</h1>
      {user.role === "student" && (
        <div className="mb-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Submit Assignment</h2>
          <div>
            <div className="mb-4">
              <label className="block  text-gray-700">Course ID</label>
              <input type="number" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">File URL</label>
              <input type="text" value={file} onChange={(e) => setFile(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <button onClick={handleSubmitAssignment} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submit Assignment
            </button>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="border p-4 rounded">
              <p>Course ID: {assignment.courseId}</p>
              <p>File: {assignment.file || "N/A"}</p>
              <p>Grade: {assignment.grade ?? "Not graded"}</p>
              {user.role === "lecturer" && (
                <div className="mt-2 flex items-center">
                  <input type="number" step="0.1" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-20 p-2 border rounded mr-2" placeholder="Grade" />
                  <button onClick={() => handleGradeAssignment(assignment.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Grade
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
