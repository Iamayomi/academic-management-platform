"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourseGrades } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function CourseGradesPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["courseGrades", id],
    queryFn: () => getCourseGrades(Number(id)),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Course Grades</h1>
      <Card>
        <CardHeader>
          <CardTitle>Grades for Course ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Grade:</strong> {data?.grade || "Not graded"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
