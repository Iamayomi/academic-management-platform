"use client";

import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Assignment, Course, CreateCourseData, LoginData, RecommendData, RegisterData, SyllabusData, UpdateCourseData, User } from "@/types/interface";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Use toast for error notifications
    const { toast } = useToast();
    const message = (error.response?.data as any)?.message || error.message || "An error occurred";
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    return Promise.reject(error);
  }
);

// Authentication
export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data as { message: string; user: User };
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  if (response.data.accessToken && typeof window !== "undefined") {
    localStorage.setItem("token", response.data.accessToken);
  }
  return response.data as { accessToken: string; user: User };
};

export const logout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  return { message: "Logged out successfully" };
};

export const getUserProfile = async () => {
  const { data } = await api.get("/users/me");
  return data as User;
};

// Course Management
export const getCourses = async () => {
  const { data } = await api.get("/courses");
  return data.data as Course[];
};

export const getCourseById = async (id: number) => {
  const { data } = await api.get(`/courses/${id}`);
  return data as Course;
};

export const createCourse = async (courseData: CreateCourseData, syllabusFile?: File) => {
  const formData = new FormData();
  formData.append("title", courseData.title);
  formData.append("credits", courseData.credits.toString());
  if (courseData.syllabus) formData.append("syllabus", courseData.syllabus);
  if (syllabusFile) formData.append("file", syllabusFile);

  const { data } = await api.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as Course;
};

export const updateCourse = async (id: number, courseData: UpdateCourseData, syllabusFile?: File) => {
  const formData = new FormData();
  if (courseData.title) formData.append("title", courseData.title);
  if (courseData.credits) formData.append("credits", courseData.credits.toString());
  if (courseData.syllabus) formData.append("syllabus", courseData.syllabus);
  if (syllabusFile) formData.append("file", syllabusFile);

  const { data } = await api.put(`/courses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as Course;
};

export const enrollCourse = async (courseId: number) => {
  const { data } = await api.post("/courses/enroll", { courseId });
  return data as { message: string };
};

export const unenrollCourse = async (courseId: number) => {
  const { data } = await api.delete(`/courses/enroll/${courseId}`);
  return data as { message: string };
};

export const getCourseGrades = async (courseId: number) => {
  const { data } = await api.get(`/courses/${courseId}/grades`);
  return data as { grade: number };
};

// Dashboards
export const getStudentDashboard = async () => {
  const { data } = await api.get("/courses/students/dashboard");
  return data as { courses: Course[]; assignments: { [key: string]: number } };
};

export const getLecturerDashboard = async () => {
  const { data } = await api.get("/courses/lecturers/dashboard");
  return data as { courses: Course[]; assignments: Assignment[] };
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/courses/admins/dashboard");
  return data as { overview: { courseCount: number; userCount: number; pendingEnrollments: number } };
};

// AI Features
export const getRecommendedCourses = async (dto: RecommendData) => {
  const { data } = await api.post("/ai/recommend", dto);
  return data.recommendedCourses as Course[];
};

export const generateSyllabus = async (dto: SyllabusData) => {
  const { data } = await api.post("/ai/syllabus", dto);
  return data as string;
};

// Assignments
export const submitAssignment = async (courseId: number, file: File) => {
  const formData = new FormData();
  formData.append("courseId", courseId.toString());
  formData.append("file", file);

  const { data } = await api.post("/assignments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as Assignment;
};

export const gradeAssignment = async (assignmentId: number, grade: number) => {
  const { data } = await api.put(`/assignments/${assignmentId}/grade`, { grade });
  return data as Assignment;
};

export default api;
