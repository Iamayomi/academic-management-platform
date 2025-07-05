"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CourseList from "@/components/CourseList";
import AssignmentList from "@/components/AssignmentList";
import Notification from "@/components/Notification";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ courses: [], assignments: [], overview: {} });
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser?.role) {
        throw new Error("Invalid user data");
      }
      setUser(parsedUser);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        let endpoint;
        if (user?.role === "student") {
          endpoint = "/courses/students/dashboard";
        } else if (user?.role === "lecturer") {
          endpoint = "/courses/lecturers/dashboard";
        } else if (user?.role === "admin") {
          endpoint = "/courses/admins/dashboard";
        }
        if (endpoint) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setData(res.data);
        }
      } catch (error) {
        console.error("Fetch error:", error.response?.data);
      }
    };

    if (user) {
      fetchData();
    }

    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setNotifications((prev) => [...prev, message.message]);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
        setNotifications((prev) => [...prev, event.data]);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [user, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-black font-bold">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <Notification notifications={notifications} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl text-black font-semibold mb-4">Courses</h2>
          <CourseList courses={data.courses} role={user.role} />
        </div>
        <div>
          <h2 className="text-2xl text-black font-semibold mb-4">Assignments</h2>
          <AssignmentList assignments={data.assignments} role={user.role} />
        </div>
      </div>
      {user.role === "admin" && (
        <div className="mt-6">
          <h2 className="text-2xl text-black font-semibold mb-4">Overview</h2>
          <p>Total Students: {data.overview.totalStudents || 0}</p>
          <p>Total Courses: {data.overview.totalCourses || 0}</p>
        </div>
      )}
    </div>
  );
}
