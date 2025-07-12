"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  status?: "online" | "offline" | "away" | "busy" | "invisible";
  showStatus?: boolean;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "student" | "teacher" | "admin" | "parent";
}

export function AvatarWithStatus({ src, alt, fallback, size = "md", status = "offline", showStatus = true, className, variant = "default" }: AvatarWithStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-400";
      case "invisible":
        return "bg-gray-300";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case "xs":
        return "h-1.5 w-1.5";
      case "sm":
        return "h-2 w-2";
      case "md":
        return "h-2.5 w-2.5";
      case "lg":
        return "h-3 w-3";
      case "xl":
        return "h-3.5 w-3.5";
      case "2xl":
        return "h-4 w-4";
      case "3xl":
        return "h-5 w-5";
      case "4xl":
        return "h-6 w-6";
      default:
        return "h-2.5 w-2.5";
    }
  };

  const getStatusPosition = () => {
    switch (size) {
      case "xs":
        return "bottom-0 right-0";
      case "sm":
        return "bottom-0 right-0";
      case "md":
        return "bottom-0 right-0";
      case "lg":
        return "bottom-0.5 right-0.5";
      case "xl":
        return "bottom-0.5 right-0.5";
      case "2xl":
        return "bottom-1 right-1";
      case "3xl":
        return "bottom-1 right-1";
      case "4xl":
        return "bottom-1.5 right-1.5";
      default:
        return "bottom-0 right-0";
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar size={size}>
        <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
        <AvatarFallback size={size} variant={variant}>
          {fallback}
        </AvatarFallback>
      </Avatar>
      {showStatus && <span className={cn("absolute rounded-full ring-2 ring-white", getStatusColor(), getStatusSize(), getStatusPosition())} title={`Status: ${status}`} />}
    </div>
  );
}
