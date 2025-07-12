"use client";

import { WebSocketMessage, Notification } from "@/types/interface";
import { useEffect, useState } from "react";

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private listeners: ((message: WebSocketMessage) => void)[] = [];

  connect(userId: string, userRole: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // In production, use wss:// and your actual WebSocket server
      this.ws = new WebSocket(`ws://localhost:3001/ws?userId=${userId}&role=${userRole}`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(message));
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.attemptReconnect(userId, userRole);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      this.attemptReconnect(userId, userRole);
    }
  }

  private attemptReconnect(userId: string, userRole: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(userId, userRole);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  subscribe(listener: (message: WebSocketMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager();

export function useWebSocket(userId: string, userRole: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsManager.connect(userId, userRole);

    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      setIsConnected(true);

      if (message.type === "notification") {
        const notification: Notification = {
          id: Date.now().toString(),
          type: message.data.type || "info",
          title: message.data.title,
          message: message.data.message,
          timestamp: message.timestamp,
          read: false,
          actionUrl: message.data.actionUrl,
        };

        setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
      }
    });

    return () => {
      unsubscribe();
      wsManager.disconnect();
      setIsConnected(false);
    };
  }, [userId, userRole]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    isConnected,
    markAsRead,
    clearAll,
    sendMessage: (message: WebSocketMessage) => wsManager.send(message),
  };
}
