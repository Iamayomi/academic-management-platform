export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "lecturer" | "admin";
}

export interface Course {
  id: number;
  title: string;
  credits: number;
  lecturerId: number;
  syllabus?: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  status: "pending" | "approved" | "rejected";
}

export interface Assignment {
  id: number;
  courseId: number;
  studentId: number;
  file?: string;
  grade?: number;
}

export interface RecommendData {
  interests: string[];
  completedCourseIds: number[];
}

export interface SyllabusData {
  courseTitle: string;
  objectives: string;
}

export interface CreateCourseData {
  title: string;
  credits: number;
  syllabus?: string;
}

export interface UpdateCourseData {
  title?: string;
  credits?: number;
  syllabus?: string;
}

export interface EnrollCourseData {
  courseId: number;
}

export interface WebSocketMessage {
  type: "notification" | "assignment" | "grade" | "attendance" | "message";
  data: any;
  timestamp: string;
  userId?: string;
  userRole?: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type RegisterData = Partial<User>;

export type LoginData = Pick<User, "email" | "role" | "password">;

export interface GradeAssignmentData {
  grade: number;
}
