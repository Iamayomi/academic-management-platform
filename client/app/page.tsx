import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome to Academic Management Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Enroll in courses, view grades, submit assignments, and get recommendations.</p>
            <Link href="/dashboard/student" className="text-primary hover:underline">
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lecturers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage courses, create syllabi, and grade assignments.</p>
            <Link href="/dashboard/lecturer" className="text-primary hover:underline">
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Oversee platform operations.</p>
            <Link href="/dashboard/admin" className="text-primary hover:underline">
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
