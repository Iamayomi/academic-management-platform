import { useState } from "react";
import axios from "axios";

export default function AssignmentList({ assignments, role }) {
  const [grade, setGrade] = useState("");
  const [file, setFile] = useState("");

  const handleGradeAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/assignments/grade`, { assignmentId, grade: parseFloat(grade) }, { headers: { Authorization: `Bearer ${token}` } });
      setGrade("");
      window.location.reload();
    } catch (error) {
      console.error("Grade assignment error:", error.response?.data);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/assignments/submit`, { assignmentId, file }, { headers: { Authorization: `Bearer ${token}` } });
      setFile("");
      window.location.reload();
    } catch (error) {
      console.error("Submit assignment error:", error.response?.data);
    }
  };

  return (
    <ul className="space-y-4">
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <li key={assignment.id} className="border p-4 rounded">
            <p>Course ID: {assignment.courseId}</p>
            <p>File: {assignment.file || "N/A"}</p>
            <p>Grade: {assignment.grade ?? "Not graded"}</p>
            {role === "lecturer" && (
              <div className="mt-2 flex items-center">
                <input type="number" step="0.1" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-20 p-2 border rounded mr-2" placeholder="Grade" />
                <button onClick={() => handleGradeAssignment(assignment.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Grade
                </button>
              </div>
            )}
            {role === "student" && !assignment.file && (
              <div className="mt-2 flex items-center">
                <input type="text" value={file} onChange={(e) => setFile(e.target.value)} className="w-64 p-2 border rounded mr-2" placeholder="File URL" />
                <button onClick={() => handleSubmitAssignment(assignment.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Submit
                </button>
              </div>
            )}
          </li>
        ))
      ) : (
        <li className="text-gray-500">No assignments found.</li>
      )}
    </ul>
  );
}
