"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      "2xl": "h-20 w-20",
      "3xl": "h-24 w-24",
      "4xl": "h-32 w-32",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>>(
  ({ className, size, ...props }, ref) => <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const avatarFallbackVariants = cva("flex h-full w-full items-center justify-center rounded-full font-medium", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      success: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
      student: "bg-blue-100 text-blue-700",
      teacher: "bg-green-100 text-green-700",
      admin: "bg-red-100 text-red-700",
      parent: "bg-purple-100 text-purple-700",
    },
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-xl",
      "3xl": "text-2xl",
      "4xl": "text-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & VariantProps<typeof avatarFallbackVariants>
>(({ className, variant, size, ...props }, ref) => <AvatarPrimitive.Fallback ref={ref} className={cn(avatarFallbackVariants({ variant, size }), className)} {...props} />);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, avatarFallbackVariants };
