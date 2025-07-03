import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GuardRoute, RoleAllowed } from '../lib';
import { AssignmentsService } from './assignments.service';
import { SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @RoleAllowed('student')
  @GuardRoute()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )
  async submit(
    @Body() dto: SubmitAssignmentDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assignmentsService.submitAssignment(dto, req.user, file);
  }

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Put('grade')
  async grade(@Body() dto: GradeAssignmentDto, @Request() req) {
    return this.assignmentsService.gradeAssignment(
      dto.assignmentId,
      dto,
      req.user,
    );
  }
}
