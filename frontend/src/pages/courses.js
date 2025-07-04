import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Courses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [credits, setCredits] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data?.response?.message);
      }
    };

    fetchCourses();
  }, [router]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Creating course with:", { title, credits, syllabus });

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses`, { title, credits: parseInt(credits), syllabus }, { headers: { Authorization: `Bearer ${token}` } });

      setTitle("");
      setCredits("");
      setSyllabus("");
      // Refresh courses
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data);
    } catch (error) {
      console.error("Create course error:", error.response?.data?.response?.message);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses/enroll`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      // Refresh courses
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data);
    } catch (error) {
      console.error("Enroll error:", error.response?.data?.response?.message);
    }
  };

  const handleDrop = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/enroll/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh courses
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data);
    } catch (error) {
      console.error("Drop error:", error.response?.data);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-black font-bold mb-6">Courses</h1>
      {user.role === "lecturer" && (
        <div className="mb-6">
          <h2 className="text-2xl  text-gray-700 font-semibold mb-4">Create Course</h2>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 text-black border rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Credits</label>
              <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="w-full p-2 text-black border rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Syllabus</label>
              <textarea value={syllabus} onChange={(e) => setSyllabus(e.target.value)} className="w-full p-2 text-black border rounded" />
            </div>
            <button onClick={handleCreateCourse} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Course
            </button>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl text-gray-500 font-semibold mb-4">Available Courses</h2>
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border p-4 text-gray-500  rounded">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-700">Credits: {course.credits}</p>
              <p className="text-gray-700">Syllabus: {course.syllabus || "N/A"}</p>
              {user.role === "student" && (
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
      </div>
    </div>
  );
}
