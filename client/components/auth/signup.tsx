"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Users, Shield, UserCheck, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Building, FileText, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/lib/auth";

interface SignUpFormData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  studentId?: string;
  employeeId?: string;
  department?: string;
  grade?: string;
  parentStudentId?: string;
  emergencyContact?: string;
  address: string;
  agreeToTerms: boolean;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormData>({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    agreeToTerms: false,
  });

  const roles = [
    { value: "student", label: "Student", icon: GraduationCap, color: "text-blue-600" },
    { value: "teacher", label: "Teacher", icon: Users, color: "text-green-600" },
    { value: "admin", label: "Administrator", icon: Shield, color: "text-red-600" },
    { value: "parent", label: "Parent/Guardian", icon: UserCheck, color: "text-purple-600" },
  ];

  const grades = [
    "Pre-K",
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ];

  const departments = ["Mathematics", "Science", "English", "History", "Physical Education", "Art", "Music", "Computer Science", "Foreign Languages", "Special Education"];

  const updateFormData = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.role || !formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Password",
        description: "Please enter and confirm your password.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone || !formData.dateOfBirth) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.address || !formData.agreeToTerms) {
      toast({
        title: "Missing Information",
        description: "Please complete all fields and agree to the terms.",
        variant: "destructive",
      });
      return false;
    }

    // Role-specific validation
    if (formData.role === "student" && !formData.grade) {
      toast({
        title: "Missing Grade",
        description: "Please select your grade level.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.role === "teacher" && !formData.department) {
      toast({
        title: "Missing Department",
        description: "Please select your department.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.role === "parent" && !formData.parentStudentId) {
      toast({
        title: "Missing Student ID",
        description: "Please enter your child's student ID.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      const user = await signUp(formData);

      toast({
        title: "Registration Successful!",
        description: `Welcome to Greenwood Academy! Your account has been created.`,
      });

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push(`/dashboard/${formData.role}`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="role">Select Your Role *</Label>
        <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose your role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${role.color}`} />
                    <span>{role.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="firstName" type="text" placeholder="Enter first name" className="pl-10" value={formData.firstName} onChange={(e) => updateFormData("firstName", e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="lastName" type="text" placeholder="Enter last name" className="pl-10" value={formData.lastName} onChange={(e) => updateFormData("lastName", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input id="email" type="email" placeholder="Enter your email address" className="pl-10" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} required />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            required
          />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            required
          />
          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
      </div>

      {/* Phone and Date of Birth */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="phone" type="tel" placeholder="(555) 123-4567" className="pl-10" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="dateOfBirth" type="date" className="pl-10" value={formData.dateOfBirth} onChange={(e) => updateFormData("dateOfBirth", e.target.value)} required />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {/* Role-specific fields */}
      {formData.role === "student" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level *</Label>
            <Select value={formData.grade || ""} onValueChange={(value) => updateFormData("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID (if known)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="studentId" type="text" placeholder="Enter student ID" className="pl-10" value={formData.studentId || ""} onChange={(e) => updateFormData("studentId", e.target.value)} />
            </div>
          </div>
        </>
      )}

      {formData.role === "teacher" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select value={formData.department || ""} onValueChange={(value) => updateFormData("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID (if known)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="employeeId" type="text" placeholder="Enter employee ID" className="pl-10" value={formData.employeeId || ""} onChange={(e) => updateFormData("employeeId", e.target.value)} />
            </div>
          </div>
        </>
      )}

      {formData.role === "parent" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="parentStudentId">Child's Student ID *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="parentStudentId"
                type="text"
                placeholder="Enter your child's student ID"
                className="pl-10"
                value={formData.parentStudentId || ""}
                onChange={(e) => updateFormData("parentStudentId", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emergencyContact"
                type="tel"
                placeholder="Emergency contact number"
                className="pl-10"
                value={formData.emergencyContact || ""}
                onChange={(e) => updateFormData("emergencyContact", e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Textarea id="address" placeholder="Enter your full address" className="pl-10 min-h-[80px]" value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} required />
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)} />
        <Label htmlFor="agreeToTerms" className="text-sm leading-5">
          I agree to the{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* School Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Greenwood Academy</h1>
          <p className="text-gray-600 mt-1">Join Our School Community</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={handleBack} className="p-1">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
                <CardDescription>
                  Step {currentStep} of 3 - {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Security & Contact" : "Additional Details"}
                </CardDescription>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 3) * 100}%` }} />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700" disabled={!formData.role && currentStep === 1}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || !formData.agreeToTerms}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">Need help? Contact IT Support at support@greenwoodacademy.edu</p>
        </div>
      </div>
    </div>
  );
}
