// Authentication utilities and types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin" | "parent";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Add this interface for sign up data
export interface SignUpData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  grade?: string;
  parentStudentId?: string;
  emergencyContact?: string;
}

// Mock authentication functions
export async function signIn(email: string, password: string, role: string): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock user data based on role
  const mockUsers: Record<string, User> = {
    student: {
      id: "1",
      email: "john.smith@student.greenwood.edu",
      name: "John Smith",
      role: "student",
    },
    teacher: {
      id: "2",
      email: "sarah.johnson@greenwood.edu",
      name: "Dr. Sarah Johnson",
      role: "teacher",
    },
    admin: {
      id: "3",
      email: "michael.chen@greenwood.edu",
      name: "Michael Chen",
      role: "admin",
    },
    parent: {
      id: "4",
      email: "jennifer.smith@parent.greenwood.edu",
      name: "Jennifer Smith",
      role: "parent",
    },
  };

  return mockUsers[role] || mockUsers.student;
}

// Add the signUp function after the signIn function
export async function signUp(signUpData: SignUpData): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Validate email doesn't already exist (mock validation)
  const existingEmails = ["john.smith@student.greenwood.edu", "sarah.johnson@greenwood.edu", "michael.chen@greenwood.edu", "jennifer.smith@parent.greenwood.edu"];

  if (existingEmails.includes(signUpData.email)) {
    throw new Error("Email already exists");
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: signUpData.email,
    name: `${signUpData.firstName} ${signUpData.lastName}`,
    role: signUpData.role as "student" | "teacher" | "admin" | "parent",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signUpData.firstName}${signUpData.lastName}`,
  };

  // In a real app, this would save to database
  console.log("New user registered:", newUser);
  console.log("Registration data:", signUpData);

  return newUser;
}

export async function signOut(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
}

export function getCurrentUser(): User | null {
  // In a real app, this would check localStorage, cookies, or make an API call
  return null;
}
