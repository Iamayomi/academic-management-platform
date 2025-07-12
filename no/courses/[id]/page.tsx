"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Notification from "@/components/Notification";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(Number(id)),
  });
  const { notifications, clearNotifications } = useWebSocket(user?.id || null, user?.role || null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <Notification notifications={notifications} clearNotifications={clearNotifications} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{course?.title}</h1>
        <div className="space-x-2">
          <Link href={`/courses/${id}/grades`}>
            <Button>View Grades</Button>
          </Link>
          {user?.role === "lecturer" && user?.id === course?.lecturerId && (
            <Link href={`/courses/${id}/update`}>
              <Button>Update Course</Button>
            </Link>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>ID:</strong> {course?.id}
          </p>
          <p>
            <strong>Credits:</strong> {course?.credits}
          </p>
          <p>
            <strong>Lecturer ID:</strong> {course?.lecturerId}
          </p>
          <p>
            <strong>Syllabus:</strong> {course?.syllabus || "Not available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
