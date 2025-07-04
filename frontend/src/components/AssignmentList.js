import axios from "axios";

export default function AssignmentList({ assignments, role }) {
  const [grade, setGrade] = useState("");

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

  return (
    <ul className="space-y-4">
      {assignments.map((assignment) => (
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
        </li>
      ))}
    </ul>
  );
}
