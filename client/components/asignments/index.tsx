"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash2, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useWebSocket } from "@/lib/websocket";
import { aiService } from "@/lib/ai-service";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  points: number;
  status: "draft" | "published" | "closed";
  submissions: number;
  totalStudents: number;
  createdBy: string;
  createdAt: Date;
}

interface AssignmentManagerProps {
  userRole: "teacher" | "admin";
  userId: string;
  className?: string;
}

export default function AssignmentManager({ userRole, userId, className }: AssignmentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Physics Lab Report: Motion Analysis",
      description: "Analyze the motion of objects using kinematic equations and create a comprehensive lab report.",
      subject: "Physics",
      dueDate: new Date("2024-03-20"),
      points: 100,
      status: "published",
      submissions: 22,
      totalStudents: 25,
      createdBy: userId,
      createdAt: new Date("2024-03-01"),
    },
    {
      id: "2",
      title: "Mathematics Problem Set 8",
      description: "Complete problems 1-20 from Chapter 8: Calculus Applications",
      subject: "Mathematics",
      dueDate: new Date("2024-03-25"),
      points: 50,
      status: "published",
      submissions: 18,
      totalStudents: 30,
      createdBy: userId,
      createdAt: new Date("2024-03-10"),
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: new Date(),
    points: 100,
  });

  const { sendMessage } = useWebSocket(userId, userRole);

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject) {
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: "draft",
      submissions: 0,
      totalStudents: 30, // This would come from actual class data
      createdBy: userId,
      createdAt: new Date(),
    };

    setAssignments((prev) => [assignment, ...prev]);

    // Reset form
    setNewAssignment({
      title: "",
      description: "",
      subject: "",
      dueDate: new Date(),
      points: 100,
    });
    setIsCreating(false);

    // Send WebSocket notification
    sendMessage({
      type: "assignment",
      data: {
        action: "created",
        assignment: assignment,
        message: `New assignment "${assignment.title}" has been created`,
      },
      timestamp: new Date().toISOString(),
    });
  };

  const handlePublishAssignment = async (assignmentId: string) => {
    setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? { ...a, status: "published" as const } : a)));

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      // Send notification to all students
      sendMessage({
        type: "notification",
        data: {
          type: "info",
          title: "New Assignment Published",
          message: `"${assignment.title}" is now available. Due: ${format(assignment.dueDate, "MMM dd, yyyy")}`,
          actionUrl: `/assignments/${assignmentId}`,
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  };

  const generateAIDescription = async (title: string, subject: string) => {
    if (!title || !subject) return;

    try {
      const response = await aiService.generateResponse({
        message: `Create a detailed assignment description for: "${title}" in ${subject}. Include learning objectives, requirements, and grading criteria.`,
        context: {
          userRole: "teacher",
          userId,
          additionalData: { subject, title },
        },
      });

      setNewAssignment((prev) => ({
        ...prev,
        description: response.message,
      }));
    } catch (error) {
      console.error("Failed to generate AI description:", error);
    }
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "draft":
        return <Edit className="h-3 w-3" />;
      case "published":
        return <CheckCircle className="h-3 w-3" />;
      case "closed":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Assignment Manager</h2>
          <p className="text-gray-600">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create Assignment Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Fill in the details for your new assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input id="title" value={newAssignment.title} onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter assignment title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={newAssignment.subject} onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <Button variant="outline" size="sm" onClick={() => generateAIDescription(newAssignment.title, newAssignment.subject)} disabled={!newAssignment.title || !newAssignment.subject}>
                    ✨ Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter assignment description, requirements, and grading criteria"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newAssignment.dueDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={newAssignment.dueDate} onSelect={(date) => date && setNewAssignment((prev) => ({ ...prev, dueDate: date }))} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment}>Create Assignment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {assignment.title}
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {assignment.subject} • Due: {format(assignment.dueDate, "MMM dd, yyyy")} • {assignment.points} points
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {assignment.status === "draft" && (
                    <Button size="sm" onClick={() => handlePublishAssignment(assignment.id)}>
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setEditingAssignment(assignment)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAssignment(assignment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{assignment.description}</p>

              {assignment.status === "published" && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{assignment.submissions}</div>
                      <div className="text-xs text-gray-600">Submitted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-600">{assignment.totalStudents - assignment.submissions}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{Math.round((assignment.submissions / assignment.totalStudents) * 100)}%</div>
                      <div className="text-xs text-gray-600">Completion</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Submissions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
