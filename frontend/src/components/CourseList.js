import axios from "axios";

export default function CourseList({ courses, role }) {
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses/enroll`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (error) {
      console.error("Enroll error:", error.response?.data);
    }
  };

  const handleDrop = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/enroll/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (error) {
      console.error("Drop error:", error.response?.data);
    }
  };

  return (
    <ul className="space-y-4">
      {courses.map((course) => (
        <li key={course.id} className="border p-4 rounded">
          <h3 className="text-xl font-semibold">{course.title}</h3>
          <p>Credits: {course.credits}</p>
          <p>Syllabus: {course.syllabus || "N/A"}</p>
          {role === "student" && (
            <div className="mt-2">
              {course.enrolled ? (
                <button onClick={() => handleDrop(course.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Drop Course
                </button>
              ) : (
                <button onClick={() => handleEnroll(course.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Enroll
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
