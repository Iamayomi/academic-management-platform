"use client";

import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface AIAssistantRequest {
  message: string;
  context?: {
    userRole: "student" | "teacher" | "admin" | "parent";
    userId: string;
    currentPage?: string;
    additionalData?: any;
  };
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
}

class AIService {
  private getSystemPrompt(userRole: string): string {
    const basePrompt = "You are an AI assistant for a school management system. Be helpful, professional, and educational.";

    const rolePrompts = {
      student: `${basePrompt} You're helping a student with their academic needs. Focus on:
        - Study tips and learning strategies
        - Assignment help and organization
        - Schedule management
        - Academic goal setting
        - Homework assistance (guide, don't do the work)`,

      teacher: `${basePrompt} You're helping a teacher with their educational duties. Focus on:
        - Lesson planning and curriculum development
        - Student assessment and grading strategies
        - Classroom management techniques
        - Educational resources and tools
        - Parent communication strategies`,

      admin: `${basePrompt} You're helping a school administrator. Focus on:
        - School operations and management
        - Policy development and implementation
        - Data analysis and reporting
        - Resource allocation and budgeting
        - Staff management and development`,

      parent: `${basePrompt} You're helping a parent monitor their child's education. Focus on:
        - Understanding academic progress
        - Supporting learning at home
        - Communication with teachers
        - Educational resources for parents
        - Child development and motivation`,
    };

    return rolePrompts[userRole as keyof typeof rolePrompts] || basePrompt;
  }

  async generateResponse(request: AIAssistantRequest): Promise<AIResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(request.context?.userRole || "student");

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: `User message: ${request.message}
        
        Context: ${JSON.stringify(request.context, null, 2)}
        
        Please provide a helpful response and suggest 2-3 relevant actions the user can take.
        Format your response as JSON with 'message', 'suggestions', and 'actions' fields.`,
      });

      try {
        return JSON.parse(text);
      } catch {
        // Fallback if JSON parsing fails
        return {
          message: text,
          suggestions: [],
          actions: [],
        };
      }
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        suggestions: ["Try rephrasing your question", "Check your internet connection"],
        actions: [],
      };
    }
  }

  async *streamResponse(request: AIAssistantRequest) {
    try {
      const systemPrompt = this.getSystemPrompt(request.context?.userRole || "student");

      const result = streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: request.message,
      });

      for await (const chunk of result.textStream) {
        yield chunk;
      }
    } catch (error) {
      console.error("AI Streaming Error:", error);
      yield "I'm sorry, I'm having trouble processing your request right now.";
    }
  }

  // Specialized AI functions for different user roles
  async generateAssignmentFeedback(assignment: any, studentWork: string): Promise<string> {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are an educational AI assistant helping teachers provide constructive feedback on student assignments.",
      prompt: `Assignment: ${JSON.stringify(assignment)}
      Student Work: ${studentWork}
      
      Please provide constructive, encouraging feedback that:
      1. Highlights strengths
      2. Identifies areas for improvement
      3. Offers specific suggestions
      4. Maintains a positive, educational tone`,
    });

    return text;
  }

  async generateStudyPlan(subjects: string[], timeAvailable: number, goals: string[]): Promise<any> {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are an educational AI assistant helping students create effective study plans.",
      prompt: `Create a personalized study plan with:
      Subjects: ${subjects.join(", ")}
      Available time per day: ${timeAvailable} hours
      Goals: ${goals.join(", ")}
      
      Format as JSON with daily schedule, study techniques, and progress tracking suggestions.`,
    });

    try {
      return JSON.parse(text);
    } catch {
      return { error: "Failed to generate study plan" };
    }
  }

  async analyzeLearningPatterns(studentData: any): Promise<any> {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are an educational data analyst AI helping identify learning patterns and provide insights.",
      prompt: `Analyze this student data and provide insights:
      ${JSON.stringify(studentData)}
      
      Provide analysis on:
      1. Learning strengths and weaknesses
      2. Performance trends
      3. Recommended interventions
      4. Personalized learning strategies
      
      Format as JSON with clear sections for each analysis area.`,
    });

    try {
      return JSON.parse(text);
    } catch {
      return { error: "Failed to analyze learning patterns" };
    }
  }
}

export const aiService = new AIService();
