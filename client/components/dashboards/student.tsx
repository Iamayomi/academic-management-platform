"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, GraduationCap, Clock, Award, FileText, TrendingUp } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard/student", icon: GraduationCap, current: true },
  { name: "Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { name: "Assignments", href: "/dashboard/student/assignments", icon: FileText },
  { name: "Schedule", href: "/dashboard/student/schedule", icon: Calendar },
  { name: "Grades", href: "/dashboard/student/grades", icon: Award },
  { name: "Attendance", href: "/dashboard/student/attendance", icon: Clock },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout userRole="student" userName="John Smith" userEmail="john.smith@student.greenwood.edu" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
          <p className="text-gray-600">Here's what's happening with your studies today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.85</div>
              <p className="text-xs text-muted-foreground">+0.12 from last semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Spring 2024 semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">Excellent attendance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Your latest assignment submissions and grades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { subject: "Mathematics", assignment: "Calculus Problem Set 5", grade: "A-", status: "graded" },
                { subject: "Physics", assignment: "Lab Report: Motion Analysis", grade: "B+", status: "graded" },
                { subject: "English", assignment: "Essay: Modern Literature", grade: null, status: "submitted" },
                { subject: "Chemistry", assignment: "Molecular Structure Quiz", grade: null, status: "pending" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.assignment}</p>
                    <p className="text-sm text-gray-600">{item.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.grade && <Badge variant="secondary">{item.grade}</Badge>}
                    <Badge variant={item.status === "graded" ? "default" : item.status === "submitted" ? "secondary" : "outline"}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Your progress in current courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { course: "Advanced Mathematics", progress: 85, grade: "A-" },
                { course: "Physics II", progress: 78, grade: "B+" },
                { course: "English Literature", progress: 92, grade: "A" },
                { course: "Chemistry", progress: 73, grade: "B" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.course}</span>
                    <Badge variant="secondary">{item.grade}</Badge>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{item.progress}% complete</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes and activities for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "9:00 AM", subject: "Mathematics", room: "Room 201", type: "Lecture" },
                { time: "11:00 AM", subject: "Physics Lab", room: "Lab 3", type: "Laboratory" },
                { time: "2:00 PM", subject: "English Literature", room: "Room 105", type: "Discussion" },
                { time: "4:00 PM", subject: "Study Group", room: "Library", type: "Study Session" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="text-sm font-medium text-blue-600 min-w-[80px]">{item.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-gray-600">
                      {item.room} • {item.type}
                    </p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
