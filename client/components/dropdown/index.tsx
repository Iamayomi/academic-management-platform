"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, User, Settings, LogOut, Bell, BookOpen, Users, GraduationCap, Shield, UserCheck, Plus, Filter, SortAsc, MoreHorizontal } from "lucide-react";

// User Profile Dropdown
interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
    role: "student" | "teacher" | "admin" | "parent";
    avatar?: string;
    initials: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function UserProfileDropdown({ user, onProfileClick, onSettingsClick, onLogoutClick }: UserProfileDropdownProps) {
  const getRoleIcon = () => {
    switch (user.role) {
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      case "teacher":
        return <Users className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "parent":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case "student":
        return "text-blue-600";
      case "teacher":
        return "text-green-600";
      case "admin":
        return "text-red-600";
      case "parent":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn("flex items-center gap-1 text-xs", getRoleColor())}>
                {getRoleIcon()}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <Badge variant="destructive" className="ml-auto text-xs">
            3
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutClick} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Subject/Course Selector Dropdown
interface SubjectSelectorProps {
  subjects: Array<{
    id: string;
    name: string;
    code: string;
    color?: string;
    studentCount?: number;
  }>;
  selectedSubject?: string;
  onSubjectChange?: (subjectId: string) => void;
  placeholder?: string;
}

export function SubjectSelector({ subjects, selectedSubject, onSubjectChange, placeholder = "Select Subject" }: SubjectSelectorProps) {
  const selected = subjects.find((s) => s.id === selectedSubject);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {selected ? (
              <div className="flex items-center gap-2">
                <span>{selected.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selected.code}
                </Badge>
              </div>
            ) : (
              placeholder
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Select Subject</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {subjects.map((subject) => (
          <DropdownMenuItem key={subject.id} onClick={() => onSubjectChange?.(subject.id)} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color || "#3b82f6" }} />
              <div>
                <p className="font-medium">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{subject.code}</p>
              </div>
            </div>
            {subject.studentCount && (
              <Badge variant="outline" className="text-xs">
                {subject.studentCount} students
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Filter Dropdown with Checkboxes
interface FilterDropdownProps {
  title: string;
  filters: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export function FilterDropdown({ title, filters, selectedFilters, onFiltersChange }: FilterDropdownProps) {
  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId) ? selectedFilters.filter((id) => id !== filterId) : [...selectedFilters, filterId];
    onFiltersChange(newFilters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {title}
          {selectedFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {selectedFilters.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters.map((filter) => (
          <DropdownMenuCheckboxItem key={filter.id} checked={selectedFilters.includes(filter.id)} onCheckedChange={() => handleFilterToggle(filter.id)}>
            <div className="flex items-center justify-between w-full">
              <span>{filter.label}</span>
              {filter.count && <span className="text-xs text-muted-foreground">{filter.count}</span>}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
        {selectedFilters.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFiltersChange([])}>Clear all filters</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Sort Dropdown with Radio Options
interface SortDropdownProps {
  options: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  selectedSort: string;
  onSortChange: (sortId: string) => void;
}

export function SortDropdown({ options, selectedSort, onSortChange }: SortDropdownProps) {
  const selected = options.find((option) => option.id === selectedSort);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <SortAsc className="h-4 w-4 mr-2" />
          Sort: {selected?.label || "Default"}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedSort} onValueChange={onSortChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Action Dropdown (Three Dots Menu)
interface ActionDropdownProps {
  actions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    variant?: "default" | "destructive";
    disabled?: boolean;
  }>;
  onActionClick: (actionId: string) => void;
}

export function ActionDropdown({ actions, onActionClick }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <DropdownMenuItem onClick={() => onActionClick(action.id)} disabled={action.disabled} className={cn(action.variant === "destructive" && "text-red-600 focus:text-red-600")}>
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </DropdownMenuItem>
            {index < actions.length - 1 && action.variant === "destructive" && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick Add Dropdown
interface QuickAddDropdownProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
  }>;
  onItemClick: (itemId: string) => void;
}

export function QuickAddDropdown({ items, onItemClick }: QuickAddDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.id} onClick={() => onItemClick(item.id)} className="flex flex-col items-start gap-1 p-3">
            <div className="flex items-center gap-2 w-full">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.description && <p className="text-xs text-muted-foreground ml-6">{item.description}</p>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Navigation Dropdown with Nested Menus
interface NavigationDropdownProps {
  title: string;
  icon: React.ReactNode;
  sections: Array<{
    label: string;
    items: Array<{
      id: string;
      label: string;
      icon: React.ReactNode;
      href?: string;
      badge?: string;
    }>;
  }>;
  onItemClick: (itemId: string, href?: string) => void;
}

export function NavigationDropdown({ title, icon, sections, onItemClick }: NavigationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="justify-start">
          {icon}
          <span className="ml-2">{title}</span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {sections.map((section, sectionIndex) => (
          <React.Fragment key={section.label}>
            <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
            {section.items.map((item) => (
              <DropdownMenuItem key={item.id} onClick={() => onItemClick(item.id, item.href)} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
            {sectionIndex < sections.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
