"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourses, enrollCourse } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import CourseCard from "@/components/CourseCard";
import Notification from "@/components/Notification";
import { useAuth } from "@/lib/auth";
import { Course } from "@/types";

export default function CoursesPage() {
  const { user } = useAuth();
  const {
    data: courses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
  const { notifications, clearNotifications } = useWebSocket(user?.id || null, user?.role || null);

  const handleEnroll = async (courseId: number) => {
    await enrollCourse(courseId);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <Notification notifications={notifications} clearNotifications={clearNotifications} />
      <h1 className="text-2xl font-bold">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course: Course) => (
          <CourseCard key={course.id} course={course} onEnroll={user?.role === "student" ? handleEnroll : undefined} />
        ))}
      </div>
    </div>
  );
}
