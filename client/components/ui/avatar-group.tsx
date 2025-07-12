"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback: string;
    name?: string;
  }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  showTooltip?: boolean;
}

export function AvatarGroup({ avatars, max = 5, size = "md", className, showTooltip = true }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const getOverlapClass = () => {
    switch (size) {
      case "xs":
        return "-space-x-1";
      case "sm":
        return "-space-x-2";
      case "md":
        return "-space-x-2";
      case "lg":
        return "-space-x-3";
      case "xl":
        return "-space-x-4";
      case "2xl":
        return "-space-x-5";
      case "3xl":
        return "-space-x-6";
      case "4xl":
        return "-space-x-8";
      default:
        return "-space-x-2";
    }
  };

  return (
    <div className={cn("flex items-center", getOverlapClass(), className)}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative ring-2 ring-white rounded-full" title={showTooltip ? avatar.name || avatar.alt : undefined}>
          <Avatar size={size}>
            <AvatarImage src={avatar.src || "/placeholder.svg"} alt={avatar.alt} />
            <AvatarFallback size={size}>{avatar.fallback}</AvatarFallback>
          </Avatar>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="relative ring-2 ring-white rounded-full">
          <Avatar size={size}>
            <AvatarFallback size={size} variant="secondary">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
