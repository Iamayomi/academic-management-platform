"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, GraduationCap, BookOpen, Settings, BarChart3, UserPlus, AlertTriangle, DollarSign } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard/admin", icon: BarChart3, current: true },
  { name: "Students", href: "/dashboard/admin/students", icon: GraduationCap },
  { name: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
  { name: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
  { name: "Enrollment", href: "/dashboard/admin/enrollment", icon: UserPlus },
  { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout userRole="admin" userName="Michael Chen" userEmail="michael.chen@greenwood.edu" navigation={navigation}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School Administration Dashboard</h2>
          <p className="text-gray-600">Overview of school operations and key metrics.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">3 new hires this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Spring 2024 semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest administrative actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  action: "New student enrollment",
                  details: "Sarah Williams - Grade 10",
                  time: "2 hours ago",
                  type: "enrollment",
                },
                {
                  action: "Teacher assignment updated",
                  details: "Dr. Johnson - Physics 301",
                  time: "4 hours ago",
                  type: "assignment",
                },
                {
                  action: "Course schedule modified",
                  details: "Mathematics - Room change",
                  time: "6 hours ago",
                  type: "schedule",
                },
                {
                  action: "System maintenance completed",
                  details: "Database optimization",
                  time: "1 day ago",
                  type: "system",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { alert: "Low attendance in Physics 201", severity: "warning", action: "Review attendance records" },
                { alert: "Server maintenance scheduled", severity: "info", action: "Notify users about downtime" },
                { alert: "Payment overdue - 5 students", severity: "high", action: "Send payment reminders" },
                { alert: "New teacher onboarding pending", severity: "medium", action: "Complete orientation process" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        item.severity === "high" ? "text-red-500" : item.severity === "warning" ? "text-yellow-500" : item.severity === "medium" ? "text-orange-500" : "text-blue-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{item.alert}</p>
                      <p className="text-sm text-gray-600">{item.action}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Action
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Student enrollment and performance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { dept: "Mathematics", students: 342, teachers: 18, avgGrade: 85, capacity: 90 },
                { dept: "Science", students: 298, teachers: 15, avgGrade: 82, capacity: 85 },
                { dept: "English", students: 267, teachers: 12, avgGrade: 88, capacity: 80 },
                { dept: "History", students: 189, teachers: 9, avgGrade: 86, capacity: 75 },
                { dept: "Arts", students: 151, teachers: 8, avgGrade: 91, capacity: 70 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="font-medium min-w-[100px]">{item.dept}</span>
                      <span className="text-sm text-gray-600">
                        {item.students} students • {item.teachers} teachers
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Avg: {item.avgGrade}%</span>
                      <Badge variant={item.capacity > 85 ? "destructive" : item.capacity > 75 ? "secondary" : "default"}>{item.capacity}% capacity</Badge>
                    </div>
                  </div>
                  <Progress value={item.capacity} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
