"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, Sparkles, X } from "lucide-react";
import { aiService, type AIAssistantRequest } from "@/lib/ai-service";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
}

interface AIAssistantProps {
  userRole: "student" | "teacher" | "admin" | "parent";
  userId: string;
  currentPage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ userRole, userId, currentPage, isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm your AI assistant. I'm here to help you with your ${userRole} tasks. What can I help you with today?`,
      timestamp: new Date(),
      suggestions: [
        userRole === "student" ? "Help me study for my exam" : userRole === "teacher" ? "Create a lesson plan" : userRole === "admin" ? "Analyze school performance" : "Check my child's progress",
        "Schedule assistance",
        "Academic guidance",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const request: AIAssistantRequest = {
        message: input,
        context: {
          userRole,
          userId,
          currentPage,
          additionalData: {
            recentMessages: messages.slice(-5).map((m) => ({ type: m.type, content: m.content })),
          },
        },
      };

      const response = await aiService.generateResponse(request);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleActionClick = (action: any) => {
    // Handle different action types
    console.log("Action clicked:", action);
    // You can implement specific actions based on the action.action value
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
            <Badge variant="secondary" className="ml-2">
              {userRole}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-80">Suggestions:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button key={index} variant="outline" size="sm" className="text-xs h-6 bg-white/10 border-white/20 hover:bg-white/20" onClick={() => handleSuggestionClick(suggestion)}>
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-80">Quick Actions:</p>
                        <div className="space-y-1">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-white/10 border-white/20 hover:bg-white/20 w-full justify-start"
                              onClick={() => handleActionClick(action)}>
                              <Sparkles className="h-3 w-3 mr-1" />
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." onKeyPress={(e) => e.key === "Enter" && handleSend()} disabled={isLoading} />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
