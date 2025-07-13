"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, Clock, FileText, GraduationCap, CheckCircle, TrendingUp } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard/lecturer", icon: GraduationCap, current: true },
  { name: "My Classes", href: "/dashboard/lecturer/classes", icon: Users },
  { name: "Assignments", href: "/dashboard/lecturer/assignments", icon: FileText },
  { name: "Gradebook", href: "/dashboard/lecturer/gradebook", icon: BookOpen },
  { name: "Schedule", href: "/dashboard/lecturer/schedule", icon: Calendar },
  { name: "Attendance", href: "/dashboard/lecturer/attendance", icon: Clock },
];

export default function lecturerDashboard() {
  return (
    <DashboardLayout userRole="lecturer" userName="Dr. Sarah Johnson" userEmail="sarah.johnson@greenwood.edu" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Good morning, Dr. Johnson!</h2>
          <p className="text-gray-600">Here's an overview of your classes and students today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Across 4 classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Assignments to grade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next class at 10:00 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Class Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Assignments requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { class: "Physics 101", assignment: "Midterm Exam", submitted: 28, total: 30, status: "grading" },
                { class: "Physics 201", assignment: "Lab Report #3", submitted: 22, total: 25, status: "grading" },
                { class: "Physics 101", assignment: "Problem Set 8", submitted: 30, total: 30, status: "graded" },
                { class: "Physics 301", assignment: "Research Paper", submitted: 15, total: 18, status: "pending" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.assignment}</p>
                    <p className="text-sm text-gray-600">{item.class}</p>
                    <p className="text-sm text-gray-500">
                      {item.submitted}/{item.total} submitted
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "graded" ? "default" : item.status === "grading" ? "secondary" : "outline"}>{item.status}</Badge>
                    {item.status === "grading" && (
                      <Button size="sm" variant="outline">
                        Grade
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
              <CardDescription>Your current classes and enrollment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Physics 101 - Introduction to Physics", students: 30, room: "Room 201", time: "10:00 AM" },
                { name: "Physics 201 - Mechanics", students: 25, room: "Room 203", time: "2:00 PM" },
                { name: "Physics 301 - Quantum Physics", students: 18, room: "Room 205", time: "4:00 PM" },
                { name: "Physics Lab", students: 54, room: "Lab 1", time: "Various" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.room} • {item.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.students}</p>
                    <p className="text-sm text-gray-600">students</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes and meetings for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "10:00 AM",
                  activity: "Physics 101 - Lecture",
                  room: "Room 201",
                  type: "Class",
                  status: "upcoming",
                },
                {
                  time: "12:00 PM",
                  activity: "Faculty Meeting",
                  room: "Conference Room",
                  type: "Meeting",
                  status: "upcoming",
                },
                {
                  time: "2:00 PM",
                  activity: "Physics 201 - Lecture",
                  room: "Room 203",
                  type: "Class",
                  status: "upcoming",
                },
                {
                  time: "4:00 PM",
                  activity: "Office Hours",
                  room: "Office 301",
                  type: "Office Hours",
                  status: "upcoming",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="text-sm font-medium text-blue-600 min-w-[80px]">{item.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-gray-600">{item.room}</p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                  {item.status === "upcoming" && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
