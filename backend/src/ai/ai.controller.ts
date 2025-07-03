import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { RecommendDto, SyllabusDto } from './dto/ai.dto';
import { GuardRoute, RoleAllowed } from '../lib';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}
  
  @GuardRoute()
  @Post('recommend')
  async recommend(@Body() dto: RecommendDto) {
    return this.aiService.recommendCourses(dto);
  }

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Post('syllabus')
  async generateSyllabus(@Body() dto: SyllabusDto, @Request() req) {
    return this.aiService.generateSyllabus(dto, req.user);
  }
}
