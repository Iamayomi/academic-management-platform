"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, CheckCheck, X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useWebSocket } from "@/lib/websocket";
import { Notification } from "@/types/interface";

interface NotificationCenterProps {
  userId: string;
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ userId, userRole, isOpen, onClose }: NotificationCenterProps) {
  const { notifications, markAsRead, clearAll } = useWebSocket(userId, userRole);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((n) => filter === "all" || (filter === "unread" && !n.read));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Filter Tabs */}
          <div className="flex border-b px-6 pb-2">
            <Button variant={filter === "all" ? "default" : "ghost"} size="sm" onClick={() => setFilter("all")} className="mr-2">
              All ({notifications.length})
            </Button>
            <Button variant={filter === "unread" ? "default" : "ghost"} size="sm" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </Button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex justify-between items-center px-6 py-2 border-b">
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  notifications.forEach((n) => {
                    if (!n.read) markAsRead(n.id);
                  });
                }}
                className="text-xs">
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 rounded-r-lg transition-colors cursor-pointer ${getNotificationColor(notification.type)} ${
                        notification.read ? "bg-gray-50 opacity-75" : "bg-white shadow-sm hover:shadow-md"
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}>
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${notification.read ? "text-gray-600" : "text-gray-900"}`}>{notification.title}</h4>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className={`text-sm mt-1 ${notification.read ? "text-gray-500" : "text-gray-700"}`}>{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(notification.timestamp).toLocaleString()}</p>
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs h-6 bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle navigation to actionUrl
                                console.log("Navigate to:", notification.actionUrl);
                              }}>
                              View Details
                            </Button>
                          )}
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}>
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
