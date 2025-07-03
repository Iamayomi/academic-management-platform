import { Injectable } from '@nestjs/common';
import { RecommendDto, SyllabusDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  async recommendCourses(dto: RecommendDto) {
    // Mock AI recommendation
    const mockCourses = [
      'Introduction to AI',
      'Data Science Basics',
      'Machine Learning 101',
    ];
    return { courses: mockCourses };
  }

  async generateSyllabus(dto: SyllabusDto, user: any) {
    // Mock AI syllabus generation
    const syllabus = `Syllabus for ${dto.topic}\nWeek 1: Introduction\nWeek 2: Core Concepts\nWeek 3: Advanced Topics`;
    return { syllabus };
  }
}
