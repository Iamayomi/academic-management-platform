"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Camera, Upload, X } from "lucide-react";

interface AvatarUploadProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "student" | "teacher" | "admin" | "parent";
  onImageChange?: (file: File | null) => void;
  onImageRemove?: () => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
}

export function AvatarUpload({ src, alt, fallback, size = "xl", variant = "default", onImageChange, onImageRemove, className, disabled = false, accept = "image/*" }: AvatarUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | undefined>(src);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn("relative group cursor-pointer transition-all duration-200", isDragging && "scale-105", disabled && "cursor-not-allowed opacity-50")}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}>
        <Avatar size={size} className="transition-all duration-200 group-hover:brightness-75">
          <AvatarImage src={preview || "/placeholder.svg"} alt={alt} />
          <AvatarFallback size={size} variant={variant}>
            {fallback}
          </AvatarFallback>
        </Avatar>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="h-6 w-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Change</span>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/20 rounded-full border-2 border-primary border-dashed flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>

      {/* Remove button */}
      {preview && !disabled && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}>
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" disabled={disabled} />
    </div>
  );
}
