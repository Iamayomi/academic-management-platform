import { useState } from "react";
import axios from "axios";

export default function AIAssistant({ user }) {
  const [interest, setInterest] = useState("");
  const [topic, setTopic] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [syllabus, setSyllabus] = useState("");

  const handleRecommend = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/recommend`,
        { interest },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRecommendations(res.data.data.courses);
    } catch (error) {
      console.error("Recommendation error:", error.response?.data?.response?.message);
    }
  };

  const handleGenerateSyllabus = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/syllabus`,
        { topic },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSyllabus(res.data.syllabus);
    } catch (error) {
      console.error("Syllabus generation error:", error.response?.data);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">AI Assistant</h2>
      <div className="mb-6">
        <h3 className="text-xl mb-2">Course Recommendations</h3>
        <input type="text" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Enter your interests" className="mb-2 p-2 border rounded w-full" />
        <button onClick={handleRecommend} className="p-2 bg-blue-500 text-white rounded">
          Get Recommendations
        </button>
        <ul className="mt-2">
          {recommendations.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
      {user?.role === "lecturer" && (
        <div>
          <h3 className="text-xl mb-2">Generate Syllabus</h3>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter course topic" className="mb-2 p-2 border rounded w-full" />
          <button onClick={handleGenerateSyllabus} className="p-2 bg-blue-500 text-white rounded">
            Generate Syllabus
          </button>
          {syllabus && <pre className="mt-2 p-4 bg-gray-100 rounded">{syllabus}</pre>}
        </div>
      )}
    </div>
  );
}
