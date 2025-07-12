"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { updateCourse, getCourseById } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Notification from "@/components/Notification";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(Number(id)),
  });
  const { notifications, clearNotifications } = useWebSocket(user?.id || null, user?.role || null);

  const [title, setTitle] = useState("");
  const [credits, setCredits] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (user?.id !== course?.lecturerId) {
      setError("You are not authorized to update this course");
      return;
    }
    try {
      await updateCourse(
        Number(id),
        {
          title: title || undefined,
          credits: credits ? parseInt(credits) : undefined,
          syllabus: syllabus || undefined,
        },
        file ?? undefined
      );
      router.push(`/courses/${id}`);
    } catch (err) {
      setError("Failed to update course");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <Notification notifications={notifications} clearNotifications={clearNotifications} />
      <h1 className="text-2xl font-bold">Update Course: {course?.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Course Title" defaultValue={course?.title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" placeholder="Credits" defaultValue={course?.credits} onChange={(e) => setCredits(e.target.value)} />
            <Textarea placeholder="Syllabus" defaultValue={course?.syllabus} onChange={(e) => setSyllabus(e.target.value)} />
            <Input type="file" onChange={handleFileChange} />
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleSubmit}>Update Course</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
